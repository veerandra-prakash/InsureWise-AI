import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  History, 
  User, 
  Info, 
  Cpu
} from 'lucide-react';
import { predictionService } from '../services/predictionService';

export const Sidebar = () => {
  const location = useLocation();
  const [mlStatus, setMlStatus] = useState({ online: false, loading: true });

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const checkML = async () => {
      try {
        const res = await predictionService.getMLHealth();
        const data = res.data || res;
        const isOnline = data.model_loaded || data.status === 'ok';
        setMlStatus({ online: isOnline, waking: data.status === 'unavailable', loading: false });
      } catch (e) {
        setMlStatus({ online: false, waking: true, loading: false });
      }
    };
    checkML();
  }, []);

  const coreNavItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Quote Calculator', path: '/predict', icon: Sparkles, badge: 'XGB' },
    { label: 'Quote History', path: '/history', icon: History }
  ];

  const systemNavItems = [
    { label: 'Account Profile', path: '/profile', icon: User },
    { label: 'Architecture Docs', path: '/about', icon: Info }
  ];

  return (
    <aside className="w-52 shrink-0 hidden md:block font-sans">
      <div className="sticky top-14 space-y-4 enterprise-panel p-3">
        
        {/* Workspace Group */}
        <div className="space-y-0.5">
          <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
            Workspace
          </p>
          {coreNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    active ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* System Group */}
        <div className="space-y-0.5 pt-3 border-t border-slate-200">
          <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">
            System
          </p>
          {systemNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ML Status Health Telemetry Card */}
        <div className="pt-3 border-t border-slate-200">
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-slate-600" />
                <span>Actuarial Engine</span>
              </div>
              <span className="text-[9px] font-mono text-slate-500">v2.4</span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  mlStatus.online ? 'bg-emerald-500 animate-pulse' : mlStatus.waking ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'
                }`}
              ></span>
              <span className="text-[11px] font-semibold text-slate-800">
                {mlStatus.loading
                  ? 'Verifying...'
                  : mlStatus.online
                  ? 'XGBoost Microservice'
                  : 'FastAPI (Standby / Auto-Wake)'}
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 pt-1.5 border-t border-slate-200">
              <span>Test R²: <strong className="text-slate-900">87.99%</strong></span>
              <span>Latency: <strong className="text-emerald-700">&lt;180ms</strong></span>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
};
