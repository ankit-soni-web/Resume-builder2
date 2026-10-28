import React, { useState, useEffect } from 'react';
import { Resume, ResumeSectionKey, TemplateId } from '../types/resume';
import { TEMPLATES } from '../data/templates';
import { saveResume, resetResumeDesign } from '../services/resumeStorage';
import { analyzeResumeForATS } from '../services/atsChecker';
import { ResumeRenderer } from '../templates/ResumeRenderer';
import { PersonalInfoEditor } from '../components/editors/PersonalInfoEditor';
import { SummaryEditor } from '../components/editors/SummaryEditor';
import { ExperienceEditor } from '../components/editors/ExperienceEditor';
import { EducationEditor } from '../components/editors/EducationEditor';
import { SkillsEditor } from '../components/editors/SkillsEditor';
import { ProjectsEditor } from '../components/editors/ProjectsEditor';
import { CertificationsEditor } from '../components/editors/CertificationsEditor';
import { AdditionalSectionsEditor } from '../components/editors/AdditionalSectionsEditor';
import { SectionManager } from '../components/SectionManager';
import { DesignPanel } from '../components/DesignPanel';
import { ATSCheckerModal } from '../components/ATSCheckerModal';
import { AIAssistantModal } from '../components/AIAssistantModal';
import { PrintPreviewModal } from '../components/PrintPreviewModal';
import {
  User, FileText, Briefcase, GraduationCap, Wrench, FolderGit2,
  Award, Layers, Palette, ShieldCheck, Sparkles, Printer, Download,
  ZoomIn, ZoomOut, RotateCcw, CheckCircle, Clock, Eye, SlidersHorizontal,
  ChevronLeft, Layout
} from 'lucide-react';

interface Props {
  resume: Resume;
  onUpdateResume: (updated: Resume) => void;
  onNavigate: (page: string) => void;
}

export const ResumeEditorPage: React.FC<Props> = ({ resume, onUpdateResume, onNavigate }) => {
  // Navigation within editor
  const [activeSection, setActiveSection] = useState<string>('personalInfo');
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview' | 'design' | 'ats'>('edit');
  const [previewScale, setPreviewScale] = useState<number>(0.85);

  // Modals state
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Save status state
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Autosave handler
  const handleResumeChange = (updated: Resume) => {
    setSaveStatus('saving');
    onUpdateResume(updated);
    saveResume(updated);
    setTimeout(() => setSaveStatus('saved'), 400);
  };

  const handleResetDesign = () => {
    const updated = resetResumeDesign(resume);
    handleResumeChange(updated);
  };

  const atsScore = analyzeResumeForATS(resume).overallScore;

  // Completion badges
  const isPersonalComplete = Boolean(resume.personalInfo.fullName && resume.personalInfo.email);
  const isSummaryComplete = Boolean(resume.summary && resume.summary.length > 20);
  const isExpComplete = resume.experience.length > 0;
  const isEduComplete = resume.education.length > 0;
  const isSkillsComplete = resume.skills.length >= 4;
  const isProjectsComplete = resume.projects.length > 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Editor Top Bar (no-print) */}
      <header className="no-print h-14 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
            title="Return to Dashboard"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

          {/* Editable Title */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={resume.title}
              onChange={(e) => handleResumeChange({ ...resume, title: e.target.value })}
              className="text-xs sm:text-sm font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 bg-transparent max-w-[180px] sm:max-w-xs transition-colors"
              title="Click to rename resume"
            />
          </div>

          {/* Save status badge */}
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium ml-2">
            {saveStatus === 'saving' ? (
              <span className="flex items-center gap-1 text-amber-600">
                <Clock className="w-3 h-3 animate-spin" />
                <span className="hidden md:inline">Saving...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-500">
                <CheckCircle className="w-3 h-3 text-teal-600" />
                <span className="hidden md:inline">Autosaved</span>
              </span>
            )}
          </div>
        </div>

        {/* Top Right Action Tools */}
        <div className="flex items-center gap-2">
          {/* ATS Score Button */}
          <button
            type="button"
            onClick={() => setIsAtsModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer bg-white hover:bg-blue-50 border-slate-200"
            title="Open ATS Checker"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">ATS Score:</span>
            <span className={atsScore >= 80 ? 'text-green-600' : 'text-blue-600'}>{atsScore}/100</span>
          </button>

          {/* AI Assistant Button */}
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
            title="AI Writing & Polishing Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden md:inline">AI Assistant</span>
          </button>

          {/* Download / Print PDF */}
          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#14213D] hover:bg-blue-600 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF Export</span>
          </button>
        </div>
      </header>

      {/* Mobile Mode Switcher Tabs (no-print) */}
      <div className="lg:hidden no-print bg-white border-b border-slate-200 px-4 py-1.5 flex items-center justify-around text-xs font-bold text-slate-600">
        <button
          type="button"
          onClick={() => setMobileTab('edit')}
          className={`py-1.5 px-3 rounded-lg ${mobileTab === 'edit' ? 'text-blue-600 bg-blue-50' : ''}`}
        >
          Form Editor
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`py-1.5 px-3 rounded-lg flex items-center gap-1 ${mobileTab === 'preview' ? 'text-blue-600 bg-blue-50' : ''}`}
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('design')}
          className={`py-1.5 px-3 rounded-lg flex items-center gap-1 ${mobileTab === 'design' ? 'text-blue-600 bg-blue-50' : ''}`}
        >
          <Palette className="w-3.5 h-3.5" />
          Design
        </button>
      </div>

      {/* Workspace 3-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: Section Navigator (no-print) */}
        <aside className={`w-56 shrink-0 bg-white border-r border-slate-200 p-3 overflow-y-auto hidden lg:flex flex-col justify-between no-print`}>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
              Resume Sections
            </span>

            <button
              type="button"
              onClick={() => setActiveSection('personalInfo')}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeSection === 'personalInfo'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Personal Info
              </span>
              {isPersonalComplete && <CheckCircle className="w-3 h-3 text-teal-600" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('summary')}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeSection === 'summary'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" />
                Summary
              </span>
              {isSummaryComplete && <CheckCircle className="w-3 h-3 text-teal-600" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('experience')}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeSection === 'experience'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" />
                Experience
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                {resume.experience.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('education')}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeSection === 'education'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5" />
                Education
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                {resume.education.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('skills')}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeSection === 'skills'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5" />
                Skills
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                {resume.skills.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('projects')}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeSection === 'projects'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <FolderGit2 className="w-3.5 h-3.5" />
                Projects
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                {resume.projects.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('certifications')}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeSection === 'certifications'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5" />
                Certifications
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                {resume.certifications.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('additional')}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeSection === 'additional'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                More Sections
              </span>
            </button>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveSection('sectionManager')}
                className={`w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeSection === 'sectionManager'
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Reorder / Hide Sections
              </button>
            </div>
          </div>

          {/* Design Settings Trigger */}
          <div className="pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveSection('design')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeSection === 'design'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Palette className="w-4 h-4 text-blue-500" />
              <span>Design & Templates</span>
            </button>
          </div>
        </aside>

        {/* CENTER PANEL: Active Form Editor (no-print) */}
        <main
          className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-white border-r border-slate-200 max-w-2xl mx-auto lg:mx-0 w-full no-print ${
            mobileTab !== 'edit' && mobileTab !== 'design' ? 'hidden lg:block' : ''
          }`}
        >
          {/* If mobileTab is design or activeSection is design */}
          {(mobileTab === 'design' || activeSection === 'design') ? (
            <DesignPanel
              design={resume.design}
              onChange={(updatedDesign) => handleResumeChange({ ...resume, design: updatedDesign })}
              onResetDesign={handleResetDesign}
            />
          ) : activeSection === 'personalInfo' ? (
            <PersonalInfoEditor
              data={resume.personalInfo}
              onChange={(personalInfo) => handleResumeChange({ ...resume, personalInfo })}
            />
          ) : activeSection === 'summary' ? (
            <SummaryEditor
              summary={resume.summary}
              onChange={(summary) => handleResumeChange({ ...resume, summary })}
              onOpenAIModal={() => setIsAiModalOpen(true)}
            />
          ) : activeSection === 'experience' ? (
            <ExperienceEditor
              items={resume.experience}
              onChange={(experience) => handleResumeChange({ ...resume, experience })}
            />
          ) : activeSection === 'education' ? (
            <EducationEditor
              items={resume.education}
              onChange={(education) => handleResumeChange({ ...resume, education })}
            />
          ) : activeSection === 'skills' ? (
            <SkillsEditor
              items={resume.skills}
              onChange={(skills) => handleResumeChange({ ...resume, skills })}
              targetRole={resume.personalInfo.jobTitle}
            />
          ) : activeSection === 'projects' ? (
            <ProjectsEditor
              items={resume.projects}
              onChange={(projects) => handleResumeChange({ ...resume, projects })}
            />
          ) : activeSection === 'certifications' ? (
            <CertificationsEditor
              items={resume.certifications}
              onChange={(certifications) => handleResumeChange({ ...resume, certifications })}
            />
          ) : activeSection === 'additional' ? (
            <AdditionalSectionsEditor
              resume={resume}
              onChange={handleResumeChange}
            />
          ) : activeSection === 'sectionManager' ? (
            <SectionManager
              resume={resume}
              onChange={handleResumeChange}
            />
          ) : null}
        </main>

        {/* RIGHT PANEL: Live Resume Preview (Printable) */}
        <section
          className={`flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-200/50 flex flex-col items-center ${
            mobileTab !== 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Preview Controls Bar (no-print) */}
          <div className="no-print w-full max-w-[800px] mb-4 flex items-center justify-between text-xs text-slate-600 bg-white/90 backdrop-blur-xs p-2 rounded-xl shadow-2xs border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Live Preview</span>
              <span className="text-[11px] text-slate-400">• {resume.design.paperSize.toUpperCase()}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPreviewScale((prev) => Math.max(0.5, prev - 0.1))}
                className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5 text-slate-500" />
              </button>
              <span className="text-[11px] font-mono text-slate-500 px-1">
                {Math.round(previewScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setPreviewScale((prev) => Math.min(1.2, prev + 0.1))}
                className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                className="ml-2 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-white hover:bg-slate-800 bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
            </div>
          </div>

          {/* Master Resume Render Output */}
          <div className="w-full flex justify-center">
            <ResumeRenderer resume={resume} scale={previewScale} />
          </div>
        </section>
      </div>

      {/* Modals */}
      <ATSCheckerModal
        isOpen={isAtsModalOpen}
        onClose={() => setIsAtsModalOpen(false)}
        resume={resume}
      />

      <AIAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        resume={resume}
        onApplySummary={(newSummary) => handleResumeChange({ ...resume, summary: newSummary })}
      />

      <PrintPreviewModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        resume={resume}
      />
    </div>
  );
};
