import React from 'react';
import { Resume } from '../types/resume';

interface TemplateProps {
  resume: Resume;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, awards, sectionVisibility, design } = resume;
  const primary = design.primaryColor || '#EC4899';

  return (
    <div className="w-full text-slate-800 leading-normal font-sans">
      {/* Creative Header */}
      <header className="mb-6 pb-4 border-b-2" style={{ borderColor: primary }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Creative Portfolio Resume</span>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-0.5">
              {personalInfo.fullName || 'Creative Designer'}
            </h1>
            <p className="text-sm font-semibold mt-1" style={{ color: primary }}>
              {personalInfo.jobTitle || 'Product Designer & Art Director'}
            </p>
          </div>
          <div className="flex flex-wrap md:flex-col md:items-end gap-x-3 gap-y-1 text-xs text-slate-600">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="text-slate-900 font-medium hover:underline">{personalInfo.email}</a>}
            {personalInfo.website && (
              <a href={`https://${personalInfo.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="font-semibold underline" style={{ color: primary }}>
                {personalInfo.website}
              </a>
            )}
          </div>
        </div>
      </header>

      {/* About & Creative Vision */}
      {sectionVisibility.summary && summary && (
        <section className="mb-5">
          <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-lg border-l-4" style={{ borderLeftColor: primary }}>
            {summary}
          </p>
        </section>
      )}

      {/* Creative Skills & Tools */}
      {sectionVisibility.skills && skills && skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2" style={{ color: primary }}>
            <span className="w-2.5 h-0.5 bg-current"></span>
            Design Toolkit & Core Proficiencies
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span
                key={s.id}
                className="text-[11px] px-2.5 py-1 rounded-full font-medium text-slate-800 bg-slate-100 border border-slate-200"
              >
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Creative Experience */}
      {sectionVisibility.experience && experience && experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: primary }}>
            <span className="w-2.5 h-0.5 bg-current"></span>
            Professional Experience & Creative Direction
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="text-xs font-bold text-slate-900">{exp.role} — <span className="font-medium text-slate-600">{exp.company}</span></span>
                  <span className="text-[11px] font-medium text-slate-400">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700 mt-1">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="leading-snug">{b}</li>
                    ))}
                  </ul>
                )}
                {exp.achievements && (
                  <p className="mt-1 text-xs text-slate-800 font-medium">
                    <span className="font-bold" style={{ color: primary }}>Outcome:</span> {exp.achievements}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Selected Design & UX Projects */}
      {sectionVisibility.projects && projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2" style={{ color: primary }}>
            <span className="w-2.5 h-0.5 bg-current"></span>
            Featured Case Studies & Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projects.map((proj) => (
              <div key={proj.id} className="p-2.5 rounded-lg border border-slate-200 bg-white shadow-xs break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs font-bold text-slate-900">{proj.title}</span>
                  {proj.projectUrl && (
                    <a href={proj.projectUrl} target="_blank" rel="noreferrer" className="text-[10px] font-semibold underline" style={{ color: primary }}>
                      Case Study
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 mb-1">{proj.description}</p>
                {proj.technologies && (
                  <p className="text-[10px] text-slate-500 font-mono">
                    {proj.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Awards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sectionVisibility.education && education && education.length > 0 && (
          <section className="mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: primary }}>
              Education & Design Training
            </h2>
            <div className="space-y-1.5 text-xs">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-500">{edu.institution} ({edu.startDate} – {edu.endDate})</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {sectionVisibility.awards && awards && awards.length > 0 && (
          <section className="mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: primary }}>
              Design Awards & Recognition
            </h2>
            <ul className="text-xs text-slate-700 space-y-1">
              {awards.map((a) => (
                <li key={a.id}>
                  <span className="font-semibold text-slate-900">{a.title}</span>
                  <span className="text-slate-500 block text-[11px]">{a.issuer} ({a.date})</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};
