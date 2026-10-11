import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastContainer = () => {
  const { toasts, removeToast } = useAuth();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-slate-700 shrink-0" />;
    }
  };

  const getStyle = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-200 bg-white text-slate-900 shadow-md';
      case 'error':
        return 'border-rose-200 bg-white text-slate-900 shadow-md';
      default:
        return 'border-slate-200 bg-white text-slate-900 shadow-md';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full px-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            className={`pointer-events-auto flex items-center justify-between gap-2.5 p-3 rounded border text-xs font-sans ${getStyle(toast.type)}`}
          >
            <div className="flex items-center gap-2.5">
              {getIcon(toast.type)}
              <p className="font-semibold text-slate-800">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
