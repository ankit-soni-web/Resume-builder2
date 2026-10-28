import React from 'react';
import { Resume, ResumeSectionKey } from '../types/resume';
import { Eye, EyeOff, ChevronUp, ChevronDown, Check } from 'lucide-react';

interface Props {
  resume: Resume;
  onChange: (updatedResume: Resume) => void;
}

const SECTION_LABELS: Record<ResumeSectionKey, string> = {
  personalInfo: 'Personal Information',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills & Competencies',
  projects: 'Notable Projects',
  certifications: 'Certifications',
  internships: 'Internships',
  awards: 'Honors & Awards',
  publications: 'Publications & Research',
  volunteer: 'Volunteer Experience',
  references: 'Professional References',
};

export const SectionManager: React.FC<Props> = ({ resume, onChange }) => {
  const toggleVisibility = (key: ResumeSectionKey) => {
    onChange({
      ...resume,
      sectionVisibility: {
        ...resume.sectionVisibility,
        [key]: !resume.sectionVisibility[key],
      },
    });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const order = [...resume.sectionOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= order.length) return;
    const temp = order[index];
    order[index] = order[targetIdx];
    order[targetIdx] = temp;
    onChange({
      ...resume,
      sectionOrder: order,
    });
  };

  return (
    <div className="space-y-4">
      <div className="pb-2 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">Manage Resume Sections</h3>
        <p className="text-xs text-slate-500">Show, hide, and reorder sections to fit your career narrative.</p>
      </div>

      <div className="space-y-2">
        {resume.sectionOrder.map((key, index) => {
          const isVisible = resume.sectionVisibility[key];
          const isPersonal = key === 'personalInfo';

          return (
            <div
              key={key}
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-colors ${
                isVisible ? 'bg-white border-slate-200' : 'bg-slate-50/70 border-slate-200/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isPersonal}
                  onClick={() => toggleVisibility(key)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isVisible
                      ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                      : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                  }`}
                  title={isVisible ? 'Hide Section' : 'Show Section'}
                >
                  {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <span className={`text-xs font-semibold ${isVisible ? 'text-slate-800' : 'text-slate-500'}`}>
                  {SECTION_LABELS[key] || key}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveSection(index, 'up')}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === resume.sectionOrder.length - 1}
                  onClick={() => moveSection(index, 'down')}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
