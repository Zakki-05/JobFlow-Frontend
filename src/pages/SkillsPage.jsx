import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SkillBadge from '../components/SkillBadge';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';
import { Boxes, Plus, Trash2, Code, Layers } from 'lucide-react';

const SkillsPage = () => {
  const { showToast } = useToast();
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [proficiency, setProficiency] = useState('Intermediate');
  const [years, setYears] = useState(1.5);

  const fetchUserSkills = async () => {
    setLoading(true);
    try {
      const res = await api.get('/skills/user/');
      setUserSkills(res.data.results ? res.data.results : res.data);
    } catch (err) {
      showToast('Failed to load user skills.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSkills();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    try {
      await api.post('/skills/user/', {
        skill_name: skillName.trim(),
        category,
        proficiency,
        years_experience: parseFloat(years),
      });
      showToast(`Skill '${skillName}' added!`, 'success');
      setSkillName('');
      fetchUserSkills();
    } catch (err) {
      showToast('Error adding skill.', 'error');
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await api.delete(`/skills/user/${id}/`);
      showToast('Skill removed.', 'info');
      fetchUserSkills();
    } catch (err) {
      showToast('Failed to remove skill.', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Personal Skill Inventory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your technical skills and proficiency levels for automated JobMatch scoring.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form: Add Skill */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            Add New Skill
          </h2>

          <form onSubmit={handleAddSkill} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Name *</label>
              <input
                type="text"
                required
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. React, TypeScript, Docker"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Tools">Tools</option>
                  <option value="SoftSkills">Soft Skills</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Proficiency</label>
                <select
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Years of Experience</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              Add Skill to Portfolio
            </button>
          </form>
        </div>

        {/* Right Grid: Active Skills */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Active Skill Inventory ({userSkills.length})
          </h2>

          {loading ? (
            <LoadingSkeleton count={3} />
          ) : userSkills.length === 0 ? (
            <EmptyState title="No skills added" description="Add technical skills to compute JobMatch scores." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userSkills.map((sk) => (
                <div
                  key={sk.id}
                  className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-bold text-sm text-white">{sk.skill_details?.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                        {sk.proficiency}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {sk.years_experience} yrs
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteSkill(sk.id)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
