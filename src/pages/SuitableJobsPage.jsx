import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ScoreGauge from '../components/ScoreGauge';
import SkillBadge from '../components/SkillBadge';
import { useToast } from '../context/ToastContext';
import {
  Compass,
  Search,
  Filter,
  ExternalLink,
  PlusCircle,
  Check,
  Building2,
  MapPin,
  Briefcase,
  IndianRupee,
  Sparkles,
  BookmarkPlus
} from 'lucide-react';

const SuitableJobsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('All');
  const [workMode, setWorkMode] = useState('All');
  const [importingId, setImportingId] = useState(null);

  const fetchSuitableJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (source !== 'All') params.append('source', source);
      if (workMode !== 'All') params.append('work_mode', workMode);

      const res = await api.get(`/jobs/suitable-jobs/?${params.toString()}`);
      setJobs(res.data.results || []);
    } catch (err) {
      showToast('Failed to fetch suitable job listings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuitableJobs();
  }, [source, workMode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSuitableJobs();
  };

  const handleImport = async (job) => {
    setImportingId(job.id);
    try {
      const res = await api.post('/jobs/import-job/', job);
      showToast(res.data.message || 'Job imported to your board!', 'success');
      
      // Update local state to show imported status
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, is_imported: true } : j))
      );
    } catch (err) {
      showToast('Failed to import job to your board.', 'error');
    } finally {
      setImportingId(null);
    }
  };

  const getSourceBadgeColor = (src) => {
    switch (src) {
      case 'Naukri.com':
        return 'bg-blue-950/80 text-blue-300 border-blue-500/30';
      case 'Instahyre':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30';
      case 'LinkedIn India':
        return 'bg-sky-950/80 text-sky-300 border-sky-500/30';
      case 'Unstop':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/30';
      case 'Glassdoor India':
        return 'bg-teal-950/80 text-teal-300 border-teal-500/30';
      case 'Indeed India':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/30';
      default:
        return 'bg-indigo-950/80 text-indigo-300 border-indigo-500/30';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            Live Fresher Portal Aggregator
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Suitable Jobs for Freshers
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Curated engineering & tech roles from Naukri, Instahyre, LinkedIn India, Unstop, Glassdoor & top career portals.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 sm:p-5 rounded-3xl border border-slate-800 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job title, company, or required skill (e.g. React, SDE-1, Python)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all self-stretch sm:self-auto"
          >
            Search Suitable Jobs
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter By Portal:</span>
          </div>

          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="All">All Job Portals</option>
            <option value="Naukri.com">Naukri.com</option>
            <option value="Instahyre">Instahyre</option>
            <option value="LinkedIn India">LinkedIn India</option>
            <option value="Unstop">Unstop (Dare2Compete)</option>
            <option value="Glassdoor India">Glassdoor India</option>
            <option value="Indeed India">Indeed India</option>
            <option value="Company Portal">Top Company Portals</option>
          </select>

          <div className="flex items-center gap-1.5 text-slate-400 font-semibold ml-auto sm:ml-2">
            <span>Work Mode:</span>
          </div>

          <select
            value={workMode}
            onChange={(e) => setWorkMode(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="All">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <LoadingSkeleton count={3} />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No suitable jobs match your filter"
          description="Try broadening your portal filter or search keywords."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getSourceBadgeColor(
                          job.source
                        )}`}
                      >
                        {job.source}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900 text-slate-300 border border-slate-800">
                        {job.work_mode}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900 text-slate-300 border border-slate-800">
                        {job.job_type}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-white">{job.title}</h3>
                    <p className="text-xs text-indigo-400 font-semibold mt-0.5 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {job.company}
                    </p>
                  </div>

                  <ScoreGauge score={job.match_score} size="md" />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-400 font-mono">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {job.salary}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {job.required_skills_text.split(',').map((sk, idx) => (
                    <SkillBadge key={idx} name={sk.trim()} isMatch={true} />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 gap-3">
                {job.is_imported ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                    <Check className="w-3.5 h-3.5" /> Imported to Board
                  </span>
                ) : (
                  <button
                    onClick={() => handleImport(job)}
                    disabled={importingId === job.id}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>{importingId === job.id ? 'Importing...' : 'Import to My Board'}</span>
                  </button>
                )}

                <a
                  href={job.job_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <span>Apply on {job.source}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuitableJobsPage;
