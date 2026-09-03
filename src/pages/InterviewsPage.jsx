import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';
import { Calendar, Plus, X, UserCheck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const InterviewsPage = () => {
  const { showToast } = useToast();
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    application: '',
    round: 'Technical',
    interview_date: '',
    interviewer: 'Engineering Manager',
    notes: 'Prepare coding algorithms & system design.',
    status: 'SCHEDULED',
    result: 'PENDING',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [intRes, appRes] = await Promise.all([
        api.get('/interviews/'),
        api.get('/applications/'),
      ]);
      const intList = intRes.data.results ? intRes.data.results : intRes.data;
      const appList = appRes.data.results ? appRes.data.results : appRes.data;
      setInterviews(intList);
      setApplications(appList);
      if (appList.length > 0 && !formData.application) {
        setFormData((prev) => ({ ...prev, application: appList[0].id }));
      }
    } catch (err) {
      showToast('Failed to load interviews.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.application) {
      showToast('Please select a tracked application first.', 'warning');
      return;
    }
    try {
      await api.post('/interviews/', formData);
      showToast('Interview scheduled!', 'success');
      setModalOpen(false);
      fetchData();
    } catch (err) {
      showToast('Error scheduling interview.', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Interview Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">
            Schedule upcoming interview rounds, track interviewers, and record interview results.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Interview</span>
        </button>
      </div>

      {/* Interview List */}
      {loading ? (
        <LoadingSkeleton count={3} />
      ) : interviews.length === 0 ? (
        <EmptyState
          title="No interviews scheduled yet"
          description="Schedule interview rounds for active job applications."
          actionText="Schedule Interview"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interviews.map((item) => (
            <div key={item.id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-white">{item.company_name}</h3>
                  <p className="text-xs text-indigo-400 font-semibold">{item.job_title}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-500/30">
                  {item.round}
                </span>
              </div>

              <div className="text-xs space-y-1.5 text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono">{new Date(item.interview_date).toLocaleString()}</span>
                </div>
                {item.interviewer && (
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Interviewer: {item.interviewer}</span>
                  </div>
                )}
                {item.notes && <p className="text-slate-400 text-[11px] pt-1">{item.notes}</p>}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-slate-400">
                  Status: <span className="text-indigo-300 font-mono">{item.status}</span>
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300">
                  Result: {item.result}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-800 p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h3 className="text-base font-bold text-white">Schedule New Interview Round</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Application *</label>
                <select
                  value={formData.application}
                  onChange={(e) => setFormData({ ...formData, application: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                >
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.job_details?.company} — {app.job_details?.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Round Type</label>
                  <select
                    value={formData.round}
                    onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="HR">HR Screen</option>
                    <option value="Technical">Technical Round</option>
                    <option value="Coding">Coding Assessment</option>
                    <option value="Managerial">Managerial</option>
                    <option value="Final">Final On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Interview Date/Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.interview_date}
                    onChange={(e) => setFormData({ ...formData, interview_date: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Interviewer Name / Title</label>
                <input
                  type="text"
                  value={formData.interviewer}
                  onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                  placeholder="e.g. Jane Doe (Tech Lead)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes & Topics</label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg"
                >
                  Schedule Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewsPage;
