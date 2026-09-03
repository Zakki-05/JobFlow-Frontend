import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const JobFormModal = ({ isOpen, onClose, onSuccess, initialJob = null }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: 'Bengaluru',
    job_type: 'Full-time',
    work_mode: 'Remote',
    salary: '₹12 LPA - ₹18 LPA',
    job_url: '',
    description: '',
    required_skills_text: '',
    experience_required: 1.0,
    education: 'B.Tech / B.E.',
    source: 'Naukri.com',
    notes: '',
  });

  useEffect(() => {
    if (initialJob) {
      setFormData({
        title: initialJob.title || '',
        company: initialJob.company || '',
        location: initialJob.location || 'Bengaluru',
        job_type: initialJob.job_type || 'Full-time',
        work_mode: initialJob.work_mode || 'Remote',
        salary: initialJob.salary || '',
        job_url: initialJob.job_url || '',
        description: initialJob.description || '',
        required_skills_text: initialJob.required_skills_text || '',
        experience_required: initialJob.experience_required || 1.0,
        education: initialJob.education || 'B.Tech / B.E.',
        source: initialJob.source || 'Naukri.com',
        notes: initialJob.notes || '',
      });
    } else {
      setFormData({
        title: '',
        company: '',
        location: 'Bengaluru',
        job_type: 'Full-time',
        work_mode: 'Remote',
        salary: '₹12 LPA - ₹18 LPA',
        job_url: '',
        description: '',
        required_skills_text: '',
        experience_required: 1.0,
        education: 'B.Tech / B.E.',
        source: 'Naukri.com',
        notes: '',
      });
    }
  }, [initialJob, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutoExtract = async () => {
    if (!formData.description) {
      showToast('Please paste a job description first.', 'warning');
      return;
    }
    setExtracting(true);
    try {
      const res = await api.post('/jobs/extract-skills/', {
        description: formData.description,
      });
      setFormData((prev) => ({
        ...prev,
        required_skills_text: res.data.extracted_skills_text,
        experience_required: res.data.estimated_experience || prev.experience_required,
      }));
      showToast('Extracted skills from job description!', 'success');
    } catch (err) {
      showToast('Failed to extract skills.', 'error');
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialJob) {
        await api.put(`/jobs/${initialJob.id}/`, formData);
        showToast('Job updated successfully!', 'success');
      } else {
        await api.post('/jobs/', formData);
        showToast('Job added to your board!', 'success');
      }
      onSuccess();
      onClose();
    } catch (err) {
      showToast('Error saving job details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto custom-scrollbar">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              {initialJob ? 'Edit Job Posting' : 'Add New Job Posting'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Save job details to analyze matching score and track applications.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. SDE-1 (Full Stack)"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Razorpay / Swiggy / Flipkart"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Work Mode
              </label>
              <select
                name="work_mode"
                value={formData.work_mode}
                onChange={handleChange}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Job Type
              </label>
              <select
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Salary Estimate
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. ₹12 LPA - ₹18 LPA"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bengaluru / Hyderabad / Remote"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Job URL
              </label>
              <input
                type="url"
                name="job_url"
                value={formData.job_url}
                onChange={handleChange}
                placeholder="https://company.com/jobs/123"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                Job Description
              </label>
              <button
                type="button"
                onClick={handleAutoExtract}
                disabled={extracting}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                {extracting ? 'Extracting...' : 'Auto-Extract Skills'}
              </button>
            </div>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Paste full job description text here..."
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Required Skills (Comma separated)
            </label>
            <input
              type="text"
              name="required_skills_text"
              value={formData.required_skills_text}
              onChange={handleChange}
              placeholder="React, JavaScript, Python, Django, MySQL, Git"
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {initialJob ? 'Update Job' : 'Save Job Posting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFormModal;
