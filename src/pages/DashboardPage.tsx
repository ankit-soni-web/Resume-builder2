import React, { useState } from 'react';
import { Resume, JobApplication, TemplateId } from '../types/resume';
import { TEMPLATES } from '../data/templates';
import { createEmptyResume, SAMPLE_RESUMES } from '../data/sampleResumes';
import { analyzeResumeForATS } from '../services/atsChecker';
import {
  saveResume, duplicateResume, deleteResume, exportResumeAsJson, importResumeFromJson,
  getJobApplications, saveJobApplication, deleteJobApplication
} from '../services/resumeStorage';
import {
  Plus, Search, Edit3, Copy, Trash2, Download, FileText, Calendar,
  ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Briefcase,
  FileJson, Upload, Clock, Sparkles, Filter, ExternalLink
} from 'lucide-react';

interface Props {
  resumes: Resume[];
  onSelectResume: (resumeId: string) => void;
  onRefreshResumes: () => void;
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<Props> = ({
  resumes,
  onSelectResume,
  onRefreshResumes,
  onNavigate,
}) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'updated' | 'name' | 'created'>('updated');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [newTitleValue, setNewTitleValue] = useState('');

  // Job applications tracker state
  const [activeTab, setActiveTab] = useState<'resumes' | 'tracker'>('resumes');
  const [applications, setApplications] = useState<JobApplication[]>(getJobApplications());
  const [newAppCompany, setNewAppCompany] = useState('');
  const [newAppRole, setNewAppRole] = useState('');
  const [newAppStatus, setNewAppStatus] = useState<JobApplication['status']>('Applied');

  // Filter & sort resumes
  const filteredResumes = resumes
    .filter((r) => r.title.toLowerCase().includes(search.toLowerCase()) || r.personalInfo.fullName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const handleCreateNew = (templateId: TemplateId = 'classic') => {
    const blank = createEmptyResume(templateId, 'New Professional Resume');
    saveResume(blank);
    onRefreshResumes();
    setIsCreateModalOpen(false);
    onSelectResume(blank.id);
    onNavigate('editor');
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateResume(id);
    onRefreshResumes();
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteResume(deleteTargetId);
      setDeleteTargetId(null);
      onRefreshResumes();
    }
  };

  const handleSaveRename = (resume: Resume) => {
    if (newTitleValue.trim()) {
      saveResume({
        ...resume,
        title: newTitleValue.trim(),
      });
      onRefreshResumes();
    }
    setEditingTitleId(null);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const imported = importResumeFromJson(text);
        onRefreshResumes();
        onSelectResume(imported.id);
        onNavigate('editor');
      } catch (err) {
        alert('Could not import file: Invalid resume format.');
      }
    };
    reader.readAsText(file);
  };

  const handleAddApplication = () => {
    if (!newAppCompany || !newAppRole) return;
    const newApp: JobApplication = {
      id: 'app-' + Math.random().toString(36).substring(2, 9),
      resumeId: resumes[0]?.id || '',
      resumeTitle: resumes[0]?.title || 'Default Resume',
      company: newAppCompany,
      role: newAppRole,
      status: newAppStatus,
      dateApplied: new Date().toISOString().split('T')[0],
    };
    saveJobApplication(newApp);
    setApplications(getJobApplications());
    setNewAppCompany('');
    setNewAppRole('');
  };

  const handleDeleteApp = (id: string) => {
    deleteJobApplication(id);
    setApplications(getJobApplications());
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-800 pb-20">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
                Workspace Dashboard
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Welcome back to ResumeCraft
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Manage your tailored resumes, track application submissions, and monitor ATS metrics.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON</span>
                <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
              </label>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#14213D] hover:bg-blue-600 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Resume</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-500 block">Total Resumes</span>
              <span className="text-2xl font-black text-slate-900">{resumes.length}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-500 block">Available Templates</span>
              <span className="text-2xl font-black text-blue-600">8 Styles</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-500 block">Job Applications</span>
              <span className="text-2xl font-black text-teal-600">{applications.length}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-500 block">Data Persistence</span>
              <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md inline-block mt-1">
                Guest Autosave On
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Resumes vs Tracker */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('resumes')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'resumes' ? 'bg-[#14213D] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            My Resumes ({resumes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tracker')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tracker' ? 'bg-[#14213D] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Application Tracker ({applications.length})
          </button>
        </div>

        {activeTab === 'resumes' ? (
          <>
            {/* Search and Sort Toolbar */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search resumes by title or name..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none"
                >
                  <option value="updated">Last Modified</option>
                  <option value="name">Resume Name</option>
                  <option value="created">Created Date</option>
                </select>
              </div>
            </div>

            {/* Resume Cards Grid */}
            {filteredResumes.length === 0 ? (
              <div className="mt-8 p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs max-w-lg mx-auto">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-800">No resumes found</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  {search ? 'Try clearing your search keyword.' : 'Create your first resume to get started.'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 cursor-pointer"
                >
                  Create New Resume
                </button>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredResumes.map((resume) => {
                  const ats = analyzeResumeForATS(resume);
                  const isEditingThisTitle = editingTitleId === resume.id;
                  const templateMatch = TEMPLATES.find(t => t.id === resume.design.templateId) || TEMPLATES[0];

                  return (
                    <div
                      key={resume.id}
                      onClick={() => {
                        onSelectResume(resume.id);
                        onNavigate('editor');
                      }}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group relative"
                    >
                      <div>
                        {/* Card Top Badges */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: templateMatch.accentColor }}></span>
                            {templateMatch.name}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            ats.overallScore >= 80 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            ATS {ats.overallScore}/100
                          </span>
                        </div>

                        {/* Title inline rename */}
                        {isEditingThisTitle ? (
                          <div className="flex items-center gap-1 mb-1" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={newTitleValue}
                              onChange={(e) => setNewTitleValue(e.target.value)}
                              className="px-2 py-1 text-xs border border-blue-500 rounded flex-1 focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveRename(resume)}
                              className="px-2 py-1 text-[11px] font-bold text-white bg-blue-600 rounded"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                              {resume.title}
                            </h3>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTitleId(resume.id);
                                setNewTitleValue(resume.title);
                              }}
                              className="text-slate-400 hover:text-slate-600 p-0.5"
                              title="Rename resume"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <p className="text-xs text-slate-600 font-medium">
                          {resume.personalInfo.fullName || 'Candidate'} {resume.personalInfo.jobTitle ? `• ${resume.personalInfo.jobTitle}` : ''}
                        </p>

                        <div className="mt-3 py-2 px-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-500 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Updated {new Date(resume.updatedAt).toLocaleDateString()}
                          </span>
                          <span>{resume.experience.length} roles • {resume.skills.length} skills</span>
                        </div>
                      </div>

                      {/* Bottom action buttons */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectResume(resume.id);
                            onNavigate('editor');
                          }}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Open Editor</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              exportResumeAsJson(resume);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100"
                            title="Export Backup JSON"
                          >
                            <FileJson className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDuplicate(resume.id, e)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100"
                            title="Duplicate Resume"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTargetId(resume.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"
                            title="Delete Resume"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* JOB APPLICATIONS TRACKER TAB */
          <div className="mt-6 space-y-6">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                Add Job Application
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newAppCompany}
                  onChange={(e) => setNewAppCompany(e.target.value)}
                  placeholder="Company Name (e.g. Stripe, Apple)"
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  value={newAppRole}
                  onChange={(e) => setNewAppRole(e.target.value)}
                  placeholder="Role (e.g. Senior Frontend Engineer)"
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <select
                  value={newAppStatus}
                  onChange={(e) => setNewAppStatus(e.target.value as any)}
                  className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Draft">Draft</option>
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offered">Offered</option>
                  <option value="Archived">Archived</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddApplication}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Track Job
                </button>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="p-3.5">Company</th>
                    <th className="p-3.5">Target Role</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Date Added</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70">
                      <td className="p-3.5 font-bold text-slate-900">{app.company}</td>
                      <td className="p-3.5">{app.role}</td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          app.status === 'Interviewing'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : (app.status === 'Offered' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200')
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">{app.dateApplied}</td>
                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteApp(app.id)}
                          className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create New Resume Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 border border-slate-200 space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-base font-bold text-slate-900">Create New Resume</h3>
              <p className="text-xs text-slate-500">Start from a clean slate or choose a template archetype.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {TEMPLATES.slice(0, 6).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleCreateNew(t.id)}
                  className="p-3 text-left rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.accentColor }}></span>
                    <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">{t.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">{t.tagline}</span>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleCreateNew('classic')}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                + Start with Blank Classic
              </button>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 border border-slate-200 space-y-3 animate-fadeIn">
            <h3 className="text-sm font-bold text-slate-900">Delete this resume?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete this resume? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
              >
                Delete Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
