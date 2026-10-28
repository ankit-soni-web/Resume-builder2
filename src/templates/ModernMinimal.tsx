import React from 'react';
import { Resume } from '../types/resume';

interface TemplateProps {
  resume: Resume;
}

export const ModernMinimal: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, internships, awards, publications, volunteer, references, sectionVisibility, design } = resume;
  const primary = design.primaryColor || '#3B82F6';

  return (
    <div className="w-full text-slate-700 leading-relaxed font-sans">
      {/* Header */}
      <header className="mb-6 pb-4 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-base font-semibold mt-1 tracking-wide" style={{ color: primary }}>
                {personalInfo.jobTitle}
              </p>
            )}
          </div>
          <div className="flex flex-wrap md:flex-col md:items-end gap-x-3 gap-y-1 text-xs text-slate-500">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="hover:text-slate-900 transition-colors">
                {personalInfo.email}
              </a>
            )}
            {personalInfo.linkedin && (
              <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors">
                {personalInfo.linkedin}
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Summary */}
      {sectionVisibility.summary && summary && (
        <section className="mb-6">
          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {sectionVisibility.experience && experience && experience.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Experience</h2>
          </div>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="relative pl-3 border-l-2 border-slate-100 break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-slate-900">{exp.role}</span>
                    <span className="text-xs text-slate-500 font-medium">@ {exp.company}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="space-y-1 mt-1.5 text-xs text-slate-600">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-slate-400 mt-1 text-[8px]">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {exp.achievements && (
                  <div className="mt-1.5 text-xs text-slate-700 bg-slate-50 p-1.5 rounded">
                    <span className="font-semibold text-slate-900">Result:</span> {exp.achievements}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {sectionVisibility.skills && skills && skills.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Skills & Tooling</h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span
                key={s.id}
                className="text-[11px] px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium"
              >
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {sectionVisibility.projects && projects && projects.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Selected Work</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projects.map((proj) => (
              <div key={proj.id} className="p-2.5 rounded border border-slate-100 bg-slate-50/50 break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs font-bold text-slate-900">{proj.title}</span>
                  {proj.projectUrl && (
                    <a href={proj.projectUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 underline">
                      Link
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 mb-1.5">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {proj.technologies.map((t, idx) => (
                      <span key={idx} className="text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Credentials */}
      {sectionVisibility.education && education && education.length > 0 && (
        <section className="mb-4">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Education</h2>
          </div>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs break-inside-avoid">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree}</span>
                  <span className="text-slate-500"> — {edu.institution}</span>
                </div>
                <span className="text-[11px] text-slate-400">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {sectionVisibility.certifications && certifications && certifications.length > 0 && (
        <section className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }}></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">Certifications</h2>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
            {certifications.map((c) => (
              <span key={c.id}>
                <span className="font-semibold text-slate-800">{c.name}</span> ({c.issuer}, {c.date})
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
