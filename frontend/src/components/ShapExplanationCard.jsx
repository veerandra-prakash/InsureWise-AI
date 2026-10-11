import React, { useState } from 'react';
import { cleanFeatureLabel, formatCurrency } from '../utils/formatters';
import { 
  HelpCircle, 
  TrendingUp, 
  TrendingDown, 
  Info, 
  SlidersHorizontal
} from 'lucide-react';

export const ShapExplanationCard = ({ explanation = {}, prediction = null }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [showAll, setShowAll] = useState(false);

  const allEntries = Object.entries(explanation || {})
    .map(([key, val]) => {
      const numericVal = typeof val === 'number' ? val : parseFloat(val) || 0;
      return {
        featureKey: key,
        label: cleanFeatureLabel(key),
        shapVal: numericVal,
        absVal: Math.abs(numericVal)
      };
    })
    .filter((item) => item.absVal >= 0.01);

  const totalAbsSum = allEntries.reduce((acc, curr) => acc + curr.absVal, 0) || 1;

  const positiveDrivers = allEntries
    .filter((item) => item.shapVal > 0)
    .sort((a, b) => b.shapVal - a.shapVal);

  const negativeDrivers = allEntries
    .filter((item) => item.shapVal < 0)
    .sort((a, b) => a.shapVal - b.shapVal);

  const maxAbsVal = Math.max(...allEntries.map((item) => item.absVal), 100);

  const displayedPositive = showAll ? positiveDrivers : positiveDrivers.slice(0, 5);
  const displayedNegative = showAll ? negativeDrivers : negativeDrivers.slice(0, 5);

  return (
    <div className="enterprise-panel p-5 space-y-4 font-sans">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Actuarial Feature Attribution (SHAP)</h3>
            <div className="group relative">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 cursor-pointer" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-72 p-3 bg-slate-900 text-white text-[11px] rounded shadow-xl z-30 pointer-events-none font-sans">
                <strong className="text-white block mb-1">SHAP Attribution:</strong>
                Calculates game-theoretic Shapley values to decompose predicted annual premium into exact feature contributions.
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            Statistical breakdown of features contributing positively or negatively to this actuarial quote
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 p-1 rounded bg-slate-100 border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'summary' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Summary
          </button>

          <button
            onClick={() => setActiveTab('waterfall')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'waterfall' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Waterfall Plot
          </button>

          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'table' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Detailed Table
          </button>
        </div>
      </div>

      {/* 1. SUMMARY TAB */}
      {activeTab === 'summary' && (
        <div className="space-y-4 animate-fade-in">
          
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Feature attributions shifting quote relative to baseline</span>
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-slate-900 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-700" />
              {showAll ? 'Show Top 5 Only' : `Show All ${allEntries.length}`}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* Positive Drivers (+ Quote) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-emerald-200">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs uppercase tracking-wider font-mono">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Positive Feature Attributions (+ Quote)</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">{positiveDrivers.length} factors</span>
              </div>

              <div className="space-y-2">
                {displayedPositive.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded">No significant positive feature attributions.</p>
                ) : (
                  displayedPositive.map((item, idx) => {
                    const relativePct = ((item.absVal / totalAbsSum) * 100).toFixed(1);
                    const barWidth = Math.min((item.absVal / maxAbsVal) * 100, 100);

                    return (
                      <div key={idx} className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-900">{item.label}</span>
                          <div className="text-right">
                            <span className="font-mono font-bold text-emerald-600">+{formatCurrency(item.shapVal)}</span>
                            <span className="text-[10px] text-slate-500 ml-1 font-mono">({relativePct}%)</span>
                          </div>
                        </div>

                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div style={{ width: `${barWidth}%` }} className="h-full bg-emerald-600 rounded-full" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Negative Drivers (- Quote) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-rose-200">
                <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs uppercase tracking-wider font-mono">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Negative Feature Attributions (- Quote)</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">{negativeDrivers.length} factors</span>
              </div>

              <div className="space-y-2">
                {displayedNegative.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded">No significant negative feature attributions.</p>
                ) : (
                  displayedNegative.map((item, idx) => {
                    const relativePct = ((item.absVal / totalAbsSum) * 100).toFixed(1);
                    const barWidth = Math.min((item.absVal / maxAbsVal) * 100, 100);

                    return (
                      <div key={idx} className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-900">{item.label}</span>
                          <div className="text-right">
                            <span className="font-mono font-bold text-rose-600">{formatCurrency(item.shapVal)}</span>
                            <span className="text-[10px] text-slate-500 ml-1 font-mono">({relativePct}%)</span>
                          </div>
                        </div>

                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div style={{ width: `${barWidth}%` }} className="h-full bg-rose-600 rounded-full" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. WATERFALL DIVERGING PLOT */}
      {activeTab === 'waterfall' && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Diverging SHAP Contribution Plot (Left = Negative Shift, Right = Positive Shift)</span>
            <span className="font-mono">{allEntries.length} total features</span>
          </div>

          <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-2.5">
            {allEntries.slice(0, 12).map((item, idx) => {
              const isPositive = item.shapVal > 0;
              const barWidth = Math.min((item.absVal / maxAbsVal) * 50, 48);

              return (
                <div key={idx} className="grid grid-cols-12 items-center gap-3 text-xs">
                  
                  <div className="col-span-4 font-semibold text-slate-900 truncate" title={item.label}>
                    {item.label}
                  </div>

                  <div className="col-span-6 relative h-4 bg-white rounded border border-slate-200 flex items-center overflow-hidden">
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-400 z-10" />

                    {isPositive ? (
                      <div
                        style={{ left: '50%', width: `${barWidth}%` }}
                        className="absolute h-3 bg-emerald-600 rounded-r"
                      />
                    ) : (
                      <div
                        style={{ right: '50%', width: `${barWidth}%` }}
                        className="absolute h-3 bg-rose-600 rounded-l"
                      />
                    )}
                  </div>

                  <div className={`col-span-2 text-right font-mono font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isPositive ? `+${formatCurrency(item.shapVal)}` : formatCurrency(item.shapVal)}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. DETAILED TABLE */}
      {activeTab === 'table' && (
        <div className="space-y-3 animate-fade-in overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider font-mono">
                <th className="py-3 px-4">Feature Name</th>
                <th className="py-3 px-4">Attribution Shift</th>
                <th className="py-3 px-4">SHAP Dollar Contribution</th>
                <th className="py-3 px-4">Relative Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {allEntries.map((item, idx) => {
                const isPositive = item.shapVal > 0;
                const relativePct = ((item.absVal / totalAbsSum) * 100).toFixed(1);

                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{item.label}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                        isPositive 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {isPositive ? 'Positive Shift' : 'Negative Shift'}
                      </span>
                    </td>
                    <td className={`py-3 px-4 font-mono font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isPositive ? `+${formatCurrency(item.shapVal)}` : formatCurrency(item.shapVal)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{relativePct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Notice */}
      <div className="p-3 rounded bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
        <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-[11px]">
          Statistical feature attributions are calculated by XGBoost SHAP TreeExplainer. They reflect feature shifts relative to the baseline population average and do not imply direct medical causality.
        </p>
      </div>

    </div>
  );
};
