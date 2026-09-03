import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ScoreGauge from '../components/ScoreGauge';
import SkillBadge from '../components/SkillBadge';
import StatusBadge from '../components/StatusBadge';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useToast } from '../context/ToastContext';
import {
  Briefcase,
  ArrowLeft,
  ExternalLink,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle,
  Zap,
  ShieldCheck,
  Building,
  GraduationCap
} from 'lucide-react';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [job, setJob] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/jobs/${id}/`);
      setJob(res.data);

      // Trigger JobMatch score calculation
      const matchRes = await api.post('/jobs/match-score/', { job_id: id });
      setMatchData(matchRes.data);
    } catch (err) {
      showToast('Failed to load job details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const handleTrackApplication = async () => {
    try {
      await api.post('/applications/', { job_id: id, status: 'APPLIED' });
      showToast('Tracked in Application Pipeline!', 'success');
      navigate('/applications');
    } catch (err) {
      showToast('Already tracked in pipeline.', 'info');
    }
  };

  if (loading) return <LoadingSkeleton count={3} />;
  if (!job) return <div className="text-center py-12 text-slate-400">Job posting not found.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div>
        <Link to="/jobs" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs Board
        </Link>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-white">{job.title}</h1>
              <StatusBadge status={job.application_status} />
            </div>
            <p className="text-sm font-semibold text-indigo-400 mt-1 flex items-center gap-2">
              <Building className="w-4 h-4" />
              {job.company}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-4">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location} ({job.work_mode})</span>
              {job.salary && <span className="flex items-center gap-1 text-emerald-300 font-mono"><DollarSign className="w-3.5 h-3.5 text-emerald-500" /> {job.salary}</span>}
              <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-slate-500" /> {job.education}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-500" /> Saved {new Date(job.date_saved).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {job.job_url && (
              <a
                href={job.job_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold glass-card hover:bg-slate-800 text-slate-200 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Apply on Site
              </a>
            )}

            {!job.is_applied && (
              <button
                onClick={handleTrackApplication}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                Track Application
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Flagship Match Engine Breakdown */}
      {matchData && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400" />
                JobFlow Match Score & Factor Analysis
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Transparent 5-factor rule-based score evaluated against your stored skills & experience profile.
              </p>
            </div>
            <ScoreGauge score={matchData.overall_match_score} size="md" />
          </div>

          {/* Factor Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Technical Skills', val: `${matchData.factor_breakdown?.technical_skills_score}/50` },
              { label: 'Experience', val: `${matchData.factor_breakdown?.experience_score}/20` },
              { label: 'Education', val: `${matchData.factor_breakdown?.education_score}/10` },
              { label: 'Responsibilities', val: `${matchData.factor_breakdown?.responsibilities_score}/10` },
              { label: 'Location & Mode', val: `${matchData.factor_breakdown?.location_score}/10` },
            ].map((f, i) => (
              <div key={i} className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">{f.label}</span>
                <span className="text-base font-bold text-indigo-300 font-mono mt-1 block">{f.val}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed">
            <span className="font-bold">Recommendation:</span> {matchData.recommendation}
          </div>

          {/* Matching & Missing Skills Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Matching Skills</h3>
              <div className="flex flex-wrap gap-2">
                {matchData.matching_skills?.length > 0 ? (
                  matchData.matching_skills.map((sk, idx) => <SkillBadge key={idx} name={sk} isMatch={true} />)
                ) : (
                  <span className="text-xs text-slate-500">No matching skills identified.</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Missing Skills (To Gain)</h3>
              <div className="flex flex-wrap gap-2">
                {matchData.missing_skills?.length > 0 ? (
                  matchData.missing_skills.map((sk, idx) => <SkillBadge key={idx} name={sk} isMatch={false} />)
                ) : (
                  <span className="text-xs text-emerald-400 font-semibold">All required skills matched!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Description Text */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
        <h2 className="text-base font-bold text-white">Full Job Description</h2>
        <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          {job.description || 'No detailed description text provided.'}
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
