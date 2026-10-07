import os
import sys
import json
import joblib
import logging
import numpy as np
import pandas as pd
from typing import Tuple, Dict, Any
from sklearn.base import BaseEstimator, TransformerMixin

from app.explainer import InsureWiseExplainer

logger = logging.getLogger("insurewise.predictor")


class BloodPressureExtractor(BaseEstimator, TransformerMixin):
    """
    Custom Transformer for parsing string blood pressure (e.g. '120/80')
    into systolic_bp and diastolic_bp float64 columns.
    Must match the class used during model training and pipeline serialization.
    """
    def __init__(self, bp_col='blood_pressure'):
        self.bp_col = bp_col

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        if isinstance(X, pd.DataFrame):
            X_out = X.copy()
        else:
            X_out = pd.DataFrame(X).copy()

        if self.bp_col in X_out.columns:
            split_bp = X_out[self.bp_col].astype(str).str.split('/', expand=True)
            if split_bp.shape[1] >= 2:
                X_out['systolic_bp'] = pd.to_numeric(split_bp[0], errors='coerce').astype('float64')
                X_out['diastolic_bp'] = pd.to_numeric(split_bp[1], errors='coerce').astype('float64')
            elif split_bp.shape[1] == 1:
                X_out['systolic_bp'] = pd.to_numeric(split_bp[0], errors='coerce').astype('float64')
                X_out['diastolic_bp'] = np.nan
            else:
                X_out['systolic_bp'] = np.nan
                X_out['diastolic_bp'] = np.nan
            X_out = X_out.drop(columns=[self.bp_col])
        return X_out

    def get_feature_names_out(self, input_features=None):
        if input_features is None:
            return None
        feature_names = [f for f in input_features if f != self.bp_col]
        feature_names.extend(['systolic_bp', 'diastolic_bp'])
        return np.array(feature_names)


# Ensure BloodPressureExtractor is available in __main__ for joblib unpickling
import __main__
setattr(__main__, 'BloodPressureExtractor', BloodPressureExtractor)


class InsureWisePredictor:
    _instance = None

    def __init__(self):
        self.pipeline = None
        self.explainer = None
        self.model_version = "1.0.0"
        self._is_loaded = False

    def load_model(self, base_dir: str = None):
        """
        Loads the trained production pipeline and initializes the SHAP explainer ONCE.
        """
        if self._is_loaded:
            logger.info("Model is already loaded.")
            return

        model_path = os.environ.get("MODEL_PATH")
        metadata_path = os.environ.get("METADATA_PATH")

        if not model_path:
            if base_dir is None:
                base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            model_path = os.path.join(base_dir, "models", "production", "insurewise_model.joblib")

        if not metadata_path:
            if base_dir is None:
                base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            metadata_path = os.path.join(base_dir, "models", "production", "insurewise_model_metadata.json")

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Production model artifact not found at: {model_path}")

        logger.info(f"Loading production model artifact from: {model_path}")
        self.pipeline = joblib.load(model_path)
        self._is_loaded = True
        logger.info("Production model pipeline successfully loaded into memory.")

        # Read model version from metadata if available
        if os.path.exists(metadata_path):
            try:
                with open(metadata_path, "r", encoding="utf-8") as f:
                    meta = json.load(f)
                    self.model_version = meta.get("model_version", "1.0.0")
            except Exception as e:
                logger.warning(f"Could not read metadata file: {e}")

        # Initialize SHAP explainer
        preprocessor = self.pipeline.named_steps["preprocessor"]
        regressor = self.pipeline.named_steps["regressor"]
        self.explainer = InsureWiseExplainer(regressor=regressor, preprocessor=preprocessor)

    def is_loaded(self) -> bool:
        return self._is_loaded

    def predict(self, input_dict: Dict[str, Any]) -> Tuple[float, str, Dict[str, float]]:
        """
        Predicts annual medical insurance premium and generates SHAP explanation dictionary.
        """
        if not self._is_loaded or self.pipeline is None:
            raise RuntimeError("Model pipeline is not loaded.")

        df_input = pd.DataFrame([input_dict])
        
        # 1. Run pipeline prediction
        raw_pred = self.pipeline.predict(df_input)[0]
        prediction_val = round(float(raw_pred), 2)

        # 2. Run SHAP explanation
        explanation_dict = self.explainer.explain_instance(df_input, self.pipeline)

        return prediction_val, self.model_version, explanation_dict


# Global predictor singleton instance
predictor = InsureWisePredictor()
