import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';
import { Clock, CheckCircle2, AlertTriangle, Building, Calendar } from 'lucide-react';

const FollowUpsPage = () => {
  const { showToast } = useToast();
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchFollowups = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/applications/followups/?status=${filter}`);
      setFollowups(res.data.results ? res.data.results : res.data);
    } catch (err) {
      showToast('Failed to load follow-ups.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowups();
  }, [filter]);

  const handleMarkComplete = async (id) => {
    try {
      await api.patch(`/applications/followups/${id}/`, { status: 'COMPLETED' });
      showToast('Follow-up marked as completed!', 'success');
      fetchFollowups();
    } catch (err) {
      showToast('Error updating follow-up.', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Follow-Up Alert Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Stay proactive by following up on submitted applications at optimal intervals.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Follow-ups</option>
            <option value="NEEDS_FOLLOWUP">Needs Follow-Up</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : followups.length === 0 ? (
        <EmptyState title="No follow-up alerts" description="All application follow-ups are completed or up to date!" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {followups.map((fol) => (
            <div
              key={fol.id}
              className={`glass-card p-6 rounded-3xl border transition-all ${
                fol.status === 'NEEDS_FOLLOWUP'
                  ? 'border-sky-500/40 bg-sky-950/20'
                  : fol.status === 'COMPLETED'
                  ? 'border-slate-800 opacity-70'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-white">{fol.company_name}</h3>
                  <p className="text-xs text-indigo-400 font-semibold">{fol.job_title}</p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                    fol.status === 'NEEDS_FOLLOWUP'
                      ? 'bg-sky-950 text-sky-300 border-sky-500/30'
                      : fol.status === 'COMPLETED'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}
                >
                  {fol.status}
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-1.5 pt-3 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  <span>Scheduled Date: <strong className="font-mono text-white">{fol.followup_date}</strong></span>
                </div>
                <p className="text-slate-400 text-[11px]">{fol.notes || 'Send polite check-in email to recruiter.'}</p>
              </div>

              {fol.status !== 'COMPLETED' && (
                <div className="pt-4 border-t border-slate-800/80 flex justify-end">
                  <button
                    onClick={() => handleMarkComplete(fol.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark Completed
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowUpsPage;
