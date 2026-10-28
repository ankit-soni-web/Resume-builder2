import React from 'react';
import { Resume } from '../types/resume';

interface TemplateProps {
  resume: Resume;
}

export const DataScienceTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, skills, projects, publications, awards, sectionVisibility, design } = resume;
  const primary = design.primaryColor || '#7C3AED';

  return (
    <div className="w-full text-slate-800 leading-normal font-sans">
      {/* Header */}
      <header className="border-b pb-4 mb-4" style={{ borderColor: `${primary}50` }}>
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              {personalInfo.fullName || 'Data Scientist'}
            </h1>
            <p className="text-sm font-semibold tracking-wide mt-0.5" style={{ color: primary }}>
              {personalInfo.jobTitle || 'Data Science & Machine Learning Engineer'}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="text-violet-700 underline">{personalInfo.email}</a>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.github && <a href={`https://${personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-slate-700 underline">GitHub</a>}
            {personalInfo.linkedin && <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-slate-700 underline">LinkedIn</a>}
          </div>
        </div>
      </header>

      {/* Summary */}
      {sectionVisibility.summary && summary && (
        <section className="mb-4">
          <p className="text-xs text-slate-700 leading-relaxed bg-violet-50/40 p-2.5 rounded border border-violet-100">
            {summary}
          </p>
        </section>
      )}

      {/* Core Competencies & Modeling Stack */}
      {sectionVisibility.skills && skills && skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b flex items-center justify-between" style={{ color: primary, borderColor: `${primary}40` }}>
            <span>Machine Learning & Technical Competencies</span>
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span
                key={s.id}
                className="text-[11px] px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-700 border border-slate-200"
              >
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {sectionVisibility.experience && experience && experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b" style={{ color: primary, borderColor: `${primary}40` }}>
            Applied Data Science & Industry Experience
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="text-xs font-bold text-slate-900">{exp.role} — <span className="font-semibold text-slate-700">{exp.company}</span></span>
                  <span className="text-[11px] font-medium text-slate-500">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700 mt-1">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="leading-snug">{b}</li>
                    ))}
                  </ul>
                )}
                {exp.achievements && (
                  <p className="mt-1 text-xs text-violet-900 font-medium bg-violet-50/60 p-1.5 rounded">
                    <span className="font-bold">Metric Highlight:</span> {exp.achievements}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ML Projects & Architecture */}
      {sectionVisibility.projects && projects && projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2.5 border-b" style={{ color: primary, borderColor: `${primary}40` }}>
            Machine Learning & Data Engineering Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-900">{proj.title}</span>
                  {proj.projectUrl && (
                    <a href={proj.projectUrl} target="_blank" rel="noreferrer" className="text-[10px] text-violet-600 underline">
                      Model Artifact / Paper
                    </a>
                  )}
                </div>
                {proj.technologies && (
                  <p className="text-[10px] text-slate-500 mb-0.5">
                    <span className="font-semibold">Pipeline:</span> {proj.technologies.join(', ')}
                  </p>
                )}
                <p className="text-xs text-slate-700">{proj.description}</p>
                {proj.outcome && (
                  <p className="text-[11px] text-slate-800 font-medium mt-0.5">
                    <span className="font-bold text-violet-800">Result:</span> {proj.outcome}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications / Research */}
      {sectionVisibility.publications && publications && publications.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style={{ color: primary, borderColor: `${primary}40` }}>
            Research Papers & Publications
          </h2>
          <div className="space-y-1.5 text-xs text-slate-700">
            {publications.map((pub) => (
              <div key={pub.id}>
                <span className="font-bold text-slate-900">{pub.title}</span> — <i>{pub.publisher}</i> ({pub.date})
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {sectionVisibility.education && education && education.length > 0 && (
        <section className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style={{ color: primary, borderColor: `${primary}40` }}>
            Academic Background
          </h2>
          <div className="space-y-1.5 text-xs">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree}</span> — {edu.institution}
                  {edu.coursework && <p className="text-[11px] text-slate-500">{edu.coursework}</p>}
                </div>
                <span className="text-slate-500 text-[11px]">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
