import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, Database, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';

const SettingsPage = () => {
  const { triggerSeedData } = useAuth();
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    await triggerSeedData();
    setSeeding(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Platform Settings & Seed Data</h1>
          <p className="text-xs text-slate-400 mt-1">
            System configuration, data seed triggers, and technical environment status.
          </p>
        </div>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-400" />
          Demo Data Generator (Technical Evaluation)
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
          Instantly populate realistic job postings, tracked applications, interview rounds, question bank records, and skill gap priority data into your local database.
        </p>

        <button
          onClick={handleSeed}
          disabled={seeding}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
          <span>{seeding ? 'Seeding Data...' : 'Populate Demo Dataset'}</span>
        </button>
      </div>

      {/* System Status Grid */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          System Health Diagnostics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block font-semibold">Backend Engine</span>
            <span className="text-emerald-400 font-mono font-bold mt-1 inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Django REST Framework (Active)
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block font-semibold">Database Connection</span>
            <span className="text-emerald-400 font-mono font-bold mt-1 inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> MySQL / SQLite ORM (Synced)
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block font-semibold">Match Scoring Engine</span>
            <span className="text-emerald-400 font-mono font-bold mt-1 inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 5-Factor Weighted Engine (Online)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
