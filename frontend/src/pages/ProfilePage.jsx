import React, { useState } from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { formatDate } from '../utils/formatters';
import { Shield, Key, Save, CheckCircle2, Lock } from 'lucide-react';

export const ProfilePage = () => {
  const { user, addToast } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userService.updateProfile({ name });
      addToast('Profile updated successfully.', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-2xl mx-auto pb-10 font-sans">
        
        {/* Header */}
        <div className="pb-3 border-b border-slate-200">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Account Profile</h1>
          <p className="text-slate-500 text-xs mt-0.5">Manage user settings and authentication credentials.</p>
        </div>

        {/* Profile Details Panel */}
        <div className="enterprise-panel p-5 space-y-4">
          <div className="flex items-center gap-3 pb-3.5 border-b border-slate-200">
            <div className="w-10 h-10 rounded bg-slate-900 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">{user?.name}</h2>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {user?.role || 'User'}
                </span>
                <span className="text-[11px] text-slate-500">
                  Member since {formatDate(user?.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-800">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full enterprise-input px-3 py-1.5 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-800">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full enterprise-input px-3 py-1.5 text-xs bg-slate-100 cursor-not-allowed text-slate-500"
              />
              <p className="text-[10px] text-slate-500">Email address cannot be changed once registered.</p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-4 py-2 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>

        {/* Security & Authentication Controls Panel */}
        <div className="enterprise-panel p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Shield className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Authentication Controls</h3>
          </div>

          <div className="space-y-2.5 text-xs text-slate-800">
            <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-slate-700" />
                <span className="font-semibold">JWT Bearer Token Authentication</span>
              </div>
              <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active Session
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold">Password Hash Storage</span>
              </div>
              <span className="text-slate-600 font-mono text-[11px]">Bcrypt Salt Factor 10</span>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};
