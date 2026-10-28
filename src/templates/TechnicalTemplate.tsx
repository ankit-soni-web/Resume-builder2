import React from 'react';
import { Resume } from '../types/resume';

interface TemplateProps {
  resume: Resume;
}

export const TechnicalTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, sectionVisibility, design } = resume;
  const primary = design.primaryColor || '#2563EB';

  // Group skills by category for developer matrix
  const technicalSkills = skills.filter(s => s.category === 'technical' || !s.category);
  const toolSkills = skills.filter(s => s.category === 'tools');
  const softSkills = skills.filter(s => s.category === 'soft');
  const langSkills = skills.filter(s => s.category === 'languages');

  return (
    <div className="w-full text-slate-800 leading-normal font-sans">
      {/* Header */}
      <header className="border-b-2 pb-3 mb-4" style={{ borderColor: primary }}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
              {personalInfo.fullName || 'Alex Morgan'}
            </h1>
            <p className="text-sm font-semibold text-slate-600 mt-0.5" style={{ color: primary }}>
              {personalInfo.jobTitle || 'Senior Software Engineer'}
            </p>
          </div>
          <div className="flex flex-wrap md:flex-col md:items-end gap-x-3 gap-y-0.5 text-xs text-slate-600 font-mono">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="text-blue-600 hover:underline">{personalInfo.email}</a>
            )}
            {personalInfo.github && (
              <a href={`https://${personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-slate-800 hover:underline">
                gh: {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\/?/, '')}
              </a>
            )}
            {personalInfo.linkedin && (
              <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-slate-800 hover:underline">
                in: {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\/?/, '')}
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Summary */}
      {sectionVisibility.summary && summary && (
        <section className="mb-4">
          <p className="text-xs text-slate-700 leading-relaxed">
            {summary}
          </p>
        </section>
      )}

      {/* Technical Skills Matrix */}
      {sectionVisibility.skills && skills && skills.length > 0 && (
        <section className="mb-4 bg-slate-50 p-3 rounded border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 font-mono flex items-center gap-1.5" style={{ color: primary }}>
            <span>//</span> Technical Skills Matrix
          </h2>
          <div className="space-y-1 text-xs">
            {technicalSkills.length > 0 && (
              <p className="leading-snug">
                <span className="font-semibold text-slate-800">Languages & Core:</span>{' '}
                <span className="text-slate-700">{technicalSkills.map(s => s.name).join(', ')}</span>
              </p>
            )}
            {toolSkills.length > 0 && (
              <p className="leading-snug">
                <span className="font-semibold text-slate-800">Cloud & Tooling:</span>{' '}
                <span className="text-slate-700">{toolSkills.map(s => s.name).join(', ')}</span>
              </p>
            )}
            {softSkills.length > 0 && (
              <p className="leading-snug">
                <span className="font-semibold text-slate-800">Practices & Leadership:</span>{' '}
                <span className="text-slate-700">{softSkills.map(s => s.name).join(', ')}</span>
              </p>
            )}
            {langSkills.length > 0 && (
              <p className="leading-snug">
                <span className="font-semibold text-slate-800">Languages:</span>{' '}
                <span className="text-slate-700">{langSkills.map(s => `${s.name}${s.level ? ` (${s.level})` : ''}`).join(', ')}</span>
              </p>
            )}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {sectionVisibility.experience && experience && experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b border-slate-200 font-mono flex items-center gap-1.5" style={{ color: primary }}>
            <span>//</span> Experience
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-0.5">
                  <div>
                    <span className="text-xs font-bold text-slate-900">{exp.role}</span>
                    <span className="text-xs text-slate-600 font-medium"> @ {exp.company}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.location && (
                  <p className="text-[10px] text-slate-500 mb-1">{exp.location}</p>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="leading-snug">{b}</li>
                    ))}
                  </ul>
                )}
                {exp.achievements && (
                  <p className="mt-1 text-xs text-slate-800 font-mono bg-blue-50/70 p-1.5 rounded border border-blue-100">
                    <span className="font-bold text-blue-900">&gt; Impact:</span> {exp.achievements}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Engineering Projects */}
      {sectionVisibility.projects && projects && projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2.5 border-b border-slate-200 font-mono flex items-center gap-1.5" style={{ color: primary }}>
            <span>//</span> Open Source & Key Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{proj.title}</span>
                    {proj.githubUrl && (
                      <a href={`https://${proj.githubUrl.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 font-mono underline">
                        [src]
                      </a>
                    )}
                  </div>
                </div>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 my-1">
                    {proj.technologies.map((t, idx) => (
                      <span key={idx} className="text-[9px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-slate-700 leading-snug">{proj.description}</p>
                {proj.outcome && (
                  <p className="text-[11px] text-slate-800 font-mono mt-0.5">
                    <span className="font-bold text-slate-900">&gt;</span> {proj.outcome}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sectionVisibility.education && education && education.length > 0 && (
          <section className="mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200 font-mono" style={{ color: primary }}>
              // Education
            </h2>
            <div className="space-y-2 text-xs">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-600">{edu.institution} ({edu.startDate} – {edu.endDate})</div>
                  {edu.grade && <div className="text-slate-500 text-[11px] font-mono">{edu.grade}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {sectionVisibility.certifications && certifications && certifications.length > 0 && (
          <section className="mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b border-slate-200 font-mono" style={{ color: primary }}>
              // Certifications
            </h2>
            <ul className="text-xs text-slate-700 space-y-1">
              {certifications.map((c) => (
                <li key={c.id}>
                  <span className="font-semibold text-slate-900">{c.name}</span>
                  <span className="text-slate-500 block text-[11px] font-mono">{c.issuer} ({c.date})</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};
