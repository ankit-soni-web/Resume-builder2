import React from 'react';
import { Resume } from '../types/resume';

interface TemplateProps {
  resume: Resume;
}

export const FresherTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, internships, awards, volunteer, sectionVisibility, design } = resume;
  const primary = design.primaryColor || '#0D9488';

  return (
    <div className="w-full text-slate-800 leading-normal font-sans">
      {/* Header */}
      <header className="border-b-2 pb-4 mb-5" style={{ borderColor: primary }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              {personalInfo.fullName || 'Candidate Name'}
            </h1>
            <p className="text-sm font-semibold tracking-wide mt-0.5" style={{ color: primary }}>
              {personalInfo.jobTitle || 'Recent Graduate'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 md:text-right">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.email && (
              <span>• <a href={`mailto:${personalInfo.email}`} className="text-slate-800 font-medium underline">{personalInfo.email}</a></span>
            )}
            {personalInfo.linkedin && (
              <span>• <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-slate-800 font-medium underline">LinkedIn</a></span>
            )}
            {personalInfo.github && (
              <span>• <a href={`https://${personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-slate-800 font-medium underline">GitHub</a></span>
            )}
          </div>
        </div>
      </header>

      {/* Summary */}
      {sectionVisibility.summary && summary && (
        <section className="mb-4">
          <p className="text-xs text-slate-700 leading-relaxed bg-teal-50/50 p-2.5 rounded border border-teal-100">
            {summary}
          </p>
        </section>
      )}

      {/* Education — Top Priority for Freshers */}
      {sectionVisibility.education && education && education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style={{ color: primary, borderColor: primary }}>
            Education & Academic Credentials
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
                <div className="text-xs text-slate-700 flex flex-wrap gap-x-2">
                  <span className="font-semibold text-slate-800">{edu.institution}</span>
                  {edu.grade && (
                    <span className="text-teal-700 font-medium bg-teal-50 px-1.5 py-0.2 rounded text-[11px]">
                      {edu.grade}
                    </span>
                  )}
                </div>
                {edu.coursework && (
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    <span className="font-semibold text-slate-700">Relevant Coursework:</span> {edu.coursework}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical & Core Skills */}
      {sectionVisibility.skills && skills && skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style={{ color: primary, borderColor: primary }}>
            Skills & Technical Proficiencies
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span
                key={s.id}
                className="text-[11px] px-2 py-0.5 rounded font-medium border"
                style={{ borderColor: `${primary}40`, backgroundColor: `${primary}08`, color: primary }}
              >
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Internships */}
      {sectionVisibility.internships && internships && internships.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style={{ color: primary, borderColor: primary }}>
            Internship Experience
          </h2>
          <div className="space-y-3">
            {internships.map((int) => (
              <div key={int.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-900">{int.position}</span>
                  <span className="text-[11px] text-slate-500">{int.duration}</span>
                </div>
                <div className="text-xs text-slate-600 italic mb-1">{int.organization}</div>
                {int.bullets && (
                  <ul className="list-disc list-outside ml-4 text-xs text-slate-700 space-y-1">
                    {int.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
                {int.achievements && (
                  <p className="text-xs text-teal-800 font-medium mt-1">
                    <span className="font-bold">Key Takeaway:</span> {int.achievements}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Academic / Hands-on Projects */}
      {sectionVisibility.projects && projects && projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style={{ color: primary, borderColor: primary }}>
            Projects & Capstone Work
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="text-xs font-bold text-slate-900">{proj.title}</span>
                  <div className="space-x-2 text-[11px]">
                    {proj.githubUrl && (
                      <a href={`https://${proj.githubUrl.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-teal-700 underline font-medium">
                        GitHub
                      </a>
                    )}
                    {proj.projectUrl && (
                      <a href={proj.projectUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[10px] text-slate-500 font-mono mb-1">
                    Tech Stack: {proj.technologies.join(' • ')}
                  </p>
                )}
                <p className="text-xs text-slate-700 leading-snug">{proj.description}</p>
                {proj.outcome && (
                  <p className="text-xs text-slate-800 font-medium mt-0.5">
                    <span className="font-bold text-slate-900">Result:</span> {proj.outcome}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Awards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sectionVisibility.certifications && certifications && certifications.length > 0 && (
          <section className="mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style={{ color: primary, borderColor: primary }}>
              Certifications
            </h2>
            <ul className="text-xs text-slate-700 space-y-1">
              {certifications.map((c) => (
                <li key={c.id}>
                  <span className="font-semibold text-slate-800">{c.name}</span>
                  <span className="text-slate-500 block text-[11px]">{c.issuer} ({c.date})</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {sectionVisibility.awards && awards && awards.length > 0 && (
          <section className="mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style={{ color: primary, borderColor: primary }}>
              Honors & Activities
            </h2>
            <ul className="text-xs text-slate-700 space-y-1">
              {awards.map((a) => (
                <li key={a.id}>
                  <span className="font-semibold text-slate-800">{a.title}</span>
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
