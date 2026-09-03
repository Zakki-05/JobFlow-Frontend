import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import ScoreGauge from '../components/ScoreGauge';
import SkillBadge from '../components/SkillBadge';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import {
  Briefcase,
  GitPullRequest,
  Calendar,
  Award,
  XCircle,
  TrendingUp,
  Clock,
  Target,
  ArrowUpRight,
  Plus
} from 'lucide-react';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [skillGap, setSkillGap] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [anlRes, appRes, intRes, folRes, gapRes] = await Promise.all([
        api.get('/analytics/overview/'),
        api.get('/applications/'),
        api.get('/interviews/?status=SCHEDULED'),
        api.get('/applications/followups/?status=NEEDS_FOLLOWUP'),
        api.get('/skills/gap-analysis/'),
      ]);

      setAnalytics(anlRes.data);
      setRecentApps(appRes.data.results ? appRes.data.results.slice(0, 5) : appRes.data.slice(0, 5));
      setInterviews(intRes.data.results ? intRes.data.results.slice(0, 3) : intRes.data.slice(0, 3));
      setFollowups(folRes.data.results ? folRes.data.results.slice(0, 3) : folRes.data.slice(0, 3));
      setSkillGap(gapRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="kpi" count={6} />
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  const kpis = analytics?.kpis || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            🎓 Fresher & Off-Campus Placement Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Fresher Placement Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track off-campus & campus placement applications, upcoming technical interviews, and skill gap roadmaps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/jobs"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Job</span>
          </Link>
        </div>
      </div>

      {/* Fresher Strategy Tip Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-purple-950/70 border border-indigo-500/30 flex items-start sm:items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 font-bold shrink-0">
          💡
        </div>
        <div className="text-xs text-slate-300">
          <span className="font-bold text-white">Fresher Success Strategy:</span> Aim for 8+ weekly off-campus applications across Naukri, Instahyre & Unstop. Ensure your PDF CV is uploaded in <Link to="/resumes" className="text-indigo-400 hover:underline font-semibold">Resume Manager</Link> to optimize your Match Score above 80%.
        </div>
      </div>

      {/* KPI Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Applications', val: kpis.total_applications || 0, icon: Briefcase, color: 'text-indigo-400' },
          { label: 'Apps This Month', val: kpis.apps_this_month || 0, icon: GitPullRequest, color: 'text-sky-400' },
          { label: 'Interviews', val: kpis.interviews_count || 0, icon: Calendar, color: 'text-amber-400' },
          { label: 'Offers', val: kpis.offers_count || 0, icon: Award, color: 'text-emerald-400' },
          { label: 'Rejections', val: kpis.rejections_count || 0, icon: XCircle, color: 'text-rose-400' },
          { label: 'Response Rate', val: `${kpis.response_rate || 0}%`, icon: TrendingUp, color: 'text-purple-400' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="glass-card p-4 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 truncate">{item.label}</span>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <p className="text-2xl font-black text-white mt-3 font-mono">{item.val}</p>
            </div>
          );
        })}
      </div>

      {/* Pipeline Status Summary Bar */}
      <div className="glass-card p-6 rounded-3xl">
        <h2 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <GitPullRequest className="w-4 h-4 text-indigo-400" />
          Application Pipeline Funnel
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(analytics?.funnel || []).map((stage, idx) => (
            <div key={idx} className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                {stage.stage}
              </span>
              <span className="text-xl font-bold text-slate-100 font-mono mt-1 block">
                {stage.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Applications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                Recent Applications
              </h2>
              <Link to="/applications" className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1">
                View Pipeline <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentApps.length === 0 ? (
              <EmptyState title="No applications tracked yet" description="Add job postings to automatically build your pipeline." />
            ) : (
              <div className="space-y-3">
                {recentApps.map((app) => (
                  <div key={app.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-4 hover:border-indigo-500/30 transition-all">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-100 truncate">{app.job_details?.title}</span>
                        <StatusBadge status={app.status} />
                      </div>
                      <p className="text-xs text-slate-400 mt-1 truncate">
                        {app.job_details?.company} • {app.job_details?.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <ScoreGauge score={app.match_score} size="sm" showLabel={false} />
                      <span className="text-[11px] font-mono text-slate-400">
                        {new Date(app.last_updated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Interviews, Follow-Up Alerts, Skill Gap */}
        <div className="space-y-6">
          {/* Upcoming Interviews */}
          <div className="glass-card p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                Upcoming Interviews
              </h2>
              <Link to="/interviews" className="text-xs font-semibold text-amber-400 hover:underline">
                View All
              </Link>
            </div>

            {interviews.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No scheduled interviews pending.</p>
            ) : (
              <div className="space-y-3">
                {interviews.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs">
                    <div className="flex justify-between font-bold text-amber-200">
                      <span>{item.company_name}</span>
                      <span className="font-mono">{new Date(item.interview_date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-300 mt-1">{item.job_title} ({item.round})</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Follow-Up Alerts */}
          <div className="glass-card p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                Follow-Up Alerts
              </h2>
              <Link to="/followups" className="text-xs font-semibold text-sky-400 hover:underline">
                Manage
              </Link>
            </div>

            {followups.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">All application follow-ups up to date!</p>
            ) : (
              <div className="space-y-2">
                {followups.map((fol) => (
                  <div key={fol.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-slate-200 truncate">{fol.company_name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{fol.notes}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-sky-400 shrink-0">
                      Due: {fol.followup_date}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skill Gap Priority Summary */}
          <div className="glass-card p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                Top Priority Skill Gaps
              </h2>
              <Link to="/skill-gap" className="text-xs font-semibold text-indigo-400 hover:underline">
                Full Roadmap
              </Link>
            </div>

            {!skillGap?.priority_roadmap || skillGap.priority_roadmap.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Save jobs to extract skill gap priorities.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skillGap.priority_roadmap.slice(0, 6).map((sk, i) => (
                  <SkillBadge key={i} name={sk.skill_name} isMatch={false} count={sk.job_count} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
