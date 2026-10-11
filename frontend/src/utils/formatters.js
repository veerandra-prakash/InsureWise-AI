/**
 * Formats a number to USD currency string.
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Formats ISO date string to readable format.
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Converts snake_case, transformer-prefixed, or technical feature names to human-readable labels.
 */
export const cleanFeatureLabel = (featureName) => {
  if (!featureName) return '';
  
  // Custom mappings for common raw and transformed features
  const customMap = {
    'smoker_Yes': 'Smoker Status (Yes)',
    'smoker_No': 'Non-Smoker Status',
    'smoker': 'Smoking Status',
    'chronic_diseases': 'Chronic Health Conditions',
    'hospitalizations_last_year': 'Hospitalizations (Past Year)',
    'doctor_visits_per_year': 'Doctor Visits / Year',
    'exercise_level': 'Exercise & Fitness Level',
    'exercise_level_Low': 'Low Exercise Activity',
    'exercise_level_Moderate': 'Moderate Exercise Activity',
    'exercise_level_High': 'High Exercise Activity',
    'insurance_plan': 'Insurance Plan Tier',
    'insurance_plan_Basic': 'Basic Insurance Tier',
    'insurance_plan_Standard': 'Standard Insurance Tier',
    'insurance_plan_Premium': 'Premium Insurance Tier',
    'insurance_plan_Gold': 'Gold Insurance Tier',
    'annual_income_usd': 'Annual Income',
    'systolic_bp': 'Systolic Blood Pressure',
    'diastolic_bp': 'Diastolic Blood Pressure',
    'blood_pressure': 'Blood Pressure Reading',
    'alcohol_consumption_per_week': 'Alcohol Intake (Units/Wk)',
    'sleep_hours': 'Average Sleep Duration',
    'stress_level': 'Self-Reported Stress Level',
    'marital_status_Single': 'Marital Status (Single)',
    'marital_status_Married': 'Marital Status (Married)',
    'marital_status_Divorced': 'Marital Status (Divorced)',
    'marital_status_Widowed': 'Marital Status (Widowed)',
    'marital_status': 'Marital Status',
    'diabetes_Yes': 'Diabetes Diagnosis (Yes)',
    'diabetes_No': 'Diabetes Diagnosis (No)',
    'diabetes': 'Diabetes Status',
    'gender_Male': 'Male Gender',
    'gender_Female': 'Female Gender',
    'gender': 'Gender',
    'region_Southeast': 'Geographic Region (Southeast)',
    'region_Southwest': 'Geographic Region (Southwest)',
    'region_Northeast': 'Geographic Region (Northeast)',
    'region_Northwest': 'Geographic Region (Northwest)',
    'region_Central': 'Geographic Region (Central)',
    'region': 'Geographic Region',
    'bmi': 'Body Mass Index (BMI)',
    'age': 'Customer Age',
    'children': 'Dependents / Children',
    'cholesterol': 'Total Cholesterol Level'
  };

  if (customMap[featureName]) return customMap[featureName];

  // Clean raw transformer prefixes like 'onehotencoder__', 'scaler__', etc.
  let cleaned = featureName
    .replace(/^[a-z0-9_]+__/, '')
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();

  return cleaned;
};

