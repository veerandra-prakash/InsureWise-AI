import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { predictionService } from '../services/predictionService';
import { useAuth } from '../context/AuthContext';
import { PredictionHistoryTable } from '../components/PredictionHistoryTable';
import { EmptyState } from '../components/EmptyState';
import { SkeletonCard } from '../components/LoadingSpinner';
import { History, RefreshCw } from 'lucide-react';

export const HistoryPage = () => {
  const { addToast } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await predictionService.getHistory();
      const list = res.data?.predictions || res.predictions || [];
      setPredictions(list);
    } catch (err) {
      addToast('Failed to load prediction history.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prediction record?')) return;

    try {
      await predictionService.deletePrediction(id);
      addToast('Prediction record deleted successfully.', 'success');
      setPredictions((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } catch (err) {
      addToast('Failed to delete prediction record.', 'error');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-6xl mx-auto pb-8 font-sans">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Prediction History Audit Trail
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">
              Historical record of all actuarial quotes generated for your user account.
            </p>
          </div>

          <button
            onClick={fetchHistory}
            className="btn-secondary px-3 py-1.5 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Audit Log</span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonCard />
        ) : predictions.length === 0 ? (
          <EmptyState
            icon={History}
            title="No Prediction Records Found"
            description="You have not created any premium quotes yet. Start by generating your first quote."
            actionLabel="New Premium Quote"
            actionLink="/predict"
          />
        ) : (
          <PredictionHistoryTable predictions={predictions} onDelete={handleDelete} />
        )}

      </div>
    </DashboardLayout>
  );
};
