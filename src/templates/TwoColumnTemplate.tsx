import React from 'react';
import { Resume } from '../types/resume';

interface TemplateProps {
  resume: Resume;
}

export const TwoColumnTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, awards, internships, references, sectionVisibility, design } = resume;
  const primary = design.primaryColor || '#1E40AF';

  return (
    <div className="w-full text-slate-800 leading-normal font-sans">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Sidebar (35%) */}
        <aside className="w-full md:w-[35%] bg-slate-50/80 p-4 rounded-sm border-r border-slate-200/80 flex flex-col gap-5">
          {/* Contact Details */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b-2" style={{ borderColor: primary }}>
              Contact Details
            </h2>
            <div className="text-xs text-slate-600 space-y-1.5">
              {personalInfo.location && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.email && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Email</span>
                  <a href={`mailto:${personalInfo.email}`} className="text-blue-600 hover:underline break-all">
                    {personalInfo.email}
                  </a>
                </div>
              )}
              {personalInfo.phone && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone</span>
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">LinkedIn</span>
                  <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">
                    {personalInfo.linkedin}
                  </a>
                </div>
              )}
              {personalInfo.github && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">GitHub</span>
                  <a href={`https://${personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">
                    {personalInfo.github}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Core Skills */}
          {sectionVisibility.skills && skills && skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b-2" style={{ borderColor: primary }}>
                Core Skills
              </h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((s) => (
                  <span key={s.id} className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-medium">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education in Sidebar */}
          {sectionVisibility.education && education && education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b-2" style={{ borderColor: primary }}>
                Education
              </h2>
              <div className="space-y-2.5 text-xs">
                {education.map((edu) => (
                  <div key={edu.id} className="break-inside-avoid">
                    <span className="font-bold text-slate-900 block">{edu.degree}</span>
                    <span className="text-slate-600 block">{edu.institution}</span>
                    <span className="text-[11px] text-slate-400 block">{edu.startDate} – {edu.endDate}</span>
                    {edu.grade && <span className="text-[11px] text-slate-500 font-medium">{edu.grade}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications in Sidebar */}
          {sectionVisibility.certifications && certifications && certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b-2" style={{ borderColor: primary }}>
                Certifications
              </h2>
              <div className="space-y-1.5 text-xs text-slate-700">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <span className="font-semibold text-slate-900 block">{c.name}</span>
                    <span className="text-[11px] text-slate-500">{c.issuer} ({c.date})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Right Main Body (65%) */}
        <main className="w-full md:w-[65%] flex flex-col gap-5">
          {/* Header */}
          <header className="border-b pb-4" style={{ borderColor: `${primary}30` }}>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              {personalInfo.fullName || 'Candidate Name'}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-sm font-semibold tracking-wide mt-0.5" style={{ color: primary }}>
                {personalInfo.jobTitle}
              </p>
            )}
          </header>

          {/* Summary */}
          {sectionVisibility.summary && summary && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: primary }}>
                Profile Summary
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed text-justify">
                {summary}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {sectionVisibility.experience && experience && experience.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b border-slate-200" style={{ color: primary }}>
                Professional Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="text-xs font-bold text-slate-900">{exp.role}</span>
                      <span className="text-[11px] text-slate-500">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <div className="text-xs text-slate-600 italic mb-1.5">{exp.company} {exp.location ? `• ${exp.location}` : ''}</div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="leading-snug">{b}</li>
                        ))}
                      </ul>
                    )}
                    {exp.achievements && (
                      <p className="mt-1 text-xs text-slate-800 font-medium">
                        <span className="font-bold text-slate-900">Impact:</span> {exp.achievements}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {sectionVisibility.projects && projects && projects.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-200" style={{ color: primary }}>
                Key Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-slate-900">{proj.title}</span>
                      {proj.projectUrl && (
                        <a href={proj.projectUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 underline">
                          View
                        </a>
                      )}
                    </div>
                    {proj.technologies && (
                      <p className="text-[10px] text-slate-500 mb-0.5">{proj.technologies.join(', ')}</p>
                    )}
                    <p className="text-xs text-slate-700 leading-snug">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Awards */}
          {sectionVisibility.awards && awards && awards.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b border-slate-200" style={{ color: primary }}>
                Honors & Achievements
              </h2>
              <ul className="text-xs text-slate-700 space-y-1">
                {awards.map((a) => (
                  <li key={a.id}>
                    <span className="font-semibold text-slate-900">{a.title}</span> — {a.issuer} ({a.date})
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};
