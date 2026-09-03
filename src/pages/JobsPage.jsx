import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import JobFormModal from '../components/JobFormModal';
import StatusBadge from '../components/StatusBadge';
import SkillBadge from '../components/SkillBadge';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';
import {
  Briefcase,
  Search,
  Plus,
  Filter,
  ExternalLink,
  Trash2,
  Edit,
  Zap,
  CheckCircle,
  MapPin,
  DollarSign
} from 'lucide-react';

const JobsPage = () => {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [workMode, setWorkMode] = useState('All');
  const [jobType, setJobType] = useState('All');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (workMode !== 'All') params.append('work_mode', workMode);
      if (jobType !== 'All') params.append('job_type', jobType);

      const res = await api.get(`/jobs/?${params.toString()}`);
      setJobs(res.data.results ? res.data.results : res.data);
    } catch (err) {
      showToast('Failed to fetch jobs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search, workMode, jobType]);

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await api.delete(`/jobs/${id}/`);
      showToast('Job removed from board.', 'info');
      fetchJobs();
    } catch (err) {
      showToast('Failed to delete job.', 'error');
    }
  };

  const handleMarkApplied = async (job) => {
    try {
      await api.post('/applications/', { job_id: job.id, status: 'APPLIED' });
      showToast(`Marked application for ${job.company} as APPLIED!`, 'success');
      fetchJobs();
    } catch (err) {
      showToast('Application already tracked or error occurred.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Saved Jobs Board</h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, and track applications across targeted positions.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingJob(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Job</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, title, location, or skill..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 shrink-0">Work Mode:</span>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="All">All Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 shrink-0">Job Type:</span>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <LoadingSkeleton count={4} />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No saved jobs matching your filter"
          description="Save new jobs or clear your active search query."
          actionText="Add Job Posting"
          onAction={() => {
            setEditingJob(null);
            setModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="glass-card p-6 rounded-3xl flex flex-col justify-between hover:border-indigo-500/30 transition-all space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-xs text-indigo-400 font-semibold mt-0.5">{job.company}</p>
                  </div>
                  <StatusBadge status={job.application_status} />
                </div>

                {/* Badges bar */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-3">
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {job.location} ({job.work_mode})
                  </span>
                  {job.salary && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-emerald-300 font-mono">
                      <DollarSign className="w-3 h-3 text-emerald-500" />
                      {job.salary}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
                    {job.job_type}
                  </span>
                </div>

                {/* Skills tags */}
                {job.required_skills_text && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <p className="text-[11px] font-semibold text-slate-500 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {job.required_skills_text.split(',').slice(0, 5).map((sk, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-950/40 text-indigo-300 border border-indigo-500/20">
                          {sk.strip ? sk.strip() : sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 font-semibold border border-slate-800 transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-indigo-400" />
                    Details & Match
                  </Link>

                  {!job.is_applied && (
                    <button
                      onClick={() => handleMarkApplied(job)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 font-semibold border border-emerald-500/30 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      Mark Applied
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingJob(job);
                      setModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit Job"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <JobFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchJobs}
        initialJob={editingJob}
      />
    </div>
  );
};

export default JobsPage;
