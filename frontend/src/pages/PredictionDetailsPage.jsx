import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { predictionService } from '../services/predictionService';
import { useAuth } from '../context/AuthContext';
import { PredictionResultCard } from '../components/PredictionResultCard';
import { ShapExplanationCard } from '../components/ShapExplanationCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ArrowLeft, Trash2, UserCheck } from 'lucide-react';

export const PredictionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useAuth();

  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await predictionService.getPredictionById(id);
        if (res.data && res.data.prediction) {
          setPredictionData(res.data.prediction);
        }
      } catch (err) {
        setError('Prediction record not found or unauthorized access.');
        addToast('Could not load prediction record details.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this prediction record?')) return;
    try {
      await predictionService.deletePrediction(id);
      addToast('Prediction record deleted successfully.', 'success');
      navigate('/history');
    } catch (err) {
      addToast('Failed to delete prediction record.', 'error');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner label="Retrieving prediction record details..." />
      </DashboardLayout>
    );
  }

  if (error || !predictionData) {
    return (
      <DashboardLayout>
        <div className="enterprise-panel p-6 text-center space-y-3 max-w-md mx-auto my-12">
          <h3 className="text-xs font-bold text-rose-600">Record Not Found</h3>
          <p className="text-xs text-slate-500">{error || 'This prediction record does not exist or belongs to another user.'}</p>
          <Link
            to="/history"
            className="btn-primary px-3.5 py-1.5 inline-flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to History</span>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const { predictedPremium, modelVersion, explanation, inputFeatures, createdAt } = predictionData;

  const explanationObj = explanation instanceof Map ? Object.fromEntries(explanation) : explanation;

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-4xl mx-auto pb-10 font-sans">
        
        {/* Navigation Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <Link
            to="/history"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Back to Quote History</span>
          </Link>

          <button
            onClick={handleDelete}
            className="px-3 py-1.5 rounded bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Audit Record</span>
          </button>
        </div>

        {/* Prediction Summary Card */}
        <PredictionResultCard
          prediction={predictedPremium}
          modelVersion={modelVersion}
          date={createdAt}
          inputFeatures={inputFeatures}
          explanation={explanationObj}
        />

        {/* SHAP Visualizer */}
        <ShapExplanationCard explanation={explanationObj} prediction={predictedPremium} />

        {/* Customer Input Profile */}
        {inputFeatures && (
          <div className="enterprise-panel p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200">
              <UserCheck className="w-4 h-4 text-slate-900" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Evaluated Health Metrics</h3>
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
