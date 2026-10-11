import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { predictionService } from '../services/predictionService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { PredictionHistoryTable } from '../components/PredictionHistoryTable';
import { EmptyState } from '../components/EmptyState';
import { SkeletonCard } from '../components/LoadingSpinner';
import { 
  Sparkles, 
  History, 
  DollarSign, 
  Activity, 
  ArrowRight, 
  Shield,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Cpu,
  BarChart2,
  CheckCircle2
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, logout, addToast } = useAuth();
  const navigate = useNavigate();

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await predictionService.getHistory();
      const list = res.data?.predictions || res.predictions || [];
      setPredictions(list);
    } catch (err) {
      console.error('Failed to load prediction history:', err);
      if (err.response?.status === 401) {
        addToast('Your session has expired. Please log in again.', 'error');
        logout();
        navigate('/login');
        return;
      }
      const msg = err.response?.data?.message || 'Unable to connect to prediction service. Please check your backend connection.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalCount = predictions.length;
  const latestRecord = predictions[0] || null;
  const latestPrediction = latestRecord ? (latestRecord.predictedPremium || latestRecord.prediction || 0) : 0;
  const avgPrediction = totalCount > 0
    ? predictions.reduce((sum, item) => sum + (item.predictedPremium || item.prediction || 0), 0) / totalCount
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-6xl mx-auto pb-8 font-sans">
        
        {/* Header Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}. Actuarial risk reporting and telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              className="btn-secondary px-3 py-1.5 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <Link
              to="/predict"
              className="btn-primary px-3.5 py-1.5 flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Calculate New Quote</span>
            </Link>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchDashboardData}
              className="px-2.5 py-1 rounded bg-white hover:bg-rose-100 text-rose-900 border border-rose-300 text-xs font-semibold transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* User Profile Card */}
          <div className="enterprise-panel p-4 space-y-3 flex flex-col justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="truncate">
                <h3 className="text-xs font-bold text-slate-900 truncate">{user?.name}</h3>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Session</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Shield className="w-3 h-3" /> Active JWT
              </span>
            </div>
          </div>

          {/* KPI 1: Total Quotes */}
          <div className="enterprise-panel p-4 space-y-1 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              <span>Total Quotes</span>
              <History className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono">{loading ? '...' : totalCount}</div>
            <p className="text-[11px] text-slate-500">Stored in account database</p>
          </div>

          {/* KPI 2: Latest Quote */}
          <div className="enterprise-panel p-4 space-y-1 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              <span>Latest Quote</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {loading ? '...' : (totalCount > 0 ? formatCurrency(latestPrediction) : '$0.00')}
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {latestRecord ? `Quoted ${formatDate(latestRecord.createdAt)}` : 'No quotes recorded'}
            </p>
          </div>

          {/* KPI 3: Average Quote */}
          <div className="enterprise-panel p-4 space-y-1 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              <span>Average Quote</span>
              <Activity className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {loading ? '...' : (totalCount > 0 ? formatCurrency(avgPrediction) : '$0.00')}
            </div>
            <p className="text-[11px] text-slate-500">Mean across saved quotes</p>
          </div>

        </div>

        {/* Split Grid: Left = Recent Quotes Data Table, Right = Actuarial Telemetry Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Recent Quotes Table (8 Cols) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-900" />
                <h2 className="text-sm font-bold text-slate-900">Recent Actuarial Quotes</h2>
              </div>
              {totalCount > 0 && (
                <Link to="/history" className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1">
                  <span>View Full History ({totalCount})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {loading ? (
              <div className="space-y-2">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : totalCount === 0 ? (
              <EmptyState
                icon={Sparkles}
                title="No Predictions Created Yet"
                description="Calculate your first personalized annual insurance premium quote powered by explainable XGBoost machine learning."
                actionLabel="Calculate Premium Quote"
                actionLink="/predict"
              />
            ) : (
              <PredictionHistoryTable predictions={predictions.slice(0, 5)} />
            )}
          </div>

          {/* Actuarial Telemetry & Model Health Panel (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-700" />
              <h2 className="text-sm font-bold text-slate-900">Model Telemetry</h2>
            </div>

            <div className="enterprise-panel p-4 space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900">XGBoost Microservice</span>
                <span className="flex items-center gap-1 text-emerald-700 font-mono text-[11px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active
                </span>
              </div>

              <div className="space-y-2 text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Model Pipeline:</span>
                  <span className="font-mono text-slate-900 font-semibold">insurewise_model.joblib</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Explainability Engine:</span>
                  <span className="font-mono text-slate-900 font-semibold">SHAP TreeExplainer</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Cross Validation R²:</span>
                  <span className="font-mono font-bold text-emerald-700">0.8799</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Mean Absolute Error:</span>
                  <span className="font-mono font-bold text-slate-900">$2,064.14</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Evaluated Features:</span>
                  <span className="font-mono text-slate-900">41 Features</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <Link
                  to="/about"
                  className="btn-secondary w-full py-1.5 flex items-center justify-center gap-1.5 text-xs text-slate-800"
                >
                  <BarChart2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Full Architecture Specs</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};
