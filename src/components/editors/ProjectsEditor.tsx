import React from 'react';
import { ProjectItem } from '../../types/resume';
import { Plus, Trash2, ChevronUp, ChevronDown, FolderGit2 } from 'lucide-react';

interface Props {
  items: ProjectItem[];
  onChange: (items: ProjectItem[]) => void;
}

export const ProjectsEditor: React.FC<Props> = ({ items, onChange }) => {
  const addProject = () => {
    const newItem: ProjectItem = {
      id: 'proj-' + Math.random().toString(36).substring(2, 9),
      title: '',
      description: '',
      technologies: [],
      projectUrl: '',
      githubUrl: '',
      outcome: '',
    };
    onChange([...items, newItem]);
  };

  const updateProject = (id: string, field: keyof ProjectItem, value: any) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const deleteProject = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
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
          <h3 className="text-sm font-bold text-slate-900">Notable Projects</h3>
          <p className="text-xs text-slate-500">Showcase technical architecture, open source contributions, and results.</p>
        </div>
        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Project
        </button>
      </div>

      {items.length === 0 && (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <FolderGit2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">No projects added yet</p>
          <p className="text-[11px] text-slate-500 mt-0.5 mb-3">Add side projects, capstones, or open-source software.</p>
          <button
            type="button"
            onClick={addProject}
            className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer"
          >
            + Add First Project
          </button>
        </div>
      )}

      <div className="space-y-4">
        {items.map((proj, index) => (
          <div key={proj.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[11px]">
                  {index + 1}
                </span>
                {proj.title || 'New Project'}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveProject(index, 'up')}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={index === items.length - 1}
                  onClick={() => moveProject(index, 'down')}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteProject(proj.id)}
                  className="p-1 text-slate-400 hover:text-red-600 cursor-pointer ml-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Project Title *</label>
                <input
                  type="text"
                  value={proj.title}
                  onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                  placeholder="e.g. HyperQueue — Distributed Task Broker"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Live Demo / App URL</label>
                <input
                  type="text"
                  value={proj.projectUrl || ''}
                  onChange={(e) => updateProject(proj.id, 'projectUrl', e.target.value)}
                  placeholder="https://myproject.app"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">GitHub / Source Repo</label>
                <input
                  type="text"
                  value={proj.githubUrl || ''}
                  onChange={(e) => updateProject(proj.id, 'githubUrl', e.target.value)}
                  placeholder="github.com/user/project"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Technologies Used (Comma-separated)
                </label>
                <input
                  type="text"
                  value={proj.technologies ? proj.technologies.join(', ') : ''}
                  onChange={(e) => {
                    const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    updateProject(proj.id, 'technologies', arr);
                  }}
                  placeholder="e.g. React, TypeScript, Node.js, PostgreSQL, Docker"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={proj.description}
                  onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                  placeholder="Describe the problem, architectural choices, and what it achieves..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Measurable Impact / Outcome (e.g. Users, Stars, Latency)
                </label>
                <input
                  type="text"
                  value={proj.outcome || ''}
                  onChange={(e) => updateProject(proj.id, 'outcome', e.target.value)}
                  placeholder="e.g. 850+ GitHub stars, processed 50,000 tasks/second in benchmarks"
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
