import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Briefcase,
  GitPullRequest,
  Zap,
  FileText,
  Boxes,
  Target,
  Calendar,
  HelpCircle,
  Clock,
  BarChart3,
  User,
  Settings,
  X,
  Flame
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Suitable Jobs', path: '/suitable-jobs', icon: Compass, badge: 'Live Feed' },
  { name: 'Jobs Board', path: '/jobs', icon: Briefcase },
  { name: 'Application Pipeline', path: '/applications', icon: GitPullRequest },
  { name: 'JD Analyzer', path: '/job-analyzer', icon: Zap, badge: 'Flagship' },
  { name: 'Resume Manager', path: '/resumes', icon: FileText },
  { name: 'My Skills', path: '/skills', icon: Boxes },
  { name: 'Skill Gap Analysis', path: '/skill-gap', icon: Target },
  { name: 'Interviews', path: '/interviews', icon: Calendar },
  { name: 'Question Bank', path: '/questions', icon: HelpCircle },
  { name: 'Follow-Ups', path: '/followups', icon: Clock },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#0f0f1a]/90 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 glass-panel flex flex-col border-r border-[#FF6B35]/10 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#FF6B35]/10">
          <NavLink to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FFB347] flex items-center justify-center shadow-lg shadow-[#FF6B35]/20 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-[#FF6B35] via-[#FFB347] to-[#FF8C6B] bg-clip-text text-transparent">
                JobFlow AI
              </span>
              <span className="block text-[9px] uppercase font-mono tracking-wider text-[#FFB347] font-semibold">
                Jobs Flow Opportunities
              </span>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="lg:hidden text-[#9A8C7D] hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#9A8C7D]">
            Core Platform
          </div>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#FF6B35]/15 text-[#FF6B35] border border-[#FF6B35]/30 shadow-sm shadow-[#FF6B35]/10'
                      : 'text-[#B8A99A] hover:text-[#FFF5EE] hover:bg-[#FF6B35]/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FFB347] text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom User Card */}
        <div className="p-4 border-t border-[#FF6B35]/10 bg-[#0f0f1a]/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FFB347] flex items-center justify-center text-white font-bold text-[10px]">
              PRO
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#FFF5EE] truncate">Commercial SaaS</p>
              <p className="text-[11px] text-[#9A8C7D] truncate">v1.0 Ready</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
