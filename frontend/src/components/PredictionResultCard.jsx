import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { Shield, DollarSign, Calendar, Cpu, TrendingUp, AlertTriangle, CheckCircle2, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { generatePDFReport } from '../utils/pdfGenerator';

export const PredictionResultCard = ({ prediction, modelVersion = '1.0.0', date, inputFeatures, explanation }) => {
  const { addToast } = useAuth();
  const annual = prediction || 0;
  const monthly = annual / 12;

  let riskTier = { label: 'Standard Risk Profile', color: 'text-emerald-800 bg-emerald-50 border-emerald-300', icon: CheckCircle2 };
  if (annual > 25000) {
    riskTier = { label: 'High Risk Profile', color: 'text-rose-800 bg-rose-50 border-rose-300', icon: AlertTriangle };
  } else if (annual > 12000) {
    riskTier = { label: 'Moderate Risk Profile', color: 'text-amber-800 bg-amber-50 border-amber-300', icon: TrendingUp };
  }

  const RiskIcon = riskTier.icon;

  const handleExport = () => {
    generatePDFReport({ prediction, modelVersion, date, inputFeatures, explanation });
    addToast('Opening printable PDF quote report...', 'success');
  };

  return (
    <div className="enterprise-panel p-5 space-y-4 font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Actuarial Premium Quote</h3>
            <p className="text-[11px] text-slate-500">XGBoost Regression Model Output</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-bold ${riskTier.color}`}>
            <RiskIcon className="w-3.5 h-3.5" />
            <span>{riskTier.label}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-600 px-2 py-1 rounded bg-slate-100 border border-slate-200">
            v{modelVersion}
          </span>
          <button
            onClick={handleExport}
            className="p-1.5 rounded bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Export Quote PDF"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Figures Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Annual Premium Box */}
        <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            <DollarSign className="w-3.5 h-3.5 text-slate-700" />
            <span>Annual Premium Quote</span>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight font-mono">
            {formatCurrency(annual)}
          </div>
          <p className="text-[11px] text-slate-500">Calculated annual healthcare coverage premium</p>
        </div>

        {/* Monthly Rate Box */}
        <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Monthly Rate Option</span>
          </div>
          <div className="text-3xl font-bold text-slate-800 tracking-tight font-mono">
            {formatCurrency(monthly)}
          </div>
          <p className="text-[11px] text-slate-500">12 equal monthly installments</p>
        </div>

      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200 font-mono">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-slate-500" />
          <span>Tuned XGBoost Regressor</span>
        </div>
        <span>SHAP Explainability Verified</span>
      </div>

    </div>
  );
};
