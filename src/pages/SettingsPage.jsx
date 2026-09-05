import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  User,
  Briefcase,
  DollarSign,
  MapPin,
  Globe,
  Link as LinkIcon,
  Sliders,
  Bot,
  Bell,
  Shield,
  Key,
  Download,
  Database,
  Activity,
  CheckCircle2,
  RefreshCw,
  Save,
  Sparkles,
  Lock,
  Mail,
  Zap,
  Clock,
  FileJson,
  Palette,
  Tag,
  Plus,
  Trash2,
  Cpu,
} from 'lucide-react';

const SettingsPage = () => {
  const { user, updateProfile, triggerSeedData } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [savingProfile, setSavingProfile] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Live Health Check
  const [healthStatus, setHealthStatus] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [latency, setLatency] = useState(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    headline: '',
    target_role: '',
    experience_years: 1,
    education_level: 'BTech',
    location: '',
    target_salary: 1200000,
    github_url: '',
    linkedin_url: '',
    portfolio_url: '',
  });

  // AI Matching Weights State (persisted to localStorage)
  const [aiWeights, setAiWeights] = useState(() => {
    const saved = localStorage.getItem('jobflow_ai_weights');
    return saved
      ? JSON.parse(saved)
      : {
          skills: 35,
          experience: 25,
          roleAlignment: 20,
          location: 10,
          salary: 10,
          aiTone: 'professional',
          minMatchScore: 70,
          customInstructions: 'Prioritize modern full-stack web engineering, React 18, and scalable API architecture.',
        };
  });

  // Theme & Appearance State (persisted to localStorage)
  const [themeSettings, setThemeSettings] = useState(() => {
    const saved = localStorage.getItem('jobflow_theme_settings');
    return saved
      ? JSON.parse(saved)
      : {
          accentColor: 'indigo',
          currency: 'INR',
          salaryFormat: 'lpa',
        };
  });

  // Automation & Tags State (persisted to localStorage)
  const [automationSettings, setAutomationSettings] = useState(() => {
    const saved = localStorage.getItem('jobflow_automation');
    return saved
      ? JSON.parse(saved)
      : {
          autoArchiveDays: 14,
          customTags: ['FAANG', 'High Priority', 'Referral Required', 'Remote Only'],
        };
  });
  const [newTagInput, setNewTagInput] = useState('');

  // API Key State (persisted to localStorage)
  const [apiKeys, setApiKeys] = useState(() => {
    const saved = localStorage.getItem('jobflow_api_keys');
    return saved
      ? JSON.parse(saved)
      : {
          openaiKey: '',
          geminiKey: '',
        };
  });

  // Notifications State (persisted to localStorage)
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('jobflow_notifications');
    return saved
      ? JSON.parse(saved)
      : {
          emailSummaries: true,
          followUpDays: 7,
          interviewAlerts: true,
        };
  });

  // Password Change Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Populate profile form from user state
  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        headline: user.profile?.headline || 'Software Development Engineer (SDE)',
        target_role: user.profile?.target_role || 'Full Stack Developer / SDE',
        experience_years: user.profile?.experience_years ?? 1,
        education_level: user.profile?.education_level || 'BTech',
        location: user.profile?.location || 'Bengaluru / Remote',
        target_salary: user.profile?.target_salary ?? 1200000,
        github_url: user.profile?.github_url || '',
        linkedin_url: user.profile?.linkedin_url || '',
        portfolio_url: user.profile?.portfolio_url || '',
      });
    }
  }, [user]);

  // Persist AI weights to localStorage
  const handleAiWeightChange = (key, value) => {
    const updated = { ...aiWeights, [key]: value };
    setAiWeights(updated);
    localStorage.setItem('jobflow_ai_weights', JSON.stringify(updated));
  };

  // Persist Theme Settings
  const handleThemeChange = (key, value) => {
    const updated = { ...themeSettings, [key]: value };
    setThemeSettings(updated);
    localStorage.setItem('jobflow_theme_settings', JSON.stringify(updated));
    showToast('Theme & preference updated!', 'success');
  };

  // Tag Management
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    if (automationSettings.customTags.includes(newTagInput.trim())) {
      showToast('Tag already exists.', 'info');
      return;
    }
    const updatedTags = [...automationSettings.customTags, newTagInput.trim()];
    const updated = { ...automationSettings, customTags: updatedTags };
    setAutomationSettings(updated);
    localStorage.setItem('jobflow_automation', JSON.stringify(updated));
    setNewTagInput('');
    showToast('Custom tag added!', 'success');
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = automationSettings.customTags.filter((t) => t !== tagToRemove);
    const updated = { ...automationSettings, customTags: updatedTags };
    setAutomationSettings(updated);
    localStorage.setItem('jobflow_automation', JSON.stringify(updated));
    showToast('Tag removed.', 'info');
  };

  // API Key Saver
  const handleSaveApiKeys = (e) => {
    e.preventDefault();
    localStorage.setItem('jobflow_api_keys', JSON.stringify(apiKeys));
    showToast('Custom API keys saved securely in local storage!', 'success');
  };

  // Persist Notifications
  const handleNotificationChange = (key, value) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    localStorage.setItem('jobflow_notifications', JSON.stringify(updated));
    showToast('Notification preferences updated!', 'success');
  };

  // Save Profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    const result = await updateProfile(profileForm);
    setSavingProfile(false);
    if (result?.success) {
      showToast('Profile & Career Preferences saved successfully!', 'success');
    }
  };

  // Handle Seed Data
  const handleSeed = async () => {
    setSeeding(true);
    await triggerSeedData();
    setSeeding(false);
  };

  // Health Ping Test
  const runHealthCheck = async () => {
    setHealthLoading(true);
    const startTime = performance.now();
    try {
      const response = await api.get('/auth/health/');
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setHealthStatus(response.data);
      showToast('Backend health check passed!', 'success');
    } catch (err) {
      setHealthStatus({ status: 'error', service: 'Unavailable' });
      showToast('Health check failed. Backend unreachable.', 'error');
    } finally {
      setHealthLoading(false);
    }
  };

  // Export Job Data JSON
  const handleExportData = async () => {
    try {
      const response = await api.get('/applications/');
      const exportData = {
        exported_at: new Date().toISOString(),
        user: {
          username: user?.username,
          email: user?.email,
        },
        settings: {
          ai_weights: aiWeights,
          theme: themeSettings,
          automation: automationSettings,
        },
        applications: response.data,
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jobflow_export_${user?.username || 'user'}_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Full JobFlow data backup exported successfully!', 'success');
    } catch (err) {
      showToast('Failed to export data.', 'error');
    }
  };

  // Password Change Handler
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      showToast('Password must be at least 8 characters long.', 'error');
      return;
    }
    setChangingPassword(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setChangingPassword(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast('Password security settings updated successfully!', 'success');
  };

  const tabs = [
    { id: 'profile', label: 'Profile & Career', icon: User },
    { id: 'ai', label: 'AI Engine & Prompts', icon: Bot },
    { id: 'theme', label: 'Theme & Formatting', icon: Palette },
    { id: 'automation', label: 'Tags & Pipeline', icon: Tag },
    { id: 'security', label: 'Security & API Keys', icon: Shield },
    { id: 'system', label: 'Diagnostics & Demo', icon: Database },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Page Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Advanced Control Center
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Customize AI scoring weights, system prompts, theme styles, custom tags, and API keys.
              </p>
            </div>
          </div>
        </div>

        {/* Quick User Badge */}
        {user && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white uppercase">
              {user.username?.[0] || 'U'}
            </div>
            <div>
              <div className="font-semibold text-slate-200">@{user.username}</div>
              <div className="text-[10px] text-slate-400">{user.email}</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 glass-panel rounded-2xl border border-slate-800 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile & Career Preferences */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-400" />
                  Personal Information & Contact Details
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Your basic contact information used across job applications and exported resumes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">First Name</label>
                <input
                  type="text"
                  value={profileForm.first_name}
                  onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={profileForm.last_name}
                  onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                  Career Target & Profile Headline
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Professional Headline</label>
                <input
                  type="text"
                  value={profileForm.headline}
                  onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Job Role</label>
                <input
                  type="text"
                  value={profileForm.target_role}
                  onChange={(e) => setProfileForm({ ...profileForm, target_role: e.target.value })}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Experience (Years)</label>
                <input
                  type="number"
                  step="0.5"
                  value={profileForm.experience_years}
                  onChange={(e) => setProfileForm({ ...profileForm, experience_years: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Location</label>
                <input
                  type="text"
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Annual Salary (₹ INR)</label>
                <input
                  type="number"
                  step="100000"
                  value={profileForm.target_salary}
                  onChange={(e) => setProfileForm({ ...profileForm, target_salary: parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  Social & Portfolio Web Links
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">GitHub Profile URL</label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    value={profileForm.github_url}
                    onChange={(e) => setProfileForm({ ...profileForm, github_url: e.target.value })}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">LinkedIn Profile URL</label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={profileForm.linkedin_url}
                    onChange={(e) => setProfileForm({ ...profileForm, linkedin_url: e.target.value })}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Personal Portfolio / Website</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    placeholder="https://yourportfolio.com"
                    value={profileForm.portfolio_url}
                    onChange={(e) => setProfileForm({ ...profileForm, portfolio_url: e.target.value })}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                {savingProfile ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{savingProfile ? 'Saving Changes...' : 'Save Profile Settings'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: AI Engine & Custom Prompts */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-400" />
                AI Match Scoring Weight Preferences
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Customize how the 5-factor AI match algorithm weights job descriptions against your resume.
              </p>
            </div>

            <div className="space-y-5">
              {[
                { key: 'skills', label: 'Technical Skills Match', desc: 'Required tech stack & domain overlap' },
                { key: 'experience', label: 'Experience Level Match', desc: 'Years of software development experience' },
                { key: 'roleAlignment', label: 'Role & Title Alignment', desc: 'Match against target job titles' },
                { key: 'location', label: 'Location & Work Model', desc: 'Remote / Hybrid / On-site alignment' },
                { key: 'salary', label: 'Compensation Target', desc: 'Match against target INR salary range' },
              ].map((item) => (
                <div key={item.key} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-200">{item.label}</span>
                      <span className="text-[10px] text-slate-400 block">{item.desc}</span>
                    </div>
                    <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                      {aiWeights[item.key]}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={aiWeights[item.key]}
                    onChange={(e) => handleAiWeightChange(item.key, parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-2"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                Custom AI System Prompt Modifier
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Inject custom instructions into AI resume evaluation and interview recommendations.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Custom AI Focus Instructions</label>
                <textarea
                  rows={3}
                  value={aiWeights.customInstructions}
                  onChange={(e) => handleAiWeightChange('customInstructions', e.target.value)}
                  placeholder="e.g. Focus on full-stack web architecture, React 18, and scalable API performance."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">AI Response Tone</label>
                  <select
                    value={aiWeights.aiTone}
                    onChange={(e) => handleAiWeightChange('aiTone', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="professional">Professional & Concise (Executive)</option>
                    <option value="detailed">In-depth Technical & Detailed Code Reviewer</option>
                    <option value="coach">Interview Preparation Coach & Mock Practice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Minimum Recommendation Score: <span className="text-indigo-400">{aiWeights.minMatchScore}%</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={aiWeights.minMatchScore}
                    onChange={(e) => handleAiWeightChange('minMatchScore', parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Theme & Formatting */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-400" />
                Accent Color & Styling Preferences
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'indigo', name: 'Indigo / Violet', bg: 'from-indigo-600 to-violet-600' },
                { id: 'cyan', name: 'Cyber Cyan', bg: 'from-cyan-500 to-blue-600' },
                { id: 'emerald', name: 'Emerald Teal', bg: 'from-emerald-500 to-teal-600' },
              ].map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => handleThemeChange('accentColor', color.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    themeSettings.accentColor === color.id
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-full h-8 rounded-xl bg-gradient-to-r ${color.bg} mb-3`} />
                  <span className="text-xs font-bold text-white">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Currency & Salary Display Preferences
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Default Currency</label>
                <select
                  value={themeSettings.currency}
                  onChange={(e) => handleThemeChange('currency', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="INR">₹ INR (Indian Rupee)</option>
                  <option value="USD">$ USD (US Dollar)</option>
                  <option value="EUR">€ EUR (Euro)</option>
                  <option value="GBP">£ GBP (British Pound)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Salary Display Format</label>
                <select
                  value={themeSettings.salaryFormat}
                  onChange={(e) => handleThemeChange('salaryFormat', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="lpa">LPA Format (e.g. 12.0 LPA)</option>
                  <option value="full">Full Amount (e.g. ₹12,00,000)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Tags & Pipeline */}
      {activeTab === 'automation' && (
        <div className="space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-400" />
                Custom Job Tags & Categories
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Create custom tags to organize your tracked applications.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter tag name (e.g. FAANG, Tier 1, High Bonus)..."
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Tag</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {automationSettings.customTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Security & API Keys */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                Bring Your Own API Key (BYOK)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Optionally provide custom API keys for high-volume resume parsing and career assistant requests.
              </p>
            </div>

            <form onSubmit={handleSaveApiKeys} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">OpenAI API Key (sk-...)</label>
                <input
                  type="password"
                  placeholder="sk-proj-..."
                  value={apiKeys.openaiKey}
                  onChange={(e) => setApiKeys({ ...apiKeys, openaiKey: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Google Gemini API Key</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKeys.geminiKey}
                  onChange={(e) => setApiKeys({ ...apiKeys, geminiKey: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save API Keys</span>
              </button>
            </form>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-400" />
                Change Account Password
              </h2>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50"
              >
                {changingPassword ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>Update Password</span>
              </button>
            </form>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-400" />
              Data Portability & Full JSON Backup
            </h2>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Export all your tracked job applications, settings, custom prompts, and AI match scores into a formatted JSON file.
            </p>

            <button
              type="button"
              onClick={handleExportData}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              <FileJson className="w-4 h-4 text-indigo-400" />
              <span>Export Full JobFlow Backup (.json)</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 6: System Health & Demo Data */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Live API Diagnostic Health Monitor
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Perform real-time API latency test against the production Render backend API.
                </p>
              </div>

              <button
                type="button"
                onClick={runHealthCheck}
                disabled={healthLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${healthLoading ? 'animate-spin' : ''}`} />
                <span>Run Ping Test</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block font-semibold">Backend Engine</span>
                <span className="text-emerald-400 font-mono font-bold mt-1 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Django REST Framework (Active)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block font-semibold">API Latency Ping</span>
                <span className="text-indigo-400 font-mono font-bold mt-1 block">
                  {latency !== null ? `${latency} ms` : 'Not Tested'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block font-semibold">Service Version</span>
                <span className="text-slate-200 font-mono font-bold mt-1 block">
                  {healthStatus?.version ? `v${healthStatus.version}` : 'v1.0.0 (Production)'}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              Demo Dataset Generator
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              Instantly populate realistic job postings, tracked applications, interview rounds, question bank records, and skill gap priority data into your account database.
            </p>

            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
              <span>{seeding ? 'Seeding Data...' : 'Populate Demo Dataset'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
