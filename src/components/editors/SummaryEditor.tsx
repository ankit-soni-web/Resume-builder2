import React from 'react';
import { Sparkles, HelpCircle, CheckCircle } from 'lucide-react';

interface Props {
  summary: string;
  onChange: (summary: string) => void;
  onOpenAIModal?: () => void;
}

export const SummaryEditor: React.FC<Props> = ({ summary, onChange, onOpenAIModal }) => {
  const words = summary ? summary.trim().split(/\s+/).filter(Boolean).length : 0;
  const isOptimal = words >= 30 && words <= 95;

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Professional Summary</h3>
          <p className="text-xs text-slate-500">
            A high-impact 3–4 sentence elevator pitch summarizing your career value.
          </p>
        </div>
        {onOpenAIModal && (
          <button
            type="button"
            onClick={onOpenAIModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            AI Generator
          </button>
        )}
      </div>

      <div className="relative">
        <textarea
          rows={5}
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Versatile Senior Full-Stack Engineer with 7+ years of expertise in distributed cloud architectures, real-time web applications, and resilient microservices. Proven success leading engineering squads to improve system throughput by 42%..."
          className="w-full p-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white leading-relaxed text-slate-800"
        />
        
        <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className={`font-medium ${isOptimal ? 'text-green-600 flex items-center gap-1' : 'text-slate-500'}`}>
              {isOptimal && <CheckCircle className="w-3 h-3 text-green-600" />}
              {words} words
            </span>
            <span className="text-slate-400">({isOptimal ? 'Optimal ATS length' : 'Aim for 35–90 words'})</span>
          </div>
          <span className="text-slate-400">{summary.length} characters</span>
        </div>
      </div>

      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-xs text-slate-600">
        <span className="font-semibold text-slate-800 block mb-1">💡 Professional Summary Writing Guide:</span>
        <ul className="space-y-1 list-disc list-inside text-slate-600">
          <li><strong>Sentence 1:</strong> Title + years of experience + top domain specializations.</li>
          <li><strong>Sentence 2:</strong> Core technical competencies and methodology strengths.</li>
          <li><strong>Sentence 3:</strong> Quantified major career accomplishment or business impact.</li>
        </ul>
      </div>
    </div>
  );
};
