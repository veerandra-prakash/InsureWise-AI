import logging
import shap
import numpy as np
import pandas as pd
from typing import Dict

logger = logging.getLogger("insurewise.explainer")


class InsureWiseExplainer:
    def __init__(self, regressor, preprocessor):
        """
        Initializes SHAP TreeExplainer for the XGBoost regressor.
        """
        logger.info("Initializing SHAP TreeExplainer on XGBoost regressor...")
        self.regressor = regressor
        self.preprocessor = preprocessor
        self.tree_explainer = shap.TreeExplainer(self.regressor)
        
        # Retrieve and clean transformed feature names (41 features)
        raw_transformed_names = self.preprocessor.get_feature_names_out()
        self.clean_feature_names = [name.split("__")[-1] for name in raw_transformed_names]
        logger.info(f"SHAP TreeExplainer initialized with {len(self.clean_feature_names)} features.")

    def explain_instance(self, input_df: pd.DataFrame, pipeline) -> Dict[str, float]:
        """
        Calculates local SHAP feature contributions for a single customer input dataframe.
        Returns a dictionary mapping feature names to their SHAP contribution value in USD.
        """
        # Step 1: Preprocess input through bp_extractor and preprocessor
        bp_extractor = pipeline.named_steps["bp_extractor"]
        preprocessor = pipeline.named_steps["preprocessor"]
        
        df_bp = bp_extractor.transform(input_df)
        X_proc = preprocessor.transform(df_bp)
        
        # Step 2: Compute SHAP values for the transformed row
        shap_obj = self.tree_explainer(X_proc)
        shap_vals = shap_obj.values[0]
        
        # Step 3: Map feature names to rounded SHAP contribution values in USD
        explanation = {}
        for fname, val in zip(self.clean_feature_names, shap_vals):
            # Include feature contributions (rounded to 2 decimal places)
            explanation[fname] = round(float(val), 2)
            
        return explanation
