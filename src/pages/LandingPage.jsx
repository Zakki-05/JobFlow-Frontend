import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Zap,
  GitPullRequest,
  Target,
  FileText,
  BarChart3,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Award,
  Bot,
  BrainCircuit,
  Search,
  Compass,
  LayoutDashboard,
  Layers
} from 'lucide-react';

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How does JobFlow AI analyze my resume and jobs?',
      a: 'JobFlow connects securely to advanced Gemini AI models to parse resume text, extract technical skill sets, calculate dynamic ATS readability scores, and match candidate credentials directly against job requirements.'
    },
    {
      q: 'Is my personal data and AI key secure?',
      a: 'Absolutely. All AI communications are processed strictly server-side using secure backend environment variables. Your API keys, resumes, and private job tracking data are never exposed.'
    },
    {
      q: 'What application tracking features are included?',
      a: 'You get a complete visual Kanban pipeline (Applied → Shortlisted → Interview → Offer → Rejected), status history logs, custom application tracking, interview scheduling, and response conversion metrics.'
    },
    {
      q: 'How does the AI Job Matching engine work?',
      a: 'The engine compares candidate technical skills, years of experience, work mode preferences, and degree level against job requirements to generate a transparent percentage match, matching skills, missing skills, and actionable advice.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="JobFlow AI Logo"
              className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-indigo-500/30"
            />
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                JobFlow AI
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">How It Works</a>
            <a href="#ai-features" className="hover:text-indigo-400 transition-colors">AI Features</a>
            <a href="#tracking" className="hover:text-indigo-400 transition-colors">Application Tracker</a>
            <a href="#faq" className="hover:text-indigo-400 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-semibold text-indigo-300 border border-indigo-500/30 mb-8 shadow-inner">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>AI-Powered Job Search & Application Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-none">
            Find Better Jobs. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">
              Build Your Career Smarter.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            JobFlow AI helps job seekers discover tailored opportunities, track application pipelines, analyze resume ATS scores, and leverage dynamic AI to accelerate their career growth.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/jobs"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Find Jobs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#ai-features"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-semibold glass-card hover:bg-slate-800/80 text-slate-200 transition-all text-center flex items-center justify-center gap-2 border border-slate-700/80"
            >
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              <span>Explore AI Features</span>
            </a>
          </div>

          {/* Social Proof Pills */}
          <div className="mt-14 flex flex-wrap justify-center items-center gap-8 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Real Backend Gemini AI</span>
            <span className="flex items-center gap-2"><Award className="w-4 h-4 text-indigo-400" /> Automated ATS Resume Scoring</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-400" /> Kanban Application Pipeline</span>
          </div>
        </div>
      </section>

      {/* Interactive Platform Preview */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto glass-panel rounded-3xl border border-slate-800 p-4 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6 px-2">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-rose-500/80" />
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80" />
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">jobflow.app/dashboard</span>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Production Suite
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-4 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-400 font-medium">Applications Tracked</p>
              <p className="text-3xl font-black text-white mt-1">42</p>
              <p className="text-[11px] text-emerald-400 mt-1 font-semibold">↑ 12% this week</p>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-400 font-medium">Saved Jobs</p>
              <p className="text-3xl font-black text-indigo-400 mt-1">18</p>
              <p className="text-[11px] text-indigo-300 mt-1 font-semibold">Ready to apply</p>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-400 font-medium">Interviews Scheduled</p>
              <p className="text-3xl font-black text-amber-400 mt-1">5</p>
              <p className="text-[11px] text-amber-300 mt-1 font-semibold">Active rounds</p>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-400 font-medium">Offers Received</p>
              <p className="text-3xl font-black text-emerald-400 mt-1">2</p>
              <p className="text-[11px] text-emerald-300 mt-1 font-semibold">Accepted role</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">AI Career Assistant Active</h4>
                <p className="text-xs text-slate-400">Ask questions, generate custom summaries, or generate interview questions instantly.</p>
              </div>
            </div>
            <Link
              to="/jobs"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shrink-0"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* How JobFlow Works */}
      <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How JobFlow Works</h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            A streamlined 4-step workflow that transforms your job search from overwhelming to systematic.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Upload Resume & Profile',
              desc: 'Upload your CV (PDF/Docx). Backend AI parses your technical skills, experience, and education profile.'
            },
            {
              step: '02',
              title: 'Discover & Match Jobs',
              desc: 'Explore curated job postings with transparent AI match scores, skill gap indicators, and experience benchmarks.'
            },
            {
              step: '03',
              title: 'Track Pipeline Kanban',
              desc: 'Manage application stages from Applied to Interview and Offer with history tracking and custom notes.'
            },
            {
              step: '04',
              title: 'Prepare with AI Assistant',
              desc: 'Generate tailored interview questions, practice mock technical scenarios, and optimize your resume summary.'
            }
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-3xl border border-slate-800 relative group hover:border-indigo-500/40 transition-all">
              <span className="text-4xl font-black text-indigo-500/20 font-mono group-hover:text-indigo-500/40 transition-colors">
                {item.step}
              </span>
              <h3 className="text-base font-bold text-white mt-3 mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Features Showcase */}
      <section id="ai-features" className="py-20 px-6 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-3">
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
              <span>Real Intelligence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">AI-Powered Career Intelligence</h2>
            <p className="text-slate-400 text-sm mt-3">
              Driven by backend AI algorithms. No fake scores or hardcoded responses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Resume Analyzer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extracts key skills, evaluates ATS layout compatibility, highlights strengths & weaknesses, and suggests actionable fixes to boost shortlist rates.
              </p>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300 font-semibold">
                  <span>ATS Readability Score</span>
                  <span className="text-emerald-400 font-bold">88 / 100</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[88%]" />
                </div>
                <p className="text-[11px] text-slate-400 pt-1">✓ Detected: React, Node.js, Python, PostgreSQL, Docker</p>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Job Matching Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates dynamic match percentages between your profile and target job descriptions, identifying matching skills and critical gaps.
              </p>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300 font-semibold">
                  <span>Job Fit Match</span>
                  <span className="text-indigo-400 font-bold">92% Match</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 text-[10px] font-semibold">✓ React</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 text-[10px] font-semibold">✓ TypeScript</span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-950/80 text-rose-300 text-[10px] font-semibold">✗ AWS EC2</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Smart Job Recommendations</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Recommends relevant roles based on your tech stack, saved preference history, and career growth aspirations.
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Career Assistant Chat</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interactive assistant available 24/7 to write resume summaries, draft interview follow-up emails, and generate company-specific question banks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Tracking Section */}
      <section id="tracking" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800 text-xs font-semibold">
              <GitPullRequest className="w-3.5 h-3.5 text-indigo-400" />
              <span>Pipeline Management</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Never lose track of an application again.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Ditch messy spreadsheets. JobFlow provides a dedicated Kanban board with status stages (Applied, Shortlisted, Interview, Offer, Rejected), interview date tracking, status history logs, and custom notes.
            </p>
            <div className="space-y-3 pt-2">
              {['Drag-and-drop or status selector pipeline', 'Interview round scheduler & notes log', 'Response conversion analytics & timeline'].map((point, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-200">Application Stages</span>
              <span className="text-[11px] text-indigo-400 font-mono">Live Kanban</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-2xl bg-sky-950/40 border border-sky-500/30">
                <span className="block font-bold text-sky-400">Applied</span>
                <span className="text-slate-400 text-[10px]">14 roles</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30">
                <span className="block font-bold text-amber-400">Interview</span>
                <span className="text-slate-400 text-[10px]">4 scheduled</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                <span className="block font-bold text-emerald-400">Offer</span>
                <span className="text-slate-400 text-[10px]">2 received</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-white text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card rounded-2xl overflow-hidden border border-slate-800">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-sm font-semibold text-slate-200 hover:text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 text-xs text-slate-400 border-t border-slate-800/60 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-indigo-500/30 text-center relative overflow-hidden bg-gradient-to-r from-indigo-950/60 via-slate-900 to-violet-950/60">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Ready to Upgrade Your Job Search?</h2>
          <p className="text-slate-300 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Join developers and professionals using JobFlow AI to land better roles faster.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-500/30 transition-all flex items-center gap-2"
            >
              <span>Get Started Free Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 px-6 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="JobFlow Logo" className="w-6 h-6 rounded-lg object-cover" />
            <span className="font-bold text-slate-300">JobFlow AI Platform</span>
          </div>

          <p>© 2026 JobFlow AI SaaS. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link to="/jobs" className="hover:text-white transition-colors">Find Jobs</Link>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

