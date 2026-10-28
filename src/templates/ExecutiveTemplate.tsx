import React from 'react';
import { Resume } from '../types/resume';

interface TemplateProps {
  resume: Resume;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, internships, awards, publications, volunteer, references, sectionVisibility, design } = resume;
  const primary = design.primaryColor || '#0F172A';

  return (
    <div className="w-full text-slate-800 leading-normal font-serif">
      {/* Executive Header Banner */}
      <header className="p-6 mb-6 text-white rounded-sm" style={{ backgroundColor: primary }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans">
          <div>
            <h1 className="text-3xl font-bold tracking-wide uppercase">
              {personalInfo.fullName || 'Candidate Name'}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-sm font-medium tracking-widest text-slate-300 uppercase mt-1">
                {personalInfo.jobTitle}
              </p>
            )}
          </div>
          <div className="text-xs text-slate-300 space-y-1 md:text-right border-t md:border-t-0 md:border-l border-slate-700 pt-2 md:pt-0 md:pl-4">
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
          </div>
        </div>
      </header>

      {/* Executive Summary Callout */}
      {sectionVisibility.summary && summary && (
        <section className="mb-6 bg-slate-50 border-l-4 p-4 rounded-r-sm" style={{ borderLeftColor: primary }}>
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 mb-1.5">
            Executive Profile & Career Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-700 font-sans">
            {summary}
          </p>
        </section>
      )}

      {/* Executive Core Competencies */}
      {sectionVisibility.skills && skills && skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest pb-1 mb-2.5 border-b-2" style={{ color: primary, borderColor: primary }}>
            Core Competencies & Executive Capabilities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 font-sans text-xs">
            {skills.map((s) => (
              <div key={s.id} className="flex items-center gap-1.5 text-slate-800">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primary }}></span>
                <span className="font-medium">{s.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Leadership Experience */}
      {sectionVisibility.experience && experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest pb-1 mb-3.5 border-b-2" style={{ color: primary, borderColor: primary }}>
            Executive Leadership & Career Trajectory
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline font-sans mb-1">
                  <div>
                    <span className="text-sm font-bold text-slate-900">{exp.role}</span>
                    <span className="text-xs text-slate-600 font-semibold"> | {exp.company}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.location && (
                  <p className="text-[11px] font-sans text-slate-500 mb-2 italic">{exp.location}</p>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700 font-sans">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="leading-snug">{b}</li>
                    ))}
                  </ul>
                )}
                {exp.achievements && (
                  <p className="mt-2 text-xs font-sans font-medium text-slate-800 bg-amber-50/60 border border-amber-200/50 p-2 rounded">
                    <span className="font-bold text-amber-950">Strategic Milestone:</span> {exp.achievements}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Credentials */}
      {sectionVisibility.education && education && education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest pb-1 mb-2.5 border-b-2" style={{ color: primary, borderColor: primary }}>
            Education & Executive Credentials
          </h2>
          <div className="space-y-2 font-sans">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between text-xs break-inside-avoid">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree}</span>
                  <span className="text-slate-600"> — {edu.institution}</span>
                  {edu.grade && <span className="text-slate-500 text-[11px] block">{edu.grade}</span>}
                </div>
                <span className="text-slate-500 text-[11px]">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications / Board / Certifications */}
      {sectionVisibility.publications && publications && publications.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest pb-1 mb-2 border-b-2" style={{ color: primary, borderColor: primary }}>
            Thought Leadership & Publications
          </h2>
          <div className="space-y-1.5 font-sans text-xs text-slate-700">
            {publications.map((pub) => (
              <div key={pub.id}>
                <span className="font-bold text-slate-900">"{pub.title}"</span> — {pub.publisher} ({pub.date})
              </div>
            ))}
          </div>
        </section>
      )}

      {sectionVisibility.certifications && certifications && certifications.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest pb-1 mb-2 border-b-2" style={{ color: primary, borderColor: primary }}>
            Board Certifications & Affiliations
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-slate-700">
            {certifications.map((c) => (
              <span key={c.id}>
                <span className="font-semibold text-slate-900">{c.name}</span> ({c.issuer}, {c.date})
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
