import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ArrowRight, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-4xl mx-auto pb-10 font-sans">
        
        {/* Header */}
        <div className="pb-3 border-b border-slate-200">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">System Architecture</h1>
          <p className="text-slate-500 text-xs mt-0.5">Technical breakdown of the explainable actuarial machine learning pipeline.</p>
        </div>

        {/* 4-Step Pipeline */}
        <div className="enterprise-panel p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200">
            <Layers className="w-4 h-4 text-slate-900" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">End-to-End Pipeline Workflow</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {[
              {
                step: '01',
                title: 'User Input Gateway',
                desc: 'Client submits 20 demographic & clinical features via Node REST API.'
              },
              {
                step: '02',
                title: 'Pipeline Preprocessing',
                desc: 'BloodPressureExtractor parses string BP into systolic/diastolic.'
              },
              {
                step: '03',
                title: 'XGBoost Prediction',
                desc: 'Tuned XGBoost regressor predicts annual medical premium in USD.'
              },
              {
                step: '04',
                title: 'SHAP Explainability',
                desc: 'TreeExplainer quantifies exact dollar impact of all 41 features.'
              }
            ].map((box, i) => (
              <div key={i} className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-xs font-extrabold text-slate-900 font-mono">{box.step}</span>
                <h4 className="font-bold text-slate-900">{box.title}</h4>
                <p className="text-slate-600 leading-relaxed text-[11px]">{box.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Evaluation Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="enterprise-panel p-4 text-center space-y-1">
            <div className="text-xl font-bold text-slate-900 font-mono">0.8799</div>
            <div className="text-xs font-semibold text-slate-800">Test Set R² Score</div>
            <p className="text-[11px] text-slate-500">Cross-validated variance explained</p>
          </div>

          <div className="enterprise-panel p-4 text-center space-y-1">
            <div className="text-xl font-bold text-emerald-700 font-mono">$2,064.14</div>
            <div className="text-xs font-semibold text-slate-800">Mean Absolute Error (MAE)</div>
            <p className="text-[11px] text-slate-500">Average dollar deviation on test set</p>
          </div>

          <div className="enterprise-panel p-4 text-center space-y-1">
            <div className="text-xl font-bold text-slate-900 font-mono">7,500</div>
            <div className="text-xs font-semibold text-slate-800">Training Samples</div>
            <p className="text-[11px] text-slate-500">Enhanced medical insurance records</p>
          </div>
        </div>

        {/* CTA Card */}
        <div className="enterprise-panel p-5 text-center space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Ready to test your actuarial premium quote?</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Experience real-time explainable insurance quotes powered by transparent machine learning.
          </p>
          <div>
            <Link
              to="/predict"
              className="btn-primary px-4 py-2 inline-flex items-center gap-2 text-xs shadow-xs cursor-pointer"
            >
              <span>Start Prediction Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};
