import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { predictionService } from '../services/predictionService';
import { PredictionResultCard } from '../components/PredictionResultCard';
import { ShapExplanationCard } from '../components/ShapExplanationCard';
import { 
  Sparkles, 
  Loader2, 
  HeartPulse, 
  User, 
  Stethoscope, 
  AlertCircle,
  RefreshCw,
  History,
  Info,
  CheckCircle2,
  Sliders
} from 'lucide-react';

const DEFAULT_FORM_DATA = {
  age: 38,
  gender: 'Female',
  bmi: 26.2,
  children: 1,
  smoker: 'No',
  region: 'Southeast',
  occupation: 'Nurse',
  annual_income_usd: 68000,
  exercise_level: 'Moderate',
  chronic_diseases: 0,
  doctor_visits_per_year: 4,
  hospitalizations_last_year: 0,
  alcohol_consumption_per_week: 3,
  insurance_plan: 'Standard',
  blood_pressure: '122/78',
  diabetes: 'No',
  cholesterol: 195.0,
  sleep_hours: 7.2,
  stress_level: 4.5,
  marital_status: 'Married'
};

const PRESETS = {
  standard: {
    ...DEFAULT_FORM_DATA
  },
  low_risk: {
    age: 26,
    gender: 'Male',
    bmi: 21.5,
    children: 0,
    smoker: 'No',
    region: 'Northwest',
    occupation: 'Engineer',
    annual_income_usd: 85000,
    exercise_level: 'High',
    chronic_diseases: 0,
    doctor_visits_per_year: 1,
    hospitalizations_last_year: 0,
    alcohol_consumption_per_week: 1,
    insurance_plan: 'Basic',
    blood_pressure: '115/75',
    diabetes: 'No',
    cholesterol: 165.0,
    sleep_hours: 8.0,
    stress_level: 2.5,
    marital_status: 'Single'
  },
  high_risk: {
    age: 58,
    gender: 'Male',
    bmi: 34.8,
    children: 3,
    smoker: 'Yes',
    region: 'Southeast',
    occupation: 'Construction Worker',
    annual_income_usd: 52000,
    exercise_level: 'Low',
    chronic_diseases: 2,
    doctor_visits_per_year: 12,
    hospitalizations_last_year: 2,
    alcohol_consumption_per_week: 14,
    insurance_plan: 'Gold',
    blood_pressure: '145/92',
    diabetes: 'Yes',
    cholesterol: 248.0,
    sleep_hours: 5.5,
    stress_level: 8.0,
    marital_status: 'Married'
  }
};

export const PredictPage = () => {
  const { addToast } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);

  const validateField = (name, value) => {
    let err = '';
    switch (name) {
      case 'age':
        if (value === '' || isNaN(value)) err = 'Age is required';
        else if (Number(value) < 18 || Number(value) > 100) err = 'Age must be between 18 and 100 years';
        break;
      case 'bmi':
        if (value === '' || isNaN(value)) err = 'BMI is required';
        else if (Number(value) < 10.0 || Number(value) > 70.0) err = 'BMI must be between 10.0 and 70.0 kg/m²';
        break;
      case 'children':
        if (value === '' || isNaN(value)) err = 'Children count is required';
        else if (Number(value) < 0 || Number(value) > 10) err = 'Children count must be between 0 and 10';
        break;
      case 'annual_income_usd':
        if (value === '' || isNaN(value)) err = 'Annual income is required';
        else if (Number(value) < 0) err = 'Income cannot be negative';
        break;
      case 'chronic_diseases':
        if (value === '' || isNaN(value)) err = 'Chronic conditions count is required';
        else if (Number(value) < 0 || Number(value) > 10) err = 'Must be between 0 and 10 conditions';
        break;
      case 'doctor_visits_per_year':
        if (value === '' || isNaN(value)) err = 'Doctor visits is required';
        else if (Number(value) < 0 || Number(value) > 100) err = 'Must be between 0 and 100 visits/year';
        break;
      case 'hospitalizations_last_year':
        if (value === '' || isNaN(value)) err = 'Hospitalizations count is required';
        else if (Number(value) < 0 || Number(value) > 10) err = 'Must be between 0 and 10 hospitalizations';
        break;
      case 'alcohol_consumption_per_week':
        if (value === '' || isNaN(value)) err = 'Alcohol consumption is required';
        else if (Number(value) < 0 || Number(value) > 100) err = 'Must be between 0 and 100 drinks/week';
        break;
      case 'blood_pressure':
        if (!value || typeof value !== 'string') err = 'Blood pressure is required';
        else if (!/^\d{2,3}\/\d{2,3}$/.test(value.trim())) {
          err = 'Format must be "systolic/diastolic" (e.g. 120/80)';
        } else {
          const [sys, dia] = value.trim().split('/').map(Number);
          if (sys < 70 || sys > 250 || dia < 40 || dia > 150) {
            err = 'Enter valid Systolic (70-250) and Diastolic (40-150)';
          }
        }
        break;
      case 'cholesterol':
        if (value === '' || isNaN(value)) err = 'Cholesterol level is required';
        else if (Number(value) < 50.0 || Number(value) > 600.0) err = 'Cholesterol must be between 50 and 600 mg/dL';
        break;
      case 'sleep_hours':
        if (value === '' || isNaN(value)) err = 'Sleep hours is required';
        else if (Number(value) < 0.0 || Number(value) > 24.0) err = 'Sleep hours must be between 0 and 24 hrs/night';
        break;
      case 'stress_level':
        if (value === '' || isNaN(value)) err = 'Stress level is required';
        else if (Number(value) < 1.0 || Number(value) > 10.0) err = 'Stress level must be between 1.0 and 10.0';
        break;
      case 'occupation':
        if (!value || !value.trim()) err = 'Occupation is required';
        break;
      default:
        break;
    }
    return err;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue = value;
    if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue
    }));

    const errMessage = validateField(name, parsedValue);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: errMessage
    }));
  };

  const applyPreset = (presetKey) => {
    if (PRESETS[presetKey]) {
      setFormData(PRESETS[presetKey]);
      setFieldErrors({});
      setError('');
      addToast(`Loaded ${presetKey.replace('_', ' ').toUpperCase()} preset`, 'info');
    }
  };

  const validateAllFields = () => {
    const errors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) errors[key] = err;
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateAllFields()) {
      setError('Please resolve all validation errors in the form before submitting.');
      addToast('Validation failed. Check form fields.', 'error');
      return;
    }

    setLoading(true);
    setLoadingStage('Preparing AI prediction...');

    const stages = [
      { delay: 3500, text: 'AI service is starting. This may take a few seconds...' },
      { delay: 10000, text: 'Connecting to XGBoost ML service on Render...' },
      { delay: 20000, text: 'Loading production model & SHAP TreeExplainer...' },
      { delay: 35000, text: 'Finalizing actuarial risk attributions...' }
    ];

    const stageTimers = stages.map((stage) =>
      setTimeout(() => setLoadingStage(stage.text), stage.delay)
    );

    try {
      const response = await predictionService.createPrediction(formData);
      
      const resultData = response.data;
      setPredictionResult(resultData);
      addToast('Premium calculated successfully!', 'success');
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Prediction Submission Error:', err);
      const msg = err.response?.data?.message || 'AI prediction service is temporarily unavailable. Please try again in a moment.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      stageTimers.forEach((timer) => clearTimeout(timer));
      setLoading(false);
      setLoadingStage('');
    }
  };

  const resetCalculator = () => {
    setPredictionResult(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto pb-10 font-sans">
        
        {/* Header Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Actuarial Quote Calculator
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">
              Input 20 demographic & clinical metrics to calculate an actuarial quote with SHAP attributions.
            </p>
          </div>

          <Link
            to="/history"
            className="btn-secondary px-3 py-1.5 flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>Quote Audit History</span>
          </Link>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-3.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="font-bold text-rose-900">Calculation Error</h4>
              <p className="leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* PREDICTION RESULT VIEW */}
        {predictionResult ? (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Actuarial quote calculated and stored in database.</span>
              </div>
              <button
                onClick={resetCalculator}
                className="px-2.5 py-1 rounded bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold transition-colors flex items-center gap-1 text-xs cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Calculate Another</span>
              </button>
            </div>

            <PredictionResultCard
              prediction={predictionResult.prediction}
              modelVersion={predictionResult.modelVersion}
              date={predictionResult.createdAt}
              inputFeatures={predictionResult.inputFeatures || formData}
              explanation={predictionResult.explanation}
            />

            <ShapExplanationCard explanation={predictionResult.explanation} />

            <div className="enterprise-panel p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-slate-900" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Evaluated Input Features (20/20)</h3>
                </div>
                <button
                  onClick={() => navigate('/predict/result', { state: { resultData: predictionResult } })}
                  className="text-xs text-slate-900 font-semibold hover:underline"
                >
                  View Detail Audit Page →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                {[
                  { label: 'Age / Gender', val: `${formData.age} yrs, ${formData.gender}` },
                  { label: 'BMI', val: `${formData.bmi} kg/m²` },
                  { label: 'Blood Pressure', val: formData.blood_pressure },
                  { label: 'Smoker Status', val: formData.smoker },
                  { label: 'Annual Income', val: `$${formData.annual_income_usd.toLocaleString()}` },
                  { label: 'Cholesterol', val: `${formData.cholesterol} mg/dL` },
                  { label: 'Chronic Conditions', val: formData.chronic_diseases },
                  { label: 'Insurance Plan', val: formData.insurance_plan }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded bg-slate-50 border border-slate-200">
                    <div className="text-slate-500 text-[11px] font-medium">{item.label}</div>
                    <div className="font-bold text-slate-900 mt-0.5">{item.val}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* PREDICTION FORM VIEW */
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Presets Toolbar */}
            <div className="p-3 rounded bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-700 font-semibold">Quick Actuarial Presets:</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset('standard')}
                  className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-semibold text-[11px] transition-colors cursor-pointer"
                >
                  Standard Profile
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('low_risk')}
                  className="px-3 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-[11px] transition-colors cursor-pointer"
                >
                  Low Risk Profile
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('high_risk')}
                  className="px-3 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-semibold text-[11px] transition-colors cursor-pointer"
                >
                  High Risk Profile
                </button>
              </div>
            </div>

            {/* SECTION 1: Personal & Demographic Profile */}
            <div className="enterprise-panel p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200">
                <User className="w-4 h-4 text-slate-900" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">1. Demographic & Personal Attributes</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Age */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800">Age</label>
                    <span className="text-[10px] text-slate-500 font-mono">18 - 100</span>
                  </div>
                  <input
                    type="number"
                    name="age"
                    min={18}
                    max={100}
                    value={formData.age}
                    onChange={handleChange}
                    className={`w-full enterprise-input px-3 py-1.5 ${fieldErrors.age ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {fieldErrors.age && <p className="text-[11px] text-rose-600 mt-0.5">{fieldErrors.age}</p>}
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-800">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full enterprise-input px-3 py-1.5 bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>

                {/* Marital Status */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-800">Marital Status</label>
                  <select
                    name="marital_status"
                    value={formData.marital_status}
                    onChange={handleChange}
                    className="w-full enterprise-input px-3 py-1.5 bg-white"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                {/* Children */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800">Children / Dependents</label>
                    <span className="text-[10px] text-slate-500 font-mono">0 - 10</span>
                  </div>
                  <input
                    type="number"
                    name="children"
                    min={0}
                    max={10}
                    value={formData.children}
                    onChange={handleChange}
                    className={`w-full enterprise-input px-3 py-1.5 ${fieldErrors.children ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {fieldErrors.children && <p className="text-[11px] text-rose-600 mt-0.5">{fieldErrors.children}</p>}
                </div>

                {/* Region */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-800">Geographic Region</label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full enterprise-input px-3 py-1.5 bg-white"
                  >
                    <option value="Southwest">Southwest</option>
                    <option value="Southeast">Southeast</option>
                    <option value="Northwest">Northwest</option>
                    <option value="Northeast">Northeast</option>
                    <option value="Central">Central</option>
                  </select>
                </div>

                {/* Occupation */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-800">Occupation</label>
                  <select
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className={`w-full enterprise-input px-3 py-1.5 bg-white ${fieldErrors.occupation ? 'border-rose-500 bg-rose-50' : ''}`}
                  >
                    <option value="Nurse">Nurse</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Engineer">Engineer</option>
                    <option value="Lawyer">Lawyer</option>
                    <option value="Manager">Manager</option>
                    <option value="Office Worker">Office Worker</option>
                    <option value="Retail Worker">Retail Worker</option>
                    <option value="Construction Worker">Construction Worker</option>
                    <option value="Driver">Driver</option>
                    <option value="Technician">Technician</option>
                  </select>
                  {fieldErrors.occupation && <p className="text-[11px] text-rose-600 mt-0.5">{fieldErrors.occupation}</p>}
                </div>

                {/* Annual Income */}
                <div className="space-y-1 sm:col-span-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800">Annual Gross Income</label>
                    <span className="text-[10px] text-slate-500 font-mono">$ USD / yr</span>
                  </div>
                  <input
                    type="number"
                    name="annual_income_usd"
                    min={0}
                    step={1000}
                    value={formData.annual_income_usd}
                    onChange={handleChange}
                    className={`w-full enterprise-input px-3 py-1.5 ${fieldErrors.annual_income_usd ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {fieldErrors.annual_income_usd && <p className="text-[11px] text-rose-600 mt-0.5">{fieldErrors.annual_income_usd}</p>}
                </div>

              </div>
            </div>

            {/* SECTION 2: Health & Clinical Vitals */}
            <div className="enterprise-panel p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200">
                <HeartPulse className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">2. Clinical Vitals & Medical History</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* BMI */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800">BMI (Body Mass Index)</label>
                    <span className="text-[10px] text-slate-500 font-mono">10.0 - 70.0</span>
                  </div>
                  <input
                    type="number"
                    name="bmi"
                    step="0.1"
                    min={10.0}
                    max={70.0}
                    value={formData.bmi}
                    onChange={handleChange}
                    className={`w-full enterprise-input px-3 py-1.5 ${fieldErrors.bmi ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {fieldErrors.bmi && <p className="text-[11px] text-rose-600 mt-0.5">{fieldErrors.bmi}</p>}
                </div>

                {/* Blood Pressure String */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800">Blood Pressure</label>
                    <span className="text-[10px] text-slate-500 font-mono">sys/dia</span>
                  </div>
                  <input
                    type="text"
                    name="blood_pressure"
                    placeholder="120/80"
                    value={formData.blood_pressure}
                    onChange={handleChange}
                    className={`w-full enterprise-input px-3 py-1.5 ${fieldErrors.blood_pressure ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {fieldErrors.blood_pressure ? (
                    <p className="text-[11px] text-rose-600 mt-0.5">{fieldErrors.blood_pressure}</p>
                  ) : (
                    <p className="text-[10px] text-slate-500">Format e.g. "120/80"</p>
                  )}
                </div>

                {/* Cholesterol */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800">Total Cholesterol</label>
                    <span className="text-[10px] text-slate-500 font-mono">50 - 600</span>
                  </div>
                  <input
                    type="number"
                    name="cholesterol"
                    min={50}
                    max={600}
                    value={formData.cholesterol}
                    onChange={handleChange}
                    className={`w-full enterprise-input px-3 py-1.5 ${fieldErrors.cholesterol ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {fieldErrors.cholesterol && <p className="text-[11px] text-rose-600 mt-0.5">{fieldErrors.cholesterol}</p>}
                </div>

                {/* Smoker Status */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-800">Smoker Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['No', 'Yes'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleChange({ target: { name: 'smoker', value: opt, type: 'text' } })}
                        className={`py-1.5 text-xs font-bold rounded border transition-colors cursor-pointer ${
                          formData.smoker === opt
                            ? opt === 'Yes'
                              ? 'bg-rose-50 border-rose-300 text-rose-800'
                              : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {opt === 'Yes' ? 'Smoker' : 'Non-Smoker'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Diabetes Status */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-800">Diabetes Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['No', 'Yes'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleChange({ target: { name: 'diabetes', value: opt, type: 'text' } })}
                        className={`py-1.5 text-xs font-bold rounded border transition-colors cursor-pointer ${
                          formData.diabetes === opt
                            ? opt === 'Yes'
                              ? 'bg-amber-50 border-amber-300 text-amber-800'
                              : 'bg-slate-100 border-slate-300 text-slate-800'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {opt === 'Yes' ? 'Diagnosed' : 'None'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chronic Diseases */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800">Chronic Conditions</label>
                    <span className="text-[10px] text-slate-500 font-mono">0 - 10</span>
                  </div>
                  <input
                    type="number"
                    name="chronic_diseases"
                    min={0}
                    max={10}
                    value={formData.chronic_diseases}
                    onChange={handleChange}
                    className={`w-full enterprise-input px-3 py-1.5 ${fieldErrors.chronic_diseases ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {fieldErrors.chronic_diseases && <p className="text-[11px] text-rose-600 mt-0.5">{fieldErrors.chronic_diseases}</p>}
                </div>

              </div>
            </div>

            {/* SECTION 3: Healthcare Utilization & Lifestyle */}
            <div className="enterprise-panel p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200">
                <Stethoscope className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">3. Healthcare Utilization & Policy Tier</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Doctor Visits */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800">Doctor Visits / Year</label>
                    <span className="text-[10px] text-slate-500 font-mono">0 - 100</span>
                  </div>
                  <input
                    type="number"
                    name="doctor_visits_per_year"
                    min={0}
                    max={100}
                    value={formData.doctor_visits_per_year}
                    onChange={handleChange}
                    className={`w-full enterprise-input px-3 py-1.5 ${fieldErrors.doctor_visits_per_year ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {fieldErrors.doctor_visits_per_year && <p className="text-[11px] text-rose-600 mt-0.5">{fieldErrors.doctor_visits_per_year}</p>}
                </div>

                {/* Hospitalizations */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800">Hospitalizations (Past Yr)</label>
                    <span className="text-[10px] text-slate-500 font-mono">0 - 10</span>
                  </div>
                  <input
                    type="number"
                    name="hospitalizations_last_year"
                    min={0}
                    max={10}
                    value={formData.hospitalizations_last_year}
                    onChange={handleChange}
                    className={`w-full enterprise-input px-3 py-1.5 ${fieldErrors.hospitalizations_last_year ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {fieldErrors.hospitalizations_last_year && <p className="text-[11px] text-rose-600 mt-0.5">{fieldErrors.hospitalizations_last_year}</p>}
                </div>

                {/* Alcohol Consumption */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800">Alcohol Units / Wk</label>
                    <span className="text-[10px] text-slate-500 font-mono">0 - 100</span>
                  </div>
                  <input
                    type="number"
                    name="alcohol_consumption_per_week"
                    min={0}
                    max={100}
                    value={formData.alcohol_consumption_per_week}
                    onChange={handleChange}
                    className={`w-full enterprise-input px-3 py-1.5 ${fieldErrors.alcohol_consumption_per_week ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {fieldErrors.alcohol_consumption_per_week && <p className="text-[11px] text-rose-600 mt-0.5">{fieldErrors.alcohol_consumption_per_week}</p>}
                </div>

                {/* Sleep Hours */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800">Average Sleep</label>
                    <span className="text-[10px] text-slate-500 font-mono">0.0 - 24.0 hrs</span>
                  </div>
                  <input
                    type="number"
                    name="sleep_hours"
                    step="0.5"
                    min={0}
                    max={24}
                    value={formData.sleep_hours}
                    onChange={handleChange}
                    className={`w-full enterprise-input px-3 py-1.5 ${fieldErrors.sleep_hours ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {fieldErrors.sleep_hours && <p className="text-[11px] text-rose-600 mt-0.5">{fieldErrors.sleep_hours}</p>}
                </div>

                {/* Stress Level */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800">Stress Rating (1 - 10)</label>
                    <span className="text-[10px] text-slate-500 font-mono">1.0 - 10.0</span>
                  </div>
                  <input
                    type="number"
                    name="stress_level"
                    step="0.5"
                    min={1}
                    max={10}
                    value={formData.stress_level}
                    onChange={handleChange}
                    className={`w-full enterprise-input px-3 py-1.5 ${fieldErrors.stress_level ? 'border-rose-500 bg-rose-50' : ''}`}
                  />
                  {fieldErrors.stress_level && <p className="text-[11px] text-rose-600 mt-0.5">{fieldErrors.stress_level}</p>}
                </div>

                {/* Exercise Level */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-800">Exercise Activity</label>
                  <select
                    name="exercise_level"
                    value={formData.exercise_level}
                    onChange={handleChange}
                    className="w-full enterprise-input px-3 py-1.5 bg-white"
                  >
                    <option value="Low">Low Activity</option>
                    <option value="Moderate">Moderate Activity</option>
                    <option value="High">High Activity</option>
                  </select>
                </div>

                {/* Insurance Plan Tier */}
                <div className="space-y-1 sm:col-span-3">
                  <label className="text-xs font-semibold text-slate-800">Desired Insurance Plan Tier</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { name: 'Basic', desc: 'Standard essential coverage' },
                      { name: 'Standard', desc: 'Balanced deductibles & care' },
                      { name: 'Premium', desc: 'Comprehensive coverage' },
                      { name: 'Gold', desc: 'Zero-deductible elite plan' }
                    ].map((plan) => (
                      <button
                        key={plan.name}
                        type="button"
                        onClick={() => handleChange({ target: { name: 'insurance_plan', value: plan.name, type: 'text' } })}
                        className={`p-3 rounded border text-left transition-colors cursor-pointer ${
                          formData.insurance_plan === plan.name
                            ? 'bg-slate-900 border-slate-900 text-white font-semibold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs font-bold">{plan.name} Tier</div>
                        <div className={`text-[10px] mt-0.5 ${formData.insurance_plan === plan.name ? 'text-slate-300' : 'text-slate-500'}`}>{plan.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-6 py-2.5 flex items-center justify-center gap-2 shadow-xs cursor-pointer w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{loadingStage || 'Processing Actuarial Quote...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold">Calculate Actuarial Premium Quote</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </DashboardLayout>
  );
};
