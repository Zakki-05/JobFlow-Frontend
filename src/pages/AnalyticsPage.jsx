import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { BarChart3, TrendingUp, Award, GitPullRequest, Briefcase, Building, Target } from 'lucide-react';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics/overview/');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSkeleton count={3} />;

  const kpis = data?.kpis || {};
  const funnel = data?.funnel || [];
  const topCompanies = data?.top_companies || [];
  const topRoles = data?.top_roles || [];

  const maxFunnelCount = Math.max(...funnel.map((f) => f.count), 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Job Search Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Conversion metrics, pipeline funnel velocity, and company targeting distribution.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-400" /> Response Rate
          </span>
          <p className="text-4xl font-black text-white font-mono">{kpis.response_rate || 0}%</p>
          <p className="text-xs text-slate-400">Applications receiving recruiter response</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <GitPullRequest className="w-4 h-4 text-amber-400" /> Interview Conversion
          </span>
          <p className="text-4xl font-black text-amber-400 font-mono">{kpis.interview_rate || 0}%</p>
          <p className="text-xs text-slate-400">Applications advancing to interview round</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-400" /> Offer Rate
          </span>
          <p className="text-4xl font-black text-emerald-400 font-mono">{kpis.offer_rate || 0}%</p>
          <p className="text-xs text-slate-400">Applications converted into official offers</p>
        </div>
      </div>

      {/* Visual Application Funnel */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          Application Conversion Funnel
        </h2>

        <div className="space-y-4">
          {funnel.map((item, idx) => {
            const widthPct = Math.max(8, Math.round((item.count / maxFunnelCount) * 100));
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-200">{item.stage}</span>
                  <span className="text-indigo-400 font-mono font-bold">{item.count}</span>
                </div>
                <div className="w-full bg-slate-900 h-4 rounded-xl overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 h-full rounded-xl transition-all duration-500"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distribution Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-400" />
            Top Targeted Companies
          </h2>
          <div className="space-y-2">
            {topCompanies.map((c, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-center text-xs">
                <span className="font-bold text-white">{c.company}</span>
                <span className="font-mono text-indigo-300 font-bold">{c.count} applications</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            Most Targeted Roles
          </h2>
          <div className="space-y-2">
            {topRoles.map((r, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-center text-xs">
                <span className="font-bold text-white">{r.title}</span>
                <span className="font-mono text-indigo-300 font-bold">{r.count} applications</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
