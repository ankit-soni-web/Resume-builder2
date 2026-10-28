import React, { useState } from 'react';
import { TEMPLATES } from '../data/templates';
import { TemplateId, TemplateInfo, Resume } from '../types/resume';
import { ResumeRenderer } from '../templates/ResumeRenderer';
import { Layers, Check, Search, Filter, ShieldCheck, Eye, ArrowRight, X } from 'lucide-react';

interface Props {
  currentResume: Resume;
  onSelectTemplate: (templateId: TemplateId) => void;
  onNavigate: (page: string) => void;
}

export const TemplatesPage: React.FC<Props> = ({ currentResume, onSelectTemplate, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLayout, setSelectedLayout] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateInfo | null>(null);

  const categories = ['All', 'ATS', 'Modern', 'Executive', 'Technical', 'Entry Level', 'Creative'];
  const layouts = ['All', 'single-column', 'two-column'];

  const filteredTemplates = TEMPLATES.filter((tmpl) => {
    const matchesCategory = selectedCategory === 'All' || tmpl.category === selectedCategory;
    const matchesLayout = selectedLayout === 'All' || tmpl.layout === selectedLayout;
    const matchesSearch =
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.bestFor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLayout && matchesSearch;
  });

  const handleApplyTemplate = (id: TemplateId) => {
    onSelectTemplate(id);
    onNavigate('editor');
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-800 pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-1">
              Template Gallery
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              8 Professional Resume Layouts
            </h1>
            <p className="text-sm text-slate-600 mt-2">
              Every layout is engineered with distinct hierarchy, typography, and spacing. Switch anytime without losing your information.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates or roles..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#14213D] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((tmpl) => {
            const isCurrentlyActive = currentResume.design.templateId === tmpl.id;

            return (
              <div
                key={tmpl.id}
                className={`bg-white rounded-2xl border transition-all shadow-xs hover:shadow-lg flex flex-col justify-between overflow-hidden group ${
                  isCurrentlyActive ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div>
                  {/* Visual Preview Box */}
                  <div className="h-56 bg-slate-50 border-b border-slate-100 p-4 relative flex flex-col justify-between overflow-hidden group-hover:bg-slate-100/50 transition-colors">
                    <div className="flex items-center justify-between z-10">
                      <span className="w-3.5 h-3.5 rounded-full shadow-2xs" style={{ backgroundColor: tmpl.accentColor }}></span>
                      <div className="flex items-center gap-1">
                        {tmpl.isAtsFriendly && (
                          <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 shadow-2xs">
                            ATS Friendly
                          </span>
                        )}
                        {isCurrentlyActive && (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            Current
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Miniature Layout Representation */}
                    <div className="py-2 px-1 opacity-75 space-y-2">
                      {tmpl.layout === 'two-column' ? (
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1.5 border-r border-slate-200 pr-1">
                            <div className="h-2 w-3/4 rounded bg-slate-400"></div>
                            <div className="h-1.5 w-full rounded bg-slate-200"></div>
                            <div className="h-1.5 w-5/6 rounded bg-slate-200"></div>
                            <div className="h-1.5 w-2/3 rounded bg-slate-200"></div>
                          </div>
                          <div className="col-span-2 space-y-1.5">
                            <div className="h-2.5 w-1/2 rounded bg-slate-700"></div>
                            <div className="h-1.5 w-full rounded bg-slate-200"></div>
                            <div className="h-1.5 w-full rounded bg-slate-200"></div>
                            <div className="h-1.5 w-4/5 rounded bg-slate-200"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="h-3 w-1/3 rounded bg-slate-700"></div>
                            <div className="h-1.5 w-1/4 rounded bg-slate-300"></div>
                          </div>
                          <div className="h-1 w-full rounded bg-slate-200"></div>
                          <div className="h-1.5 w-full rounded bg-slate-200"></div>
                          <div className="h-1.5 w-11/12 rounded bg-slate-200"></div>
                          <div className="h-1.5 w-3/4 rounded bg-slate-200"></div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span className="capitalize">{tmpl.layout}</span>
                      <span>{tmpl.category}</span>
                    </div>

                    {/* Hover Quick Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(tmpl)}
                      className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs font-bold text-white cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      Quick Live Preview
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {tmpl.name}
                    </h3>
                    <p className="text-xs text-blue-600 font-medium">
                      {tmpl.tagline}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {tmpl.description}
                    </p>
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Best Suited For</span>
                      <p className="text-xs text-slate-700 font-medium mt-0.5">{tmpl.bestFor}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl.id)}
                    className="w-full py-2.5 text-xs font-bold text-white bg-[#14213D] hover:bg-blue-600 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Use This Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Live Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Live Preview: {previewTemplate.name}
                </h3>
                <p className="text-xs text-slate-500">Rendered with your active resume details</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleApplyTemplate(previewTemplate.id);
                    setPreviewTemplate(null);
                  }}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                >
                  Apply & Edit This Template
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-slate-100 flex justify-center">
              <ResumeRenderer
                resume={{
                  ...currentResume,
                  design: {
                    ...currentResume.design,
                    templateId: previewTemplate.id,
                  },
                }}
                scale={0.8}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
