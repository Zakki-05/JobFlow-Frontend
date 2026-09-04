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
  Award
} from 'lucide-react';

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'What makes JobFlow different from spreadsheet job trackers?',
      a: 'JobFlow is an intelligent platform with an automated job description skill extractor, transparent 5-factor match score calculator, application pipeline status tracking, interview question bank, and data-driven skill gap roadmap.'
    },
    {
      q: 'How is the JobMatch Score calculated?',
      a: 'We use a 100% transparent rule-based algorithm: Technical Skills (50%), Experience Alignment (20%), Education Alignment (10%), Responsibilities Alignment (10%), and Location & Work Mode Alignment (10%). No fake AI promises.'
    },
    {
      q: 'Can I track interviews and interview questions?',
      a: 'Yes! JobFlow includes a dedicated interview scheduler and an Interview Question Bank where you can log questions asked by specific companies, code snippet answers, and difficulty levels.'
    },
    {
      q: 'Is JobFlow free for job seekers?',
      a: 'JobFlow is built for students, fresh graduates, and software engineers to manage their entire career search process.'
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
            <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">How It Works</a>
            <a href="#preview" className="hover:text-indigo-400 transition-colors">Platform Preview</a>
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
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-xs font-semibold text-indigo-300 border border-indigo-500/30 mb-8">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>India's #1 Job Intelligence Platform for Freshers & Engineering Graduates</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Land Your First Tech Job. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">
              Campus & Off-Campus Tracker.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Built specifically for B.Tech, B.E., BCA, and MCA fresh graduates. Track applications across Naukri, Instahyre & Unstop, analyze skill match scores, upload your CV, and practice top Indian technical interview questions.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Start Fresher Placement Search</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-semibold glass-card hover:bg-slate-800/80 text-slate-300 transition-all text-center"
            >
              Explore Features
            </a>
          </div>

          {/* Social Proof Pills */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> B.Tech, BCA, MCA & M.Tech Ready</span>
            <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-indigo-400" /> Naukri, Instahyre & Unstop Integrated</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-violet-400" /> Swiggy, Razorpay & Flipkart Question Bank</span>
          </div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section id="preview" className="py-12 px-6">
        <div className="max-w-6xl mx-auto glass-panel rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6 px-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">jobflow.app/dashboard</span>
            </div>
            <span className="text-xs font-mono text-indigo-400 font-semibold">Live System Metric</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="glass-card p-4 rounded-2xl">
              <p className="text-xs text-slate-400 font-medium">Total Applications</p>
              <p className="text-2xl font-black text-white mt-1">127</p>
            </div>
            <div className="glass-card p-4 rounded-2xl">
              <p className="text-xs text-slate-400 font-medium">Interviews Scheduled</p>
              <p className="text-2xl font-black text-amber-400 mt-1">12</p>
            </div>
            <div className="glass-card p-4 rounded-2xl">
              <p className="text-xs text-slate-400 font-medium">Offers Received</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">2</p>
            </div>
            <div className="glass-card p-4 rounded-2xl">
              <p className="text-xs text-slate-400 font-medium">Response Rate</p>
              <p className="text-2xl font-black text-indigo-400 mt-1">13.8%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white">Engineered for Results</h2>
          <p className="text-slate-400 text-sm mt-2">
            Built with modern architecture to give you full clarity over your job hunt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: GitPullRequest,
              title: 'Application Pipeline',
              desc: 'Visual Kanban board tracking applications from Saved to Applied, Technical Interviews, and Offers.'
            },
            {
              icon: Zap,
              title: 'JD Skill Analyzer',
              desc: 'Instantly extract technical skills, experience requirements, and education criteria from raw job text.'
            },
            {
              icon: Target,
              title: '5-Factor Match Engine',
              desc: 'Transparent scoring engine comparing user skills, experience, and degree level against job requirements.'
            },
            {
              icon: FileText,
              title: 'Resume Association',
              desc: 'Link tailored resume versions to applications and measure which resume generates the highest response rate.'
            },
            {
              icon: Briefcase,
              title: 'Interview & Question Bank',
              desc: 'Schedule upcoming rounds and log specific technical questions asked by companies for interview prep.'
            },
            {
              icon: BarChart3,
              title: 'Job Search Analytics',
              desc: 'Real-time velocity metrics, response conversion rates, and priority missing skill roadmaps.'
            }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="glass-card p-6 rounded-2xl hover:border-indigo-500/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-12">How JobFlow Works</h2>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              'Save Job',
              'Analyze Job',
              'Apply',
              'Track',
              'Interview',
              'Get Hired'
            ].map((step, idx) => (
              <div key={idx} className="glass-card p-4 rounded-2xl flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center mb-3">
                  {idx + 1}
                </div>
                <span className="text-xs font-bold text-slate-200">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-white text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-sm font-semibold text-slate-200 hover:text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 text-xs text-slate-400 border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 px-6 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              JF
            </div>
            <span className="font-bold text-slate-300">JobFlow Platform</span>
          </div>

          <p>© 2026 JobFlow SaaS. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="#features" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#features" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
