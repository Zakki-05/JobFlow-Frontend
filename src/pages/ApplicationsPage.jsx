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
  Plus,
  Trash2,
  Edit,
  Clock,
  CheckCircle,
  FileText,
  ChevronRight
} from 'lucide-react';

const STAGES = [
  { id: 'SAVED', title: 'Saved', color: 'border-slate-700' },
  { id: 'APPLIED', title: 'Applied', color: 'border-sky-500/40' },
  { id: 'SHORTLISTED', title: 'Shortlisted', color: 'border-indigo-500/40' },
  { id: 'INTERVIEW', title: 'Interview', color: 'border-amber-500/40' },
  { id: 'OFFER', title: 'Offer', color: 'border-emerald-500/40' },
  { id: 'REJECTED', title: 'Rejected', color: 'border-rose-500/40' },
];

const ApplicationsPage = () => {
  const { showToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'

  // Modals
  const [selectedAppHistory, setSelectedAppHistory] = useState(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  // Form states for Add/Edit
  const [formCompany, setFormCompany] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formStatus, setFormStatus] = useState('APPLIED');
  const [formNotes, setFormNotes] = useState('');
  const [formInterviewDate, setFormInterviewDate] = useState('');

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

  const handleDelete = async (appId) => {
    if (!window.confirm('Are you sure you want to delete this application record?')) return;
    try {
      await api.delete(`/applications/${appId}/`);
      showToast('Application deleted.', 'info');
      fetchApplications();
    } catch (err) {
      showToast('Failed to delete application.', 'error');
    }
  };

  const handleOpenAddModal = () => {
    setFormCompany('');
    setFormTitle('');
    setFormStatus('APPLIED');
    setFormNotes('');
    setFormInterviewDate('');
    setAddModalOpen(true);
  };

  const handleOpenEditModal = (app) => {
    setEditingApp(app);
    setFormCompany(app.job_details?.company || app.company_name || '');
    setFormTitle(app.job_details?.title || app.job_title || '');
    setFormStatus(app.status || 'APPLIED');
    setFormNotes(app.notes || '');
    setFormInterviewDate(app.interview_date || '');
    setEditModalOpen(true);
  };

  const handleSaveCustomApplication = async (e) => {
    e.preventDefault();
    if (!formCompany || !formTitle) {
      showToast('Company and Job Title are required.', 'error');
      return;
    }

    try {
      // First create job entry if custom
      const jobRes = await api.post('/jobs/', {
        company: formCompany,
        title: formTitle,
        location: 'Remote / Global',
        work_mode: 'Remote',
        job_type: 'Full-time',
        description: formNotes || `Application for ${formTitle} at ${formCompany}`
      });

      const newJobId = jobRes.data.id;

      // Create application
      await api.post('/applications/', {
        job_id: newJobId,
        status: formStatus,
        notes: formNotes
      });

      showToast('New application tracked successfully!', 'success');
      setAddModalOpen(false);
      fetchApplications();
    } catch (err) {
      showToast('Failed to save application.', 'error');
    }
  };

  const handleUpdateApplication = async (e) => {
    e.preventDefault();
    if (!editingApp) return;

    try {
      await api.patch(`/applications/${editingApp.id}/status/`, {
        status: formStatus,
        notes: formNotes
      });

      showToast('Application details updated!', 'success');
      setEditModalOpen(false);
      fetchApplications();
    } catch (err) {
      showToast('Failed to update application.', 'error');
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
            Track status transitions, custom applications, notes, and interview dates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Add Custom Application Button */}
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>

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
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No active applications in pipeline"
          description="Track external applications or apply to saved jobs on your board."
          actionText="Add Application"
          onAction={handleOpenAddModal}
        />
      ) : viewMode === 'kanban' ? (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-start overflow-x-auto pb-4 custom-scrollbar">
          {STAGES.map((stage) => {
            const stageApps = applications.filter((a) => a.status === stage.id);
            return (
              <div
                key={stage.id}
                className={`glass-panel p-3.5 rounded-3xl border-t-2 ${stage.color} min-w-[230px] flex flex-col min-h-[480px]`}
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
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{app.job_details?.title || 'Job Role'}</h4>
                          <p className="text-[11px] text-indigo-400 font-semibold truncate mt-0.5">
                            {app.job_details?.company || 'Company'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleOpenEditModal(app)}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                            title="Edit details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                            title="Delete application"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {app.notes && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 italic bg-slate-950/50 p-2 rounded-xl border border-slate-800/80">
                          "{app.notes}"
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <ScoreGauge score={app.match_score} size="sm" showLabel={false} />
                        <button
                          onClick={() => handleOpenHistory(app)}
                          className="text-[10px] text-slate-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          <History className="w-3 h-3" />
                          Logs ({app.status_history?.length || 0})
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
                  {app.notes && <span className="ml-2 text-indigo-300">"{app.notes}"</span>}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <ScoreGauge score={app.match_score} size="sm" />

                <button
                  onClick={() => handleOpenHistory(app)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold flex items-center gap-1"
                >
                  <History className="w-3.5 h-3.5 text-indigo-400" />
                  Logs
                </button>

                <button
                  onClick={() => handleOpenEditModal(app)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(app.id)}
                  className="p-2 rounded-xl text-rose-400 hover:text-rose-300 bg-rose-950/40"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
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
                  <option value="WITHDRAWN">Withdrawn</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Custom Application Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-slate-800 p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h3 className="text-base font-bold text-white">Add Application to Pipeline</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomApplication} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  placeholder="e.g. Google, Swiggy, Razorpay"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Frontend Engineer, SDE-1"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Referral Details</label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Applied via LinkedIn, referral from Tech Lead, recruiter email..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Application Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-slate-800 p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Edit Application Details</h3>
                <p className="text-xs text-slate-400 mt-0.5">{formCompany} — {formTitle}</p>
              </div>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateApplication} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Status Stage</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                  <option value="WITHDRAWN">Withdrawn</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes & Logs</label>
                <textarea
                  rows={4}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Update interview round progress, recruiter feedback, salary offer..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
                >
                  Update Details
                </button>
              </div>
            </form>
          </div>
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

