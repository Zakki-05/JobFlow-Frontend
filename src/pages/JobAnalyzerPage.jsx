import React, { useState } from 'react';
import api from '../services/api';
import ScoreGauge from '../components/ScoreGauge';
import SkillBadge from '../components/SkillBadge';
import { useToast } from '../context/ToastContext';
import {
  Zap,
  Sparkles,
  FileText,
  CheckCircle,
  Building,
  MapPin,
  Loader2,
  ShieldCheck,
  Plus
} from 'lucide-react';

const JobAnalyzerPage = () => {
  const { showToast } = useToast();
  const [jobText, setJobText] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [workMode, setWorkMode] = useState('Remote');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!jobText.trim()) {
      showToast('Please paste a job description to analyze.', 'warning');
      return;
    }

    setAnalyzing(true);
    try {
      // Calculate transparent match score against user profile
      const res = await api.post('/jobs/match-score/', {
        description: jobText,
        company: company || 'Target Company',
        title: title || 'Target Role',
        work_mode: workMode,
        location: workMode
      });

      setResult(res.data);
      showToast('Job Description analyzed successfully!', 'success');
    } catch (err) {
      showToast('Failed to analyze job description.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveJobFromAnalyzer = async () => {
    try {
      await api.post('/jobs/', {
        title: title || 'Analyzed Position',
        company: company || 'Target Company',
        description: jobText,
        work_mode: workMode,
        required_skills_text: result?.matching_skills?.concat(result?.missing_skills || []).join(', ')
      });
      showToast('Saved to Jobs Board!', 'success');
    } catch (err) {
      showToast('Failed to save job.', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            Flagship Intelligence Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Job Description Skill Analyzer & Matcher
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Paste any job description to extract technical skills and calculate a transparent 5-factor JobMatch score.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Form: Input JD Text */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Paste Job Posting Data
          </h2>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name (Optional)</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe"
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title (Optional)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Work Mode</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Job Description Text *</label>
              <textarea
                rows="10"
                required
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder="Paste the full job description text here (requirements, responsibilities, skills, qualifications)..."
                className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 custom-scrollbar"
              />
            </div>

            <button
              type="submit"
              disabled={analyzing}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Analyze & Calculate Match Score</span>
            </button>
          </form>
        </div>

        {/* Right Output: Match Score Gauge & Skill Breakdown */}
        <div className="space-y-6">
          {!result ? (
            <div className="glass-card p-12 rounded-3xl text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-indigo-950/60 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-xl">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-white">Analysis Ready</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Paste any job description on the left to extract skills and evaluate your candidate match score.
              </p>
            </div>
          ) : (
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                    Analysis Output
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">Match Factor Summary</h3>
                </div>
                <ScoreGauge score={result.overall_match_score} size="md" />
              </div>

              {/* 5 Factors Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { label: 'Skills', val: `${result.factor_breakdown?.technical_skills_score}/50` },
                  { label: 'Experience', val: `${result.factor_breakdown?.experience_score}/20` },
                  { label: 'Education', val: `${result.factor_breakdown?.education_score}/10` },
                  { label: 'Responsibilities', val: `${result.factor_breakdown?.responsibilities_score}/10` },
                  { label: 'Location', val: `${result.factor_breakdown?.location_score}/10` },
                ].map((f, i) => (
                  <div key={i} className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] font-semibold text-slate-400 block">{f.label}</span>
                    <span className="text-xs font-bold text-indigo-300 font-mono block mt-0.5">{f.val}</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
                <span className="font-bold">Recommendation:</span> {result.recommendation}
              </div>

              {/* Skills Lists */}
              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Matching Skills ({result.matching_skills?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matching_skills?.map((sk, idx) => (
                      <SkillBadge key={idx} name={sk} isMatch={true} />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Missing Skills ({result.missing_skills?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing_skills?.map((sk, idx) => (
                      <SkillBadge key={idx} name={sk} isMatch={false} />
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveJobFromAnalyzer}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-colors"
              >
                <Plus className="w-4 h-4 text-indigo-400" />
                Save Position to Jobs Board
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobAnalyzerPage;
