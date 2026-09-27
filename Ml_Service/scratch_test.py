import os, json, joblib
import pandas as pd
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder, OrdinalEncoder
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split, cross_validate, KFold
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, root_mean_squared_error, r2_score

data_path = 'd:/Ml_Project/Ml_Service/Data/Raw/medical_insurance_cost_dataset_enhanced.csv'
df = pd.read_csv(data_path)

target_col = 'annual_medical_cost_usd'
id_col = 'customer_id'

X = df.drop(columns=[target_col, id_col])
y = df[target_col]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

class BloodPressureExtractor(BaseEstimator, TransformerMixin):
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
            X_out['systolic_bp'] = pd.to_numeric(split_bp[0], errors='coerce').astype('float64')
            X_out['diastolic_bp'] = pd.to_numeric(split_bp[1], errors='coerce').astype('float64')
            X_out = X_out.drop(columns=[self.bp_col])
        return X_out

    def get_feature_names_out(self, input_features=None):
        if input_features is None:
            return None
        feature_names = [f for f in input_features if f != self.bp_col]
        feature_names.extend(['systolic_bp', 'diastolic_bp'])
        return np.array(feature_names)

bp_test_transformer = BloodPressureExtractor()
X_train_parsed = bp_test_transformer.transform(X_train)

num_features = X_train_parsed.select_dtypes(include=['int64', 'float64']).columns.tolist()
ordinal_features = ['exercise_level', 'insurance_plan']
ordinal_category_orders = [
    ['Low', 'Moderate', 'High'],
    ['Basic', 'Standard', 'Premium', 'Gold']
]
categorical_all = X_train_parsed.select_dtypes(include=['object', 'str', 'category']).columns.tolist()
nominal_features = [col for col in categorical_all if col not in ordinal_features]

num_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

ord_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OrdinalEncoder(
        categories=ordinal_category_orders,
        handle_unknown='use_encoded_value',
        unknown_value=-1
    ))
])

nom_pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(
        handle_unknown='ignore',
        sparse_output=False
    ))
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', num_pipeline, num_features),
        ('ord', ord_pipeline, ordinal_features),
        ('nom', nom_pipeline, nominal_features)
    ],
    remainder='drop'
)

baseline_pipeline = Pipeline([
    ('bp_extractor', BloodPressureExtractor()),
    ('preprocessor', preprocessor),
    ('regressor', LinearRegression())
])

# Cross-Validation on Training Set
kf = KFold(n_splits=5, shuffle=True, random_state=42)
scoring = {
    'mae': 'neg_mean_absolute_error',
    'mse': 'neg_mean_squared_error',
    'rmse': 'neg_root_mean_squared_error',
    'r2': 'r2'
}

cv_results = cross_validate(baseline_pipeline, X_train, y_train, cv=kf, scoring=scoring, return_train_score=True)

print("=== 5-FOLD CROSS-VALIDATION RESULTS (TRAINING DATA ONLY) ===")
for metric in ['mae', 'mse', 'rmse', 'r2']:
    if metric in ['mae', 'mse', 'rmse']:
        val_scores = -cv_results[f'test_{metric}']
        train_scores = -cv_results[f'train_{metric}']
    else:
        val_scores = cv_results[f'test_{metric}']
        train_scores = cv_results[f'train_{metric}']
    print(f"{metric.upper()}: Val Mean = {val_scores.mean():.4f} +/- {val_scores.std():.4f} | Train Mean = {train_scores.mean():.4f} +/- {train_scores.std():.4f}")

# Fit baseline pipeline on full training data
baseline_pipeline.fit(X_train, y_train)

# Evaluate on Training Set
y_train_pred = baseline_pipeline.predict(X_train)
train_mae = mean_absolute_error(y_train, y_train_pred)
train_mse = mean_squared_error(y_train, y_train_pred)
train_rmse = root_mean_squared_error(y_train, y_train_pred)
train_r2 = r2_score(y_train, y_train_pred)

# Evaluate on Test Set (strictly for reporting baseline)
y_test_pred = baseline_pipeline.predict(X_test)
test_mae = mean_absolute_error(y_test, y_test_pred)
test_mse = mean_squared_error(y_test, y_test_pred)
test_rmse = root_mean_squared_error(y_test, y_test_pred)
test_r2 = r2_score(y_test, y_test_pred)

print("\n=== FULL TRAIN & TEST EVALUATION ===")
print(f"Train MAE:  ${train_mae:,.2f} | Test MAE:  ${test_mae:,.2f}")
print(f"Train MSE:  ${train_mse:,.2f} | Test MSE:  ${test_mse:,.2f}")
print(f"Train RMSE: ${train_rmse:,.2f} | Test RMSE: ${test_rmse:,.2f}")
print(f"Train R2:   {train_r2:.4f}     | Test R2:   {test_r2:.4f}")
