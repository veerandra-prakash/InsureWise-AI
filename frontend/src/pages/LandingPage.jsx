import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { 
  Shield, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Cpu
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="py-14 md:py-18 border-b border-slate-200 bg-white shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Production XGBoost & SHAP Actuarial Pipeline</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Explainable Health Insurance Actuarial Engine
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                InsureWise AI combines actuarial-grade XGBoost machine learning with SHAP TreeExplainer attributions to deliver instant health premium quotes with 100% dollar-for-dollar transparency.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/predict"
                  className="btn-primary px-4 py-2 flex items-center gap-2 shadow-xs"
                >
                  <span>Open Quote Workbench</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/about"
                  className="btn-secondary px-4 py-2 flex items-center gap-2"
                >
                  View System Architecture
                </Link>
              </div>

              {/* Technical Feature Bullets */}
              <div className="pt-2 grid grid-cols-2 gap-2 text-xs text-slate-600 font-mono">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>41 SHAP Feature Attributions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>5-Fold Cross Validation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Stateless JWT Auth</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>&lt; 180ms Inference Latency</span>
                </div>
              </div>

            </div>

            {/* Right Live Actuarial Report Preview Column */}
            <div className="lg:col-span-5">
              <div className="enterprise-panel p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-900" />
                    <span className="font-bold text-slate-900 font-mono">Quote #ACT-9082</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold">
                    Standard Risk Profile
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Annual Premium</span>
                    <div className="text-xl font-bold text-slate-900 font-mono">$6,480.00</div>
                    <p className="text-[10px] text-slate-500">XGBoost Regressor</p>
                  </div>

                  <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Monthly Rate</span>
                    <div className="text-xl font-bold text-slate-800 font-mono">$540.00</div>
                    <p className="text-[10px] text-slate-500">12 Installments</p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider font-mono">Key SHAP Attributions</span>
                  
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-slate-800 font-medium">Non-Smoker Status</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-600">-$4,250.00</span>
                    </div>

                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                        <span className="text-slate-800 font-medium">Age Factor (38 yrs)</span>
                      </div>
                      <span className="font-mono font-bold text-rose-600">+$1,120.00</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Metrics Data Strip */}
      <section className="py-8 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Model Accuracy (R²)', val: '87.99%', sub: 'Cross-validated test set' },
              { label: 'Mean Absolute Error', val: '$2,064', sub: 'Average dollar deviation' },
              { label: 'SHAP Attributions', val: '41 Features', sub: 'Full statistical explainability' },
              { label: 'Inference Latency', val: '< 180 ms', sub: 'FastAPI microservice' }
            ].map((stat, i) => (
              <div key={i} className="enterprise-panel p-4">
                <div className="text-xl font-bold text-slate-900 font-mono">{stat.val}</div>
                <div className="text-xs font-semibold text-slate-800 mt-1">{stat.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Model Specification Matrix */}
      <section className="py-12 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Model Evaluation Specification Matrix</h2>
            <p className="text-xs text-slate-500">
              Technical benchmark metrics on 7,500 enhanced medical actuarial records.
            </p>
          </div>

          <div className="overflow-x-auto enterprise-panel">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4">Model Architecture</th>
                  <th className="py-3 px-4">Cross-Validation</th>
                  <th className="py-3 px-4">Test R² Score</th>
                  <th className="py-3 px-4">Test MAE</th>
                  <th className="py-3 px-4">Feature Preprocessing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">Tuned XGBoost Regressor</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">5-Fold KFold CV</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">0.8799</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">$2,064.14</td>
                  <td className="py-3.5 px-4 text-slate-600">BloodPressureExtractor + OneHotEncoder</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors text-slate-600">
                  <td className="py-3.5 px-4 font-medium text-slate-800">Random Forest Baseline</td>
                  <td className="py-3.5 px-4 font-mono">5-Fold KFold CV</td>
                  <td className="py-3.5 px-4 font-mono">0.8421</td>
                  <td className="py-3.5 px-4 font-mono">$2,410.50</td>
                  <td className="py-3.5 px-4">Standard Scaler</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors text-slate-600">
                  <td className="py-3.5 px-4 font-medium text-slate-800">Linear Regression Baseline</td>
                  <td className="py-3.5 px-4 font-mono">5-Fold KFold CV</td>
                  <td className="py-3.5 px-4 font-mono">0.7512</td>
                  <td className="py-3.5 px-4 font-mono">$3,180.20</td>
                  <td className="py-3.5 px-4">Raw Encoded Variables</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 InsureWise AI — Explainable Health Actuarial System. All rights reserved.</p>
          <div className="flex items-center space-x-4 font-medium">
            <Link to="/about" className="hover:text-slate-900 transition-colors">Architecture Docs</Link>
            <Link to="/predict" className="hover:text-slate-900 transition-colors">Calculate Quote</Link>
            <Link to="/login" className="hover:text-slate-900 transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
