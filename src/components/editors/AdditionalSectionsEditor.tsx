import React from 'react';
import { Resume, InternshipItem, AwardItem, PublicationItem, VolunteerItem, ReferenceItem } from '../../types/resume';
import { Plus, Trash2, Award, BookOpen, HeartHandshake, Users } from 'lucide-react';

interface Props {
  resume: Resume;
  onChange: (updatedResume: Resume) => void;
}

export const AdditionalSectionsEditor: React.FC<Props> = ({ resume, onChange }) => {
  // Internships
  const addInternship = () => {
    const newItem: InternshipItem = {
      id: 'int-' + Math.random().toString(36).substring(2, 9),
      position: '',
      organization: '',
      duration: '',
      bullets: [''],
      achievements: '',
    };
    onChange({
      ...resume,
      internships: [...(resume.internships || []), newItem],
    });
  };

  const updateInternship = (id: string, field: keyof InternshipItem, value: any) => {
    onChange({
      ...resume,
      internships: (resume.internships || []).map(i => (i.id === id ? { ...i, [field]: value } : i)),
    });
  };

  const deleteInternship = (id: string) => {
    onChange({
      ...resume,
      internships: (resume.internships || []).filter(i => i.id !== id),
    });
  };

  // Awards
  const addAward = () => {
    const newItem: AwardItem = {
      id: 'aw-' + Math.random().toString(36).substring(2, 9),
      title: '',
      issuer: '',
      date: '',
      description: '',
    };
    onChange({
      ...resume,
      awards: [...(resume.awards || []), newItem],
    });
  };

  const updateAward = (id: string, field: keyof AwardItem, value: string) => {
    onChange({
      ...resume,
      awards: (resume.awards || []).map(a => (a.id === id ? { ...a, [field]: value } : a)),
    });
  };

  const deleteAward = (id: string) => {
    onChange({
      ...resume,
      awards: (resume.awards || []).filter(a => a.id !== id),
    });
  };

  // Publications
  const addPublication = () => {
    const newItem: PublicationItem = {
      id: 'pub-' + Math.random().toString(36).substring(2, 9),
      title: '',
      publisher: '',
      date: '',
      url: '',
    };
    onChange({
      ...resume,
      publications: [...(resume.publications || []), newItem],
    });
  };

  const updatePublication = (id: string, field: keyof PublicationItem, value: string) => {
    onChange({
      ...resume,
      publications: (resume.publications || []).map(p => (p.id === id ? { ...p, [field]: value } : p)),
    });
  };

  const deletePublication = (id: string) => {
    onChange({
      ...resume,
      publications: (resume.publications || []).filter(p => p.id !== id),
    });
  };

  // Volunteer
  const addVolunteer = () => {
    const newItem: VolunteerItem = {
      id: 'vol-' + Math.random().toString(36).substring(2, 9),
      role: '',
      organization: '',
      duration: '',
      description: '',
    };
    onChange({
      ...resume,
      volunteer: [...(resume.volunteer || []), newItem],
    });
  };

  const updateVolunteer = (id: string, field: keyof VolunteerItem, value: string) => {
    onChange({
      ...resume,
      volunteer: (resume.volunteer || []).map(v => (v.id === id ? { ...v, [field]: value } : v)),
    });
  };

  const deleteVolunteer = (id: string) => {
    onChange({
      ...resume,
      volunteer: (resume.volunteer || []).filter(v => v.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Internships Section */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              Internships
            </h4>
            <p className="text-[11px] text-slate-500">Valuable for students, freshers, and early-career pros.</p>
          </div>
          <button
            type="button"
            onClick={addInternship}
            className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            + Add Internship
          </button>
        </div>

        {(resume.internships || []).map(item => (
          <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800">{item.position || 'Internship'}</span>
              <button
                type="button"
                onClick={() => deleteInternship(item.id)}
                className="text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Role / Title"
                value={item.position}
                onChange={e => updateInternship(item.id, 'position', e.target.value)}
                className="px-2 py-1 text-xs border border-slate-200 rounded bg-white"
              />
              <input
                type="text"
                placeholder="Company / Organization"
                value={item.organization}
                onChange={e => updateInternship(item.id, 'organization', e.target.value)}
                className="px-2 py-1 text-xs border border-slate-200 rounded bg-white"
              />
              <input
                type="text"
                placeholder="Duration (e.g. Jun 2023 - Aug 2023)"
                value={item.duration}
                onChange={e => updateInternship(item.id, 'duration', e.target.value)}
                className="col-span-2 px-2 py-1 text-xs border border-slate-200 rounded bg-white"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Honors & Awards Section */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              Honors & Awards
            </h4>
            <p className="text-[11px] text-slate-500">Hackathons, academic dean’s list, or professional accolades.</p>
          </div>
          <button
            type="button"
            onClick={addAward}
            className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            + Add Award
          </button>
        </div>

        {(resume.awards || []).map(a => (
          <div key={a.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800">{a.title || 'New Award'}</span>
              <button
                type="button"
                onClick={() => deleteAward(a.id)}
                className="text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Award Title"
                value={a.title}
                onChange={e => updateAward(a.id, 'title', e.target.value)}
                className="px-2 py-1 text-xs border border-slate-200 rounded bg-white"
              />
              <input
                type="text"
                placeholder="Granting Organization"
                value={a.issuer}
                onChange={e => updateAward(a.id, 'issuer', e.target.value)}
                className="px-2 py-1 text-xs border border-slate-200 rounded bg-white"
              />
              <input
                type="text"
                placeholder="Year / Date"
                value={a.date}
                onChange={e => updateAward(a.id, 'date', e.target.value)}
                className="px-2 py-1 text-xs border border-slate-200 rounded bg-white"
              />
              <input
                type="text"
                placeholder="Short Description (Optional)"
                value={a.description || ''}
                onChange={e => updateAward(a.id, 'description', e.target.value)}
                className="px-2 py-1 text-xs border border-slate-200 rounded bg-white"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Publications Section */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-violet-500" />
              Publications & Research
            </h4>
            <p className="text-[11px] text-slate-500">Peer-reviewed papers, conference proceedings, or industry articles.</p>
          </div>
          <button
            type="button"
            onClick={addPublication}
            className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            + Add Publication
          </button>
        </div>

        {(resume.publications || []).map(p => (
          <div key={p.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800">{p.title || 'Publication'}</span>
              <button
                type="button"
                onClick={() => deletePublication(p.id)}
                className="text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Paper or Article Title"
                value={p.title}
                onChange={e => updatePublication(p.id, 'title', e.target.value)}
                className="col-span-2 px-2 py-1 text-xs border border-slate-200 rounded bg-white"
              />
              <input
                type="text"
                placeholder="Journal / Publisher / Conference"
                value={p.publisher}
                onChange={e => updatePublication(p.id, 'publisher', e.target.value)}
                className="px-2 py-1 text-xs border border-slate-200 rounded bg-white"
              />
              <input
                type="text"
                placeholder="Year / Date"
                value={p.date}
                onChange={e => updatePublication(p.id, 'date', e.target.value)}
                className="px-2 py-1 text-xs border border-slate-200 rounded bg-white"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Volunteer Section */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-rose-500" />
              Volunteer & Community Leadership
            </h4>
            <p className="text-[11px] text-slate-500">Community outreach, mentoring, or non-profit contributions.</p>
          </div>
          <button
            type="button"
            onClick={addVolunteer}
            className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            + Add Volunteer
          </button>
        </div>

        {(resume.volunteer || []).map(v => (
          <div key={v.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800">{v.role || 'Volunteer Role'}</span>
              <button
                type="button"
                onClick={() => deleteVolunteer(v.id)}
                className="text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Role / Title"
                value={v.role}
                onChange={e => updateVolunteer(v.id, 'role', e.target.value)}
                className="px-2 py-1 text-xs border border-slate-200 rounded bg-white"
              />
              <input
                type="text"
                placeholder="Organization"
                value={v.organization}
                onChange={e => updateVolunteer(v.id, 'organization', e.target.value)}
                className="px-2 py-1 text-xs border border-slate-200 rounded bg-white"
              />
              <input
                type="text"
                placeholder="Duration (e.g. 2021 – 2023)"
                value={v.duration}
                onChange={e => updateVolunteer(v.id, 'duration', e.target.value)}
                className="col-span-2 px-2 py-1 text-xs border border-slate-200 rounded bg-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
