import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PredictionResultCard } from '../components/PredictionResultCard';
import { ShapExplanationCard } from '../components/ShapExplanationCard';
import { Sparkles, History, ArrowLeft, UserCheck } from 'lucide-react';

export const PredictionResultPage = () => {
  const location = useLocation();
  const resultData = location.state?.resultData;

  if (!resultData) {
    return <Navigate to="/predict" replace />;
  }

  const { prediction, modelVersion, explanation, inputFeatures, createdAt } = resultData;

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-4xl mx-auto pb-10 font-sans">
        
        {/* Navigation Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <Link
            to="/predict"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Back to Calculator</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/history"
              className="btn-secondary px-3 py-1.5 flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>Quote History</span>
            </Link>
            <Link
              to="/predict"
              className="btn-primary px-3 py-1.5 flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Calculate New Quote</span>
            </Link>
          </div>
        </div>

        {/* Prediction Summary Card */}
        <PredictionResultCard
          prediction={prediction}
          modelVersion={modelVersion}
          date={createdAt}
        />

        {/* SHAP Explanation Visualizer */}
        <ShapExplanationCard explanation={explanation} prediction={prediction} />

        {/* Customer Input Profile */}
        {inputFeatures && (
          <div className="enterprise-panel p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200">
              <UserCheck className="w-4 h-4 text-slate-900" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Evaluated Customer Metrics</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {[
                { label: 'Age / Gender', val: `${inputFeatures.age} yrs, ${inputFeatures.gender}` },
                { label: 'BMI', val: `${inputFeatures.bmi} kg/m²` },
                { label: 'Smoker Status', val: inputFeatures.smoker },
                { label: 'Blood Pressure', val: inputFeatures.blood_pressure },
                { label: 'Chronic Conditions', val: inputFeatures.chronic_diseases },
                { label: 'Hospitalizations', val: inputFeatures.hospitalizations_last_year },
                { label: 'Doctor Visits / Yr', val: inputFeatures.doctor_visits_per_year },
                { label: 'Insurance Tier', val: inputFeatures.insurance_plan }
              ].map((item, i) => (
                <div key={i} className="p-3 rounded bg-slate-50 border border-slate-200">
                  <div className="text-slate-500 text-[11px] font-medium">{item.label}</div>
                  <div className="font-bold text-slate-900 mt-0.5">{item.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};
