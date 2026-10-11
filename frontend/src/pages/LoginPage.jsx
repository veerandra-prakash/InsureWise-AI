import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, addToast } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans selection:bg-slate-900 selection:text-white">
      <div className="max-w-sm w-full enterprise-panel p-6 space-y-4 shadow-sm">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <Link to="/" className="inline-flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
          </Link>
          <h2 className="text-base font-bold text-slate-900">Sign In to InsureWise</h2>
          <p className="text-xs text-slate-500">Access your health insurance quotes and ML reports</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider text-[10px] font-mono">Email Address</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full enterprise-input pl-9 pr-3 py-1.5 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider text-[10px] font-mono">Password</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full enterprise-input pl-9 pr-3 py-1.5 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-2 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-200">
          Don't have an account?{' '}
          <Link to="/register" className="text-slate-900 font-bold hover:underline">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
};
