import React, { useState } from 'react';
import { ExperienceItem } from '../../types/resume';
import { Plus, Trash2, ChevronUp, ChevronDown, Sparkles, Briefcase, Calendar, MapPin, Check, Loader2 } from 'lucide-react';
import { improveBulletPoint } from '../../services/aiService';

interface Props {
  items: ExperienceItem[];
  onChange: (items: ExperienceItem[]) => void;
}

export const ExperienceEditor: React.FC<Props> = ({ items, onChange }) => {
  const [activeAiBullet, setActiveAiBullet] = useState<{ expId: string; bulletIdx: number } | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<{ style: string; text: string }[] | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: 'exp-' + Math.random().toString(36).substring(2, 9),
      role: '',
      company: '',
      employmentType: 'Full-time',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: [''],
      achievements: '',
    };
    onChange([...items, newItem]);
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const deleteExperience = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    onChange(newItems);
  };

  // Bullet manipulation
  const addBullet = (expId: string) => {
    onChange(
      items.map((item) => {
        if (item.id === expId) {
          return { ...item, bullets: [...item.bullets, ''] };
        }
        return item;
      })
    );
  };

  const updateBullet = (expId: string, bulletIdx: number, text: string) => {
    onChange(
      items.map((item) => {
        if (item.id === expId) {
          const newBullets = [...item.bullets];
          newBullets[bulletIdx] = text;
          return { ...item, bullets: newBullets };
        }
        return item;
      })
    );
  };

  const deleteBullet = (expId: string, bulletIdx: number) => {
    onChange(
      items.map((item) => {
        if (item.id === expId) {
          const newBullets = item.bullets.filter((_, i) => i !== bulletIdx);
          return { ...item, bullets: newBullets.length ? newBullets : [''] };
        }
        return item;
      })
    );
  };

  const handleAiPolishBullet = async (exp: ExperienceItem, bulletIdx: number) => {
    const rawText = exp.bullets[bulletIdx];
    if (!rawText || !rawText.trim()) return;

    setActiveAiBullet({ expId: exp.id, bulletIdx });
    setLoadingAi(true);
    setAiSuggestions(null);

    try {
      const res = await improveBulletPoint({
        rawText,
        role: exp.role,
        company: exp.company,
      });
      if (res && res.improvedBullets) {
        setAiSuggestions(res.improvedBullets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  const applyAiBullet = (expId: string, bulletIdx: number, newText: string) => {
    updateBullet(expId, bulletIdx, newText);
    setActiveAiBullet(null);
    setAiSuggestions(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Work Experience</h3>
          <p className="text-xs text-slate-500">Highlight career milestones with strong action verbs and quantified metrics.</p>
        </div>
        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Role
        </button>
      </div>

      {items.length === 0 && (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">No work experience entries added yet</p>
          <p className="text-[11px] text-slate-500 mt-0.5 mb-3">Add full-time, part-time, or contract positions.</p>
          <button
            type="button"
            onClick={addExperience}
            className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer"
          >
            + Add First Position
          </button>
        </div>
      )}

      <div className="space-y-4">
        {items.map((exp, index) => (
          <div
            key={exp.id}
            className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3 relative group"
          >
            {/* Header / Reorder */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[11px]">
                  {index + 1}
                </span>
                {exp.role || 'New Position'} {exp.company ? `@ ${exp.company}` : ''}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveExperience(index, 'up')}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                  title="Move Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={index === items.length - 1}
                  onClick={() => moveExperience(index, 'down')}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteExperience(exp.id)}
                  className="p-1 text-slate-400 hover:text-red-600 cursor-pointer ml-1"
                  title="Delete Position"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Job Title *</label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Company / Organization *</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="e.g. Stripe, Google, Acme Corp"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Employment Type</label>
                <select
                  value={exp.employmentType}
                  onChange={(e) => updateExperience(exp.id, 'employmentType', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Location</label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                  placeholder="e.g. San Francisco, CA / Remote"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Start Date</label>
                <input
                  type="text"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  placeholder="e.g. 2022-03 or Mar 2022"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-700">End Date</label>
                  <label className="flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    Current Role
                  </label>
                </div>
                <input
                  type="text"
                  disabled={exp.current}
                  value={exp.current ? 'Present' : exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  placeholder="e.g. 2024-05 or Present"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>
            </div>

            {/* Bullet Points */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-800">
                  Responsibilities & Achievements (STAR Method)
                </label>
                <button
                  type="button"
                  onClick={() => addBullet(exp.id)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Bullet
                </button>
              </div>

              <div className="space-y-2">
                {exp.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="space-y-1">
                    <div className="flex items-start gap-1.5">
                      <span className="text-slate-400 mt-2 text-xs">•</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => updateBullet(exp.id, bIdx, e.target.value)}
                        placeholder="e.g. Spearheaded redesign of customer portal in React, increasing user conversion by 28%..."
                        className="flex-1 p-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800"
                      />
                      <div className="flex flex-col gap-1 pt-0.5">
                        <button
                          type="button"
                          onClick={() => handleAiPolishBullet(exp, bIdx)}
                          title="Improve with AI (Action Verbs & Impact)"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-md transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteBullet(exp.id, bIdx)}
                          title="Remove bullet"
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-md cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* AI Suggestions dropdown when active */}
                    {activeAiBullet?.expId === exp.id && activeAiBullet?.bulletIdx === bIdx && (
                      <div className="ml-5 p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs space-y-2 animate-fadeIn">
                        <div className="flex items-center justify-between text-blue-900 font-semibold text-[11px]">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            AI Suggested STAR Improvements:
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveAiBullet(null);
                              setAiSuggestions(null);
                            }}
                            className="text-slate-500 hover:text-slate-800"
                          >
                            Close
                          </button>
                        </div>

                        {loadingAi ? (
                          <div className="flex items-center gap-2 text-blue-700 py-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Optimizing bullet with action verbs and metrics...</span>
                          </div>
                        ) : aiSuggestions ? (
                          <div className="space-y-1.5">
                            {aiSuggestions.map((sug, sIdx) => (
                              <div
                                key={sIdx}
                                className="p-2 bg-white rounded border border-blue-100 flex items-start justify-between gap-2 hover:border-blue-300 transition-colors"
                              >
                                <div>
                                  <span className="text-[10px] font-bold text-blue-600 block uppercase">
                                    {sug.style}
                                  </span>
                                  <p className="text-slate-800 text-xs mt-0.5">{sug.text}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => applyAiBullet(exp.id, bIdx, sug.text)}
                                  className="px-2 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" /> Use
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Outcome / Achievement */}
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Key Outcome / Notable Recognition (Optional)
              </label>
              <input
                type="text"
                value={exp.achievements || ''}
                onChange={(e) => updateExperience(exp.id, 'achievements', e.target.value)}
                placeholder="e.g. Awarded Innovator of the Year for zero-downtime database migration"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
