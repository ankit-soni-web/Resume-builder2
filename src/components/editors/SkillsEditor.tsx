import React, { useState } from 'react';
import { SkillItem } from '../../types/resume';
import { Plus, X, Sparkles, Loader2, Wrench } from 'lucide-react';
import { suggestSkills } from '../../services/aiService';

interface Props {
  items: SkillItem[];
  onChange: (items: SkillItem[]) => void;
  targetRole?: string;
}

export const SkillsEditor: React.FC<Props> = ({ items, onChange, targetRole }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'technical' | 'soft' | 'tools' | 'languages'>('all');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'technical' | 'soft' | 'tools' | 'languages'>('technical');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Advanced');

  const [loadingAi, setLoadingAi] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    technical: string[];
    soft: string[];
    tools: string[];
  } | null>(null);

  const addSkill = (name?: string, category?: 'technical' | 'soft' | 'tools' | 'languages') => {
    const skillNameToAdd = name || newSkillName;
    if (!skillNameToAdd || !skillNameToAdd.trim()) return;

    // Check duplicate
    if (items.some(s => s.name.toLowerCase() === skillNameToAdd.trim().toLowerCase())) {
      setNewSkillName('');
      return;
    }

    const newSkill: SkillItem = {
      id: 'sk-' + Math.random().toString(36).substring(2, 9),
      name: skillNameToAdd.trim(),
      category: category || newSkillCategory,
      level: newSkillLevel,
    };

    onChange([...items, newSkill]);
    setNewSkillName('');
  };

  const removeSkill = (id: string) => {
    onChange(items.filter(s => s.id !== id));
  };

  const updateLevel = (id: string, level: SkillItem['level']) => {
    onChange(
      items.map(s => (s.id === id ? { ...s, level } : s))
    );
  };

  const handleSuggestSkills = async () => {
    setLoadingAi(true);
    setAiSuggestions(null);
    try {
      const res = await suggestSkills({
        targetRole: targetRole || 'Software Professional',
        existingSkills: items.map(s => s.name).join(', '),
      });
      if (res) {
        setAiSuggestions({
          technical: res.technical || [],
          soft: res.soft || [],
          tools: res.tools || [],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  const filteredSkills = activeCategory === 'all'
    ? items
    : items.filter(s => s.category === activeCategory);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Skills & Competencies</h3>
          <p className="text-xs text-slate-500">Group key competencies by category for ATS keyword matching.</p>
        </div>
        <button
          type="button"
          onClick={handleSuggestSkills}
          disabled={loadingAi}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer disabled:opacity-50"
        >
          {loadingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" /> : <Sparkles className="w-3.5 h-3.5 text-blue-600" />}
          Suggest Skills
        </button>
      </div>

      {/* AI Suggestions Box */}
      {aiSuggestions && (
        <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-blue-900">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Suggested Competencies for {targetRole || 'Your Role'}:
            </span>
            <button
              type="button"
              onClick={() => setAiSuggestions(null)}
              className="text-slate-400 hover:text-slate-700 text-[11px]"
            >
              Dismiss
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {aiSuggestions.technical.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Technical Skills</span>
                <div className="flex flex-wrap gap-1">
                  {aiSuggestions.technical.map((sk, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => addSkill(sk, 'technical')}
                      className="px-2 py-0.5 bg-white hover:bg-blue-600 hover:text-white border border-blue-200 rounded text-slate-700 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                    >
                      + {sk}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {aiSuggestions.tools.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Tools & Platforms</span>
                <div className="flex flex-wrap gap-1">
                  {aiSuggestions.tools.map((sk, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => addSkill(sk, 'tools')}
                      className="px-2 py-0.5 bg-white hover:bg-blue-600 hover:text-white border border-blue-200 rounded text-slate-700 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                    >
                      + {sk}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {aiSuggestions.soft.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Soft & Leadership Skills</span>
                <div className="flex flex-wrap gap-1">
                  {aiSuggestions.soft.map((sk, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => addSkill(sk, 'soft')}
                      className="px-2 py-0.5 bg-white hover:bg-blue-600 hover:text-white border border-blue-200 rounded text-slate-700 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                    >
                      + {sk}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Skill Form */}
      <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2.5">
        <span className="text-xs font-semibold text-slate-800 block">Add New Competency</span>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="e.g. React, Docker, Python, Agile..."
            className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />

          <select
            value={newSkillCategory}
            onChange={(e) => setNewSkillCategory(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500"
          >
            <option value="technical">Technical</option>
            <option value="tools">Tools & Cloud</option>
            <option value="soft">Soft Skills</option>
            <option value="languages">Languages</option>
          </select>

          <select
            value={newSkillLevel}
            onChange={(e) => setNewSkillLevel(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>

          <button
            type="button"
            onClick={() => addSkill()}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 pb-1">
        {(['all', 'technical', 'tools', 'soft', 'languages'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer capitalize ${
              activeCategory === cat
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat} ({cat === 'all' ? items.length : items.filter(s => s.category === cat).length})
          </button>
        ))}
      </div>

      {/* Skill Badges Grid */}
      <div className="flex flex-wrap gap-2 pt-1">
        {filteredSkills.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-1.5 bg-white border border-slate-200/90 shadow-2xs pl-2.5 pr-1.5 py-1 rounded-lg text-xs"
          >
            <span className="font-medium text-slate-800">{s.name}</span>
            <select
              value={s.level || 'Advanced'}
              onChange={(e) => updateLevel(s.id, e.target.value as any)}
              className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200 rounded px-1 py-0.5 focus:outline-none"
            >
              <option value="Beginner">Beg</option>
              <option value="Intermediate">Int</option>
              <option value="Advanced">Adv</option>
              <option value="Expert">Exp</option>
            </select>
            <button
              type="button"
              onClick={() => removeSkill(s.id)}
              className="p-0.5 text-slate-400 hover:text-red-500 rounded cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
