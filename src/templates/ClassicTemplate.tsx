import React from 'react';
import { Resume } from '../types/resume';

interface TemplateProps {
  resume: Resume;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, internships, awards, publications, volunteer, references, sectionVisibility, design } = resume;
  const primary = design.primaryColor || '#14213D';

  return (
    <div className="w-full text-slate-800 leading-normal">
      {/* Header */}
      <header className="border-b-2 pb-4 mb-5 text-center" style={{ borderColor: primary }}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-1" style={{ color: primary }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-base font-semibold text-slate-600 mb-2">
            {personalInfo.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.email && (
            <span>• <a href={`mailto:${personalInfo.email}`} className="text-slate-700 underline">{personalInfo.email}</a></span>
          )}
          {personalInfo.linkedin && (
            <span>• <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-slate-700 underline">{personalInfo.linkedin}</a></span>
          )}
          {personalInfo.github && (
            <span>• <a href={`https://${personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-slate-700 underline">{personalInfo.github}</a></span>
          )}
          {personalInfo.website && (
            <span>• <a href={`https://${personalInfo.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-slate-700 underline">{personalInfo.website}</a></span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {sectionVisibility.summary && summary && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b border-slate-300" style={{ color: primary }}>
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-700 text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {sectionVisibility.experience && experience && experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b border-slate-300" style={{ color: primary }}>
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="text-xs font-bold text-slate-900">{exp.role}</span>
                  <span className="text-[11px] font-medium text-slate-500">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-slate-600 mb-1.5 italic">
                  <span>{exp.company}{exp.location ? `, ${exp.location}` : ''}</span>
                  {exp.employmentType && <span>{exp.employmentType}</span>}
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="pl-0.5 leading-snug">{b}</li>
                    ))}
                  </ul>
                )}
                {exp.achievements && (
                  <p className="mt-1 text-xs text-slate-700 font-medium">
                    <span className="font-semibold text-slate-900">Key Outcome:</span> {exp.achievements}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {sectionVisibility.education && education && education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b border-slate-300" style={{ color: primary }}>
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="text-xs font-bold text-slate-900">{edu.degree}</span>
                  <span className="text-[11px] font-medium text-slate-500">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                <div className="text-xs text-slate-700 italic mb-1">
                  {edu.institution} {edu.grade ? `• GPA/Grade: ${edu.grade}` : ''}
                </div>
                {edu.coursework && (
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold">Coursework:</span> {edu.coursework}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {sectionVisibility.skills && skills && skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b border-slate-300" style={{ color: primary }}>
            Core Competencies & Skills
          </h2>
          <div className="text-xs text-slate-700 space-y-1">
            <p>
              <span className="font-semibold text-slate-900">Skills: </span>
              {skills.map((s, idx) => (
                <span key={s.id}>
                  {s.name}{s.level ? ` (${s.level})` : ''}{idx < skills.length - 1 ? ' • ' : ''}
                </span>
              ))}
            </p>
          </div>
        </section>
      )}

      {/* Projects */}
      {sectionVisibility.projects && projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b border-slate-300" style={{ color: primary }}>
            Notable Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-900">{proj.title}</span>
                  {proj.projectUrl && (
                    <a href={proj.projectUrl} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 underline">
                      View Project
                    </a>
                  )}
                </div>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[11px] text-slate-500 mb-0.5">
                    <span className="font-semibold">Technologies:</span> {proj.technologies.join(', ')}
                  </p>
                )}
                <p className="text-xs text-slate-700 leading-snug">{proj.description}</p>
                {proj.outcome && (
                  <p className="text-xs text-slate-700 mt-0.5">
                    <span className="font-semibold text-slate-900">Impact:</span> {proj.outcome}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {sectionVisibility.certifications && certifications && certifications.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b border-slate-300" style={{ color: primary }}>
            Certifications
          </h2>
          <ul className="list-disc list-outside ml-4 text-xs text-slate-700 space-y-1">
            {certifications.map((c) => (
              <li key={c.id}>
                <span className="font-semibold text-slate-900">{c.name}</span> — {c.issuer} ({c.date})
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Internships if enabled */}
      {sectionVisibility.internships && internships && internships.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b border-slate-300" style={{ color: primary }}>
            Internships
          </h2>
          <div className="space-y-3">
            {internships.map((int) => (
              <div key={int.id}>
                <div className="flex justify-between text-xs font-bold">
                  <span>{int.position} — {int.organization}</span>
                  <span className="text-slate-500 font-normal">{int.duration}</span>
                </div>
                {int.bullets && (
                  <ul className="list-disc list-outside ml-4 text-xs text-slate-700 space-y-0.5 mt-1">
                    {int.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards */}
      {sectionVisibility.awards && awards && awards.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b border-slate-300" style={{ color: primary }}>
            Honors & Awards
          </h2>
          <ul className="list-disc list-outside ml-4 text-xs text-slate-700 space-y-1">
            {awards.map((a) => (
              <li key={a.id}>
                <span className="font-semibold text-slate-900">{a.title}</span> — {a.issuer} ({a.date})
                {a.description && <span className="text-slate-600 block mt-0.5">{a.description}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
