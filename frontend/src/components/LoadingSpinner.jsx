import React from 'react';

export const LoadingSpinner = ({ label = 'Processing...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 space-y-3">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      <p className="text-xs font-semibold text-slate-600 font-mono">{label}</p>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="enterprise-panel p-4 animate-pulse space-y-3">
      <div className="h-5 bg-slate-200 rounded w-1/3"></div>
      <div className="h-8 bg-slate-200 rounded w-1/2"></div>
      <div className="space-y-1.5 pt-2">
        <div className="h-3.5 bg-slate-200 rounded w-full"></div>
        <div className="h-3.5 bg-slate-200 rounded w-4/5"></div>
      </div>
    </div>
  );
};
