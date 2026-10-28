import React from 'react';
import { EducationItem } from '../../types/resume';
import { Plus, Trash2, ChevronUp, ChevronDown, GraduationCap } from 'lucide-react';

interface Props {
  items: EducationItem[];
  onChange: (items: EducationItem[]) => void;
}

export const EducationEditor: React.FC<Props> = ({ items, onChange }) => {
  const addEducation = () => {
    const newItem: EducationItem = {
      id: 'edu-' + Math.random().toString(36).substring(2, 9),
      degree: '',
      institution: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      grade: '',
      coursework: '',
    };
    onChange([...items, newItem]);
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const deleteEducation = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const moveEducation = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Education</h3>
          <p className="text-xs text-slate-500">Degrees, colleges, academic honors, and coursework.</p>
        </div>
        <button
          type="button"
          onClick={addEducation}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Degree
        </button>
      </div>

      {items.length === 0 && (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">No education entries added yet</p>
          <p className="text-[11px] text-slate-500 mt-0.5 mb-3">Add undergraduate or graduate qualifications.</p>
          <button
            type="button"
            onClick={addEducation}
            className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer"
          >
            + Add First Degree
          </button>
        </div>
      )}

      <div className="space-y-4">
        {items.map((edu, index) => (
          <div key={edu.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[11px]">
                  {index + 1}
                </span>
                {edu.degree || 'Degree / Qualification'}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveEducation(index, 'up')}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={index === items.length - 1}
                  onClick={() => moveEducation(index, 'down')}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteEducation(edu.id)}
                  className="p-1 text-slate-400 hover:text-red-600 cursor-pointer ml-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Degree / Qualification *</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">College / University *</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  placeholder="e.g. University of Washington, Stanford"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Field of Study / Major</label>
                <input
                  type="text"
                  value={edu.fieldOfStudy}
                  onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                  placeholder="e.g. Software Systems, Artificial Intelligence"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Grade / CGPA / Honors</label>
                <input
                  type="text"
                  value={edu.grade}
                  onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)}
                  placeholder="e.g. 3.85 / 4.0 (Magna Cum Laude)"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Start Year</label>
                <input
                  type="text"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  placeholder="e.g. 2018 or Sep 2018"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Graduation Year</label>
                <input
                  type="text"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  placeholder="e.g. 2022 or May 2022"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Relevant Coursework</label>
                <input
                  type="text"
                  value={edu.coursework}
                  onChange={(e) => updateEducation(edu.id, 'coursework', e.target.value)}
                  placeholder="e.g. Distributed Systems, Algorithms, Machine Learning, Operating Systems"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
