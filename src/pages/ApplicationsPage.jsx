import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import ScoreGauge from '../components/ScoreGauge';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';
import {
  GitPullRequest,
  Kanban,
  List,
  History,
  Building,
  Calendar,
  X,
  ChevronRight
} from 'lucide-react';

const STAGES = [
  { id: 'SAVED', title: 'Saved', color: 'border-slate-700' },
  { id: 'APPLIED', title: 'Applied', color: 'border-sky-500/40' },
  { id: 'ASSESSMENT', title: 'Assessment', color: 'border-violet-500/40' },
  { id: 'INTERVIEW', title: 'Interview', color: 'border-amber-500/40' },
  { id: 'OFFER', title: 'Offer', color: 'border-emerald-500/40' },
  { id: 'REJECTED', title: 'Rejected', color: 'border-rose-500/40' },
];

const ApplicationsPage = () => {
  const { showToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [selectedAppHistory, setSelectedAppHistory] = useState(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/applications/');
      setApplications(res.data.results ? res.data.results : res.data);
    } catch (err) {
      showToast('Failed to load applications.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/${appId}/status/`, { status: newStatus });
      showToast(`Status updated to ${newStatus}!`, 'success');
      fetchApplications();
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  const handleOpenHistory = (app) => {
    setSelectedAppHistory(app);
    setHistoryModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Application Pipeline</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track status transitions, history logs, and response progress.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-2xl glass-card border border-slate-800">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'kanban'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            Kanban
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            List
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No active applications in pipeline"
          description="Mark saved jobs as Applied to begin visual pipeline tracking."
        />
      ) : viewMode === 'kanban' ? (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-start overflow-x-auto pb-4 custom-scrollbar">
          {STAGES.map((stage) => {
            const stageApps = applications.filter((a) => a.status === stage.id);
            return (
              <div
                key={stage.id}
                className={`glass-panel p-3.5 rounded-3xl border-t-2 ${stage.color} min-w-[220px] flex flex-col min-h-[450px]`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3 px-1">
                  <span className="text-xs font-bold text-slate-200">{stage.title}</span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-900 text-slate-400">
                    {stageApps.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                  {stageApps.map((app) => (
                    <div
                      key={app.id}
                      className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white truncate">{app.job_details?.title}</h4>
                        <p className="text-[11px] text-indigo-400 font-semibold truncate mt-0.5">
                          {app.job_details?.company}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <ScoreGauge score={app.match_score} size="sm" showLabel={false} />
                        <button
                          onClick={() => handleOpenHistory(app)}
                          className="text-[10px] text-slate-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          <History className="w-3 h-3" />
                          Logs
                        </button>
                      </div>

                      {/* Status Transition Select */}
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-indigo-500"
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            Move to: {s.title}
                          </option>
                        ))}
                        <option value="WITHDRAWN">Move to: Withdrawn</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="glass-card p-6 rounded-3xl space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{app.job_details?.title}</span>
                  <StatusBadge status={app.status} />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {app.job_details?.company} • Applied {new Date(app.applied_date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <ScoreGauge score={app.match_score} size="sm" />
                <button
                  onClick={() => handleOpenHistory(app)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold flex items-center gap-1"
                >
                  <History className="w-3.5 h-3.5 text-indigo-400" />
                  Status History
                </button>

                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status History Modal Drawer */}
      {historyModalOpen && selectedAppHistory && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-800 p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Status Transition History</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedAppHistory.job_details?.company} — {selectedAppHistory.job_details?.title}
                </p>
              </div>
              <button
                onClick={() => setHistoryModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
              {selectedAppHistory.status_history?.length > 0 ? (
                selectedAppHistory.status_history.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
                    <div className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={log.status} />
                        <span className="font-mono text-[11px] text-slate-400">
                          {new Date(log.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-300 mt-1">{log.notes || 'Status updated.'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">No transition logs recorded.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
