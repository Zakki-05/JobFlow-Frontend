import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';
import {
  FileText,
  Plus,
  CheckCircle,
  Trash2,
  Edit,
  UploadCloud,
  FileCheck,
  Download,
  Paperclip,
  Sparkles
} from 'lucide-react';

const ResumeManagerPage = () => {
  const { showToast } = useToast();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingResume, setEditingResume] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    title: 'SDE Full-Stack Resume 2026',
    summary: 'Passionate software engineer with strong full-stack skills.',
    education_data: "B.Tech in Computer Science & Engineering (2022 - 2026)",
    experience_data: "SDE Intern | Built REST APIs in Django & React UI",
    projects_data: "JobFlow SaaS Platform, E-Commerce App",
    skills_summary: "React, JavaScript, Python, Django, MySQL, Git, Tailwind CSS",
    certifications: "AWS Certified Developer Associate",
    is_default: true,
  });

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/resumes/');
      setResumes(res.data.results ? res.data.results : res.data);
    } catch (err) {
      showToast('Failed to load resumes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleEdit = (resume) => {
    setEditingResume(resume);
    setSelectedFile(null);
    setFormData({
      title: resume.title || '',
      summary: resume.summary || '',
      education_data: resume.education_data || '',
      experience_data: resume.experience_data || '',
      projects_data: resume.projects_data || '',
      skills_summary: resume.skills_summary || '',
      certifications: resume.certifications || '',
      is_default: resume.is_default || false,
    });
  };

  const [parsing, setParsing] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setParsing(true);
    showToast(`Parsing CV: ${file.name}...`, 'info');

    try {
      const parsePayload = new FormData();
      parsePayload.append('file', file);

      const res = await api.post('/resumes/parse-file/', parsePayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const parsed = res.data;
      setFormData((prev) => ({
        ...prev,
        title: parsed.title || prev.title,
        summary: parsed.summary || prev.summary,
        skills_summary: parsed.skills_summary || prev.skills_summary,
        education_data: parsed.education_data || prev.education_data,
        experience_data: parsed.experience_data || prev.experience_data,
        projects_data: parsed.projects_data || prev.projects_data,
      }));

      showToast('⚡ CV Auto-Parsed! Resume details filled automatically.', 'success');
    } catch (err) {
      showToast('CV selected. Manual editing enabled.', 'info');
    } finally {
      setParsing(false);
    }
  };

  const resetForm = () => {
    setEditingResume(null);
    setSelectedFile(null);
    setFormData({
      title: 'Fresh Graduate SDE Resume 2026',
      summary: '',
      education_data: 'B.Tech in Computer Science & Engineering (2022 - 2026)',
      experience_data: '',
      projects_data: '',
      skills_summary: 'React, JavaScript, Python, Django, MySQL, Git',
      certifications: '',
      is_default: false,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataPayload = new FormData();
      dataPayload.append('title', formData.title);
      dataPayload.append('summary', formData.summary);
      dataPayload.append('education_data', formData.education_data);
      dataPayload.append('experience_data', formData.experience_data);
      dataPayload.append('projects_data', formData.projects_data);
      dataPayload.append('skills_summary', formData.skills_summary);
      dataPayload.append('certifications', formData.certifications);
      dataPayload.append('is_default', formData.is_default ? 'true' : 'false');

      if (selectedFile) {
        dataPayload.append('file', selectedFile);
        dataPayload.append('file_name', selectedFile.name);
      }

      if (editingResume) {
        await api.put(`/resumes/${editingResume.id}/`, dataPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Resume & CV updated successfully!', 'success');
      } else {
        await api.post('/resumes/', dataPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Resume & CV uploaded and saved!', 'success');
      }

      resetForm();
      await fetchResumes();
    } catch (err) {
      showToast('Failed to save resume.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume profile and attached file?')) return;
    try {
      await api.delete(`/resumes/${id}/`);
      showToast('Resume deleted.', 'info');
      fetchResumes();
    } catch (err) {
      showToast('Failed to delete resume.', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Fresher Friendly Resume Vault
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Resume & CV Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload PDF/DOCX resume files and maintain structured profiles for applications.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingResume(null);
            setSelectedFile(null);
            setFormData({
              title: 'Fresh Graduate SDE Resume 2026',
              summary: '',
              education_data: 'B.Tech in Computer Science & Engineering (2022 - 2026)',
              experience_data: '',
              projects_data: '',
              skills_summary: 'React, JavaScript, Python, Django, MySQL, Git',
              certifications: '',
              is_default: false,
            });
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload / New CV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resumes List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Stored Resumes & CV Files ({resumes.length})
          </h2>
          {loading ? (
            <LoadingSkeleton count={2} />
          ) : resumes.length === 0 ? (
            <EmptyState
              title="No resumes uploaded yet"
              description="Upload your fresher resume PDF or DOCX file to attach to applications."
            />
          ) : (
            resumes.map((res) => (
              <div
                key={res.id}
                className={`glass-card p-5 rounded-3xl border transition-all space-y-3 ${
                  editingResume?.id === res.id ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">{res.title}</h3>
                    <p className="text-[11px] text-indigo-400 font-medium mt-0.5">
                      Used in {res.applications_count || 0} applications
                    </p>
                  </div>
                  {res.is_default && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30 shrink-0">
                      Default
                    </span>
                  )}
                </div>

                {/* Uploaded File Badge */}
                {res.file ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate text-slate-200 font-medium">{res.file_name || 'Resume_CV.pdf'}</span>
                    </div>
                    <a
                      href={res.file}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded-lg hover:bg-slate-800 text-indigo-400 hover:text-indigo-300"
                      title="Download / View Resume PDF"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Paperclip className="w-3 h-3" /> No PDF attached (Text Profile Only)
                  </span>
                )}

                <p className="text-xs text-slate-400 line-clamp-2">{res.summary}</p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                  <button
                    onClick={() => handleEdit(res)}
                    className="flex items-center gap-1 text-indigo-400 hover:underline font-semibold"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit / Replace CV
                  </button>
                  <button
                    onClick={() => handleDelete(res.id)}
                    className="text-rose-400 hover:text-rose-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit / Upload Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="glass-card p-6 sm:p-8 rounded-3xl space-y-5 border border-slate-800">
            <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>{editingResume ? 'Edit Resume / CV Profile' : 'Upload Resume / CV File'}</span>
              <span className="text-xs font-normal text-indigo-400">PDF, DOCX, TXT (Max 5MB)</span>
            </h2>

            {/* Drag & Drop File Upload Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Upload Resume File (Fresher CV)
              </label>
              <div className="relative border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-2xl p-6 text-center bg-slate-900/60 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    {parsing ? (
                      <Sparkles className="w-6 h-6 animate-spin text-amber-400" />
                    ) : (
                      <UploadCloud className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-indigo-300 hover:underline">
                      {parsing ? 'Extracting Resume Text...' : 'Click to upload'}
                    </span>{' '}
                    <span className="text-xs text-slate-400">
                      {parsing ? 'Auto-populating summary, skills, & education' : 'or drag and drop your CV file'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Supports PDF, DOCX, TXT (Auto fills details on upload)</p>

                  {selectedFile && (
                    <div className="mt-3 px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-xs font-bold text-indigo-200 inline-flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-400" />
                      <span>{selectedFile.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Resume Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. SDE Full-Stack Resume 2026"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Professional Summary</label>
              <textarea
                rows="3"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Brief high-impact bio for recruiters..."
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Education Credentials</label>
                <textarea
                  rows="3"
                  value={formData.education_data}
                  onChange={(e) => setFormData({ ...formData, education_data: e.target.value })}
                  placeholder="Degree (B.Tech / BCA), College name, Graduation Year..."
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Work Experience / Internships</label>
                <textarea
                  rows="3"
                  value={formData.experience_data}
                  onChange={(e) => setFormData({ ...formData, experience_data: e.target.value })}
                  placeholder="Internships, SDE trainee roles, achievements..."
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Projects</label>
                <textarea
                  rows="3"
                  value={formData.projects_data}
                  onChange={(e) => setFormData({ ...formData, projects_data: e.target.value })}
                  placeholder="Key capstone project titles & tech stack..."
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Skills Summary</label>
                <textarea
                  rows="3"
                  value={formData.skills_summary}
                  onChange={(e) => setFormData({ ...formData, skills_summary: e.target.value })}
                  placeholder="React, JavaScript, Python, Django, MySQL, Git..."
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0"
              />
              <label htmlFor="is_default" className="text-xs font-semibold text-slate-300">
                Set as default resume for new applications
              </label>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4" />
                {saving ? 'Uploading & Saving...' : 'Save & Upload Resume'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResumeManagerPage;
