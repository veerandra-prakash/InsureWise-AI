import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Eye, Trash2, Calendar, Search } from 'lucide-react';

export const PredictionHistoryTable = ({ predictions = [], onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!predictions || predictions.length === 0) return null;

  const filteredPredictions = predictions.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const f = item.inputFeatures || {};
    return (
      (f.occupation && f.occupation.toLowerCase().includes(q)) ||
      (f.region && f.region.toLowerCase().includes(q)) ||
      (f.gender && f.gender.toLowerCase().includes(q)) ||
      (f.smoker && f.smoker.toLowerCase().includes(q)) ||
      (f.insurance_plan && f.insurance_plan.toLowerCase().includes(q)) ||
      (f.age && String(f.age).includes(q))
    );
  });

  return (
    <div className="space-y-2 font-sans">
      
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 p-2.5 rounded bg-white border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by occupation, region, age..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full enterprise-input pl-8 pr-3 py-1 text-xs"
          />
        </div>
        <div className="text-[11px] text-slate-500 font-mono pr-1">
          Showing {filteredPredictions.length} of {predictions.length} entries
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto enterprise-panel">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-500 text-[10px] font-mono">
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Customer Profile</th>
              <th className="py-3 px-4">Health Vitals</th>
              <th className="py-3 px-4">Annual Quote</th>
              <th className="py-3 px-4">Model</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredPredictions.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-slate-500 text-xs italic">
                  No quote records matching search filter.
                </td>
              </tr>
            ) : (
              filteredPredictions.map((item) => {
                const features = item.inputFeatures || {};
                const premium = item.predictedPremium || item.prediction || 0;
                return (
                  <tr key={item._id || item.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Date */}
                    <td className="py-3 px-4 font-medium text-slate-800 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </td>

                    {/* Customer Profile */}
                    <td className="py-3 px-4 text-slate-800">
                      <div className="font-bold text-slate-900">Age: {features.age || 'N/A'}, {features.gender || ''}</div>
                      <div className="text-[11px] text-slate-500">{features.occupation || 'N/A'} • {features.region || ''}</div>
                    </td>

                    {/* Smoker / Health */}
                    <td className="py-3 px-4 text-[11px]">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className={`w-1.5 h-1.5 rounded-full ${features.smoker === 'Yes' ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                        <span className={features.smoker === 'Yes' ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                          Smoker: {features.smoker || 'No'}
                        </span>
                      </div>
                      <div className="text-slate-500 mt-0.5">BMI: {features.bmi || 'N/A'} • BP: {features.blood_pressure || '120/80'}</div>
                    </td>

                    {/* Predicted Premium */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        {formatCurrency(premium)}
                      </span>
                      <span className="block text-[10px] text-slate-500 font-mono">
                        {formatCurrency(premium / 12)} / mo
                      </span>
                    </td>

                    {/* Model Version */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">
                        v{item.modelVersion || '1.0.0'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1">
                        <Link
                          to={`/history/${item._id || item.id}`}
                          className="p-1.5 rounded bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                          title="View Details & SHAP Explanation"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item._id || item.id)}
                            className="p-1.5 rounded bg-slate-100 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
