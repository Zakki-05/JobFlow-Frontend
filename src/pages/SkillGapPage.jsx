import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SkillBadge from '../components/SkillBadge';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';
import { Target, Award, ArrowUpRight, CheckCircle, AlertTriangle } from 'lucide-react';

const SkillGapPage = () => {
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchGapAnalysis = async () => {
    setLoading(true);
    try {
      const res = await api.get('/skills/gap-analysis/');
      setData(res.data);
    } catch (err) {
      showToast('Failed to load skill gap analytics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGapAnalysis();
  }, []);

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            Data-Driven Candidate Roadmap
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Skill Gap Intelligence</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated evaluation comparing stored user skills against required skills across all saved job postings.
          </p>
        </div>

        <div className="glass-card px-4 py-3 rounded-2xl text-center border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Jobs Evaluated</span>
          <span className="text-2xl font-black text-indigo-400 font-mono mt-0.5 block">{data?.total_saved_jobs || 0}</span>
        </div>
      </div>

      {/* Priority Skill Gap Roadmap List */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          Priority Missing Skill Roadmap (Ranked by Market Demand)
        </h2>

        {!data?.priority_roadmap || data.priority_roadmap.length === 0 ? (
          <EmptyState
            title="No skill gaps detected!"
            description="Your current skills cover all required skills in your saved jobs, or add more job postings."
          />
        ) : (
          <div className="space-y-3">
            {data.priority_roadmap.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-amber-950/80 border border-amber-500/30 font-mono text-xs font-bold text-amber-300 flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white">{item.skill_name}</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Required in <span className="font-bold text-amber-300 font-mono">{item.job_count} saved jobs</span> ({item.demand_percentage}% demand)
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-48 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, item.demand_percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Strong Skills Covered Grid */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          Strong Skills (Already Possessed & Requested)
        </h2>

        {!data?.strong_skills || data.strong_skills.length === 0 ? (
          <p className="text-xs text-slate-500">Add technical skills to your portfolio to view strong match overlaps.</p>
        ) : (
          <div className="flex flex-wrap gap-2 pt-2">
            {data.strong_skills.map((item, idx) => (
              <SkillBadge key={idx} name={item.skill_name} isMatch={true} count={item.job_count} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillGapPage;
