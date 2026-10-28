import React, { useState } from 'react';
import { Resume, ATSAnalysisResult } from '../types/resume';
import { analyzeResumeForATS } from '../services/atsChecker';
import { tailorResume } from '../services/aiService';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, FileText, Target, Loader2, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  resume: Resume;
}

export const ATSCheckerModal: React.FC<Props> = ({ isOpen, onClose, resume }) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'tailor' | 'keywords'>('audit');
  const [jobDescription, setJobDescription] = useState('');
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailorResult, setTailorResult] = useState<any>(null);

  if (!isOpen) return null;

  const analysis: ATSAnalysisResult = analyzeResumeForATS(resume);

  const handleRunTailor = async () => {
    if (!jobDescription.trim()) return;
    setIsTailoring(true);
    try {
      const resumeContent = [
        resume.personalInfo.fullName,
        resume.personalInfo.jobTitle,
        resume.summary,
        ...resume.experience.flatMap(e => [e.role, e.company, ...e.bullets]),
        ...resume.skills.map(s => s.name),
        ...resume.projects.map(p => `${p.title} ${p.description}`),
      ].join('\n');

      const result = await tailorResume({
        resumeText: resumeContent,
        jobDescription,
      });
      setTailorResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTailoring(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 55) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-fadeIn">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">ATS Readiness & Resume Quality Audit</h2>
              <p className="text-xs text-slate-500">Applicant Tracking System verification & rule-based parser tests</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 border-b border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Comprehensive Audit ({analysis.overallScore}/100)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tailor')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tailor'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Target className="w-4 h-4" />
            Match Job Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('keywords')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'keywords'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Action Verbs & Vocabulary
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'audit' && (
            <>
              {/* Scorecard Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${getScoreColor(analysis.overallScore)}`}>
                  <span className="text-3xl font-extrabold">{analysis.overallScore}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider mt-0.5">
                    {analysis.rating}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">Overall ATS Index</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col justify-center">
                  <span className="text-xl font-bold text-slate-900">{analysis.passedCount} / {analysis.totalChecks}</span>
                  <span className="text-[11px] text-slate-500 font-medium">Core Rules Passed</span>
                  <span className="text-[10px] text-slate-400 mt-1">Structure & syntax</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col justify-center">
                  <span className="text-xl font-bold text-slate-900">{analysis.metricsCount}</span>
                  <span className="text-[11px] text-slate-500 font-medium">Measurable Outcomes</span>
                  <span className="text-[10px] text-slate-400 mt-1">%, $, or quantitative scales</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col justify-center">
                  <span className="text-xl font-bold text-slate-900">{analysis.actionVerbsFound.length}</span>
                  <span className="text-[11px] text-slate-500 font-medium">Strong Action Verbs</span>
                  <span className="text-[10px] text-slate-400 mt-1">Leadership verbs</span>
                </div>
              </div>

              {/* Score Meaning Disclaimer */}
              <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-xl text-xs text-blue-900">
                <strong>About this ATS Score:</strong> This index measures structural readability, keyword completeness, action verb density, and formatting compatibility against standard parsing engines (Workday, Greenhouse, Lever, Taleo). It serves as a quality guide and does not guarantee employer hiring decisions.
              </div>

              {/* Checklist items */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Detailed Diagnostic Checklist
                </h3>
                {analysis.items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                      item.passed
                        ? 'bg-white border-slate-200'
                        : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {item.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{item.title}</span>
                          <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded uppercase ${
                            item.category === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{item.message}</p>
                        {!item.passed && (
                          <p className="text-[11px] text-rose-800 font-medium mt-1 bg-rose-50 p-1.5 rounded">
                            👉 Recommendation: {item.recommendation}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500 shrink-0">
                      {item.score} / {item.maxScore}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'tailor' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Paste Target Job Description
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Paste the job posting requirements to compare your resume's keywords and detect skill gaps.
                </p>
                <textarea
                  rows={5}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job requirements, qualifications, and role description here..."
                  className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white leading-relaxed"
                />
                <button
                  type="button"
                  onClick={handleRunTailor}
                  disabled={isTailoring || !jobDescription.trim()}
                  className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isTailoring ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing Alignment...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyze Match & Suggest Additions
                    </>
                  )}
                </button>
              </div>

              {tailorResult && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Job Description Match Analysis</span>
                      <span className="text-[11px] text-slate-500">
                        Evaluated via {tailorResult.provider === 'gemini' ? 'Gemini 3.8 Flash' : 'Smart Rule Engine'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-blue-600">{tailorResult.matchScore}%</span>
                      <span className="text-[10px] text-slate-500 block">Keyword Overlap</span>
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-1.5">
                      ⚠️ Missing High-Priority Keywords:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tailorResult.missingKeywords?.map((kw: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 rounded-md"
                        >
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-1.5">
                      Recommended Bullet & Section Tweaks:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {tailorResult.recommendations?.map((rec: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Positive Matches */}
                  {tailorResult.positiveMatches && (
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-xs font-bold text-green-800 block mb-1">
                        ✅ Strong Aligned Competencies:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {tailorResult.positiveMatches.map((m: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'keywords' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                  Active Leadership Verbs Detected ({analysis.actionVerbsFound.length})
                </h4>
                <p className="text-xs text-slate-500 mb-2.5">
                  Strong action verbs signal accountability, ownership, and measurable business outcomes.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.actionVerbsFound.map((v, i) => (
                    <span key={i} className="px-2 py-1 bg-green-50 border border-green-200 text-green-800 rounded text-xs font-medium capitalize">
                      ✓ {v}
                    </span>
                  ))}
                </div>
              </div>

              {analysis.weakWordsFound.length > 0 && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                  <h4 className="text-xs font-bold text-amber-900 mb-1">
                    ⚠️ Passive or Weak Phrases Flagged:
                  </h4>
                  <p className="text-xs text-amber-800 mb-2">
                    Replace these phrases with direct leadership verbs:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.weakWordsFound.map((w, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-amber-300 text-amber-900 rounded text-xs font-medium">
                        "{w}"
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
};
