import React, { useState, useEffect } from 'react';
import { Resume, TemplateId } from './types/resume';
import { getStoredResumes, saveResume, getActiveResumeId, setActiveResumeId } from './services/resumeStorage';
import { SAMPLE_RESUMES, createEmptyResume } from './data/sampleResumes';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { DashboardPage } from './pages/DashboardPage';
import { ResumeEditorPage } from './pages/ResumeEditorPage';
import { AuthPages } from './pages/AuthPages';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [resumes, setResumes] = useState<Resume[]>(() => getStoredResumes());
  const [activeResumeId, setActiveResumeIdState] = useState<string>(() => {
    const savedActive = getActiveResumeId();
    if (savedActive && getStoredResumes().some(r => r.id === savedActive)) {
      return savedActive;
    }
    return getStoredResumes()[0]?.id || SAMPLE_RESUMES[0].id;
  });

  const refreshResumes = () => {
    const loaded = getStoredResumes();
    setResumes(loaded);
  };

  // Find active resume
  const activeResume = resumes.find(r => r.id === activeResumeId) || resumes[0] || SAMPLE_RESUMES[0];

  const handleUpdateResume = (updated: Resume) => {
    setResumes(prev => prev.map(r => (r.id === updated.id ? updated : r)));
  };

  const handleSelectResume = (id: string) => {
    setActiveResumeIdState(id);
    setActiveResumeId(id);
  };

  const handleCreateNewResume = () => {
    const newResume = createEmptyResume('classic', 'New Professional Resume');
    saveResume(newResume);
    refreshResumes();
    handleSelectResume(newResume.id);
    setCurrentPage('editor');
  };

  const handleSelectTemplate = (templateId: string) => {
    // Apply template to active resume while keeping all data intact
    const updated: Resume = {
      ...activeResume,
      design: {
        ...activeResume.design,
        templateId: templateId as TemplateId,
      },
    };
    saveResume(updated);
    handleUpdateResume(updated);
    setCurrentPage('editor');
  };

  const handleOpenSampleResume = (resumeId: string) => {
    const sample = SAMPLE_RESUMES.find(s => s.id === resumeId);
    if (sample) {
      // Ensure it exists in stored resumes
      saveResume(sample);
      refreshResumes();
      handleSelectResume(sample.id);
      setCurrentPage('editor');
    }
  };

  // Listen to popstate or window history if needed
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-500/20 selection:text-blue-900">
      {/* Global Navbar */}
      <Navbar
        activePage={currentPage}
        onNavigate={setCurrentPage}
        onNewResume={handleCreateNewResume}
      />

      {/* Pages View Routing */}
      {currentPage === 'landing' && (
        <LandingPage
          onNavigate={setCurrentPage}
          onSelectTemplate={handleSelectTemplate}
          onOpenSampleResume={handleOpenSampleResume}
        />
      )}

      {currentPage === 'templates' && (
        <TemplatesPage
          currentResume={activeResume}
          onSelectTemplate={(id) => handleSelectTemplate(id)}
          onNavigate={setCurrentPage}
        />
      )}

      {currentPage === 'dashboard' && (
        <DashboardPage
          resumes={resumes}
          onSelectResume={handleSelectResume}
          onRefreshResumes={refreshResumes}
          onNavigate={setCurrentPage}
        />
      )}

      {currentPage === 'editor' && (
        <ResumeEditorPage
          resume={activeResume}
          onUpdateResume={handleUpdateResume}
          onNavigate={setCurrentPage}
        />
      )}

      {(currentPage === 'login' || currentPage === 'signup' || currentPage === 'forgot') && (
        <AuthPages
          initialMode={currentPage as any}
          onNavigate={setCurrentPage}
          onContinueAsGuest={() => setCurrentPage('editor')}
        />
      )}
    </div>
  );
}
