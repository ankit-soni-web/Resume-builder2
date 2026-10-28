import React, { useState, useEffect } from 'react';
import { Resume } from '../types/resume';
import { checkAIStatus, generateSummaries, improveBulletPoint, checkGrammar, suggestSkills, AIStatus } from '../services/aiService';
import { Sparkles, X, Check, Copy, CheckCheck, Loader2, BookCheck, ShieldAlert, Zap, Wrench } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  resume: Resume;
  onApplySummary?: (summary: string) => void;
  onApplyBullet?: (bullet: string) => void;
  onApplySkills?: (skills: string[], category: 'technical' | 'soft' | 'tools') => void;
}

export const AIAssistantModal: React.FC<Props> = ({
  isOpen,
  onClose,
  resume,
  onApplySummary,
  onApplyBullet,
  onApplySkills,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'bullets' | 'grammar' | 'skills'>('summary');
  const [aiStatus, setAiStatus] = useState<AIStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Summary state
  const [targetRole, setTargetRole] = useState(resume.personalInfo.jobTitle || '');
  const [summaryOptions, setSummaryOptions] = useState<{ title: string; summary: string }[]>([]);
  const [summaryProvider, setSummaryProvider] = useState<string>('');

  // Bullet state
  const [rawBullet, setRawBullet] = useState('');
  const [improvedBullets, setImprovedBullets] = useState<{ style: string; text: string }[]>([]);

  // Grammar state
  const [grammarText, setGrammarText] = useState(resume.summary || '');
  const [grammarResult, setGrammarResult] = useState<any>(null);

  // Skills state
  const [skillsRole, setSkillsRole] = useState(resume.personalInfo.jobTitle || '');
  const [suggestedSkills, setSuggestedSkills] = useState<{ technical: string[]; soft: string[]; tools: string[] } | null>(null);

  useEffect(() => {
    if (isOpen) {
      checkAIStatus().then(setAiStatus);
      if (!targetRole) setTargetRole(resume.personalInfo.jobTitle || '');
    }
  }, [isOpen, resume.personalInfo.jobTitle]);

  if (!isOpen) return null;

  const handleGenerateSummary = async () => {
    setLoading(true);
    setSummaryOptions([]);
    try {
      const skillsStr = resume.skills.map(s => s.name).slice(0, 8).join(', ');
      const expStr = resume.experience.slice(0, 2).map(e => `${e.role} at ${e.company}`).join('; ');
      const res = await generateSummaries({
        fullName: resume.personalInfo.fullName,
        jobTitle: resume.personalInfo.jobTitle,
        targetRole,
        skills: skillsStr,
        experience: expStr,
      });
      if (res && res.options) {
        setSummaryOptions(res.options);
        setSummaryProvider(res.provider);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImproveBullet = async () => {
    if (!rawBullet.trim()) return;
    setLoading(true);
    setImprovedBullets([]);
    try {
      const res = await improveBulletPoint({
        rawText: rawBullet,
        role: targetRole,
      });
      if (res && res.improvedBullets) {
        setImprovedBullets(res.improvedBullets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckGrammar = async () => {
    if (!grammarText.trim()) return;
    setLoading(true);
    try {
      const res = await checkGrammar(grammarText);
      setGrammarResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestSkills = async () => {
    setLoading(true);
    try {
      const res = await suggestSkills({
        targetRole: skillsRole,
        existingSkills: resume.skills.map(s => s.name).join(', '),
      });
      setSuggestedSkills(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-fadeIn">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">AI Resume Assistant</h2>
              <p className="text-xs text-slate-500">
                Generate summaries, refine bullet points, and check tone and clarity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {aiStatus && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                aiStatus.configured
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${aiStatus.configured ? 'bg-green-600' : 'bg-amber-600'}`}></span>
                {aiStatus.configured ? 'Gemini 3.8 Flash' : 'Smart Rule Engine'}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 px-5 border-b border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'summary'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Summary Generator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bullets')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bullets'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            Bullet Improver (STAR)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('grammar')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'grammar'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookCheck className="w-4 h-4" />
            Grammar & Tone Check
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'skills'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Skills Suggester
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: SUMMARY GENERATOR */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="Target Role (e.g. Senior Software Engineer)"
                  className="w-full sm:flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleGenerateSummary}
                  disabled={loading}
                  className="w-full sm:w-auto px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate Options
                </button>
              </div>

              {summaryOptions.length > 0 && (
                <div className="space-y-3 animate-fadeIn">
                  <span className="text-xs font-bold text-slate-800 block">
                    Choose Your Preferred Summary Style:
                  </span>
                  {summaryOptions.map((opt, i) => (
                    <div
                      key={i}
                      className="p-3.5 bg-white border border-slate-200 hover:border-blue-300 rounded-xl shadow-xs space-y-2 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                          {opt.title}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(opt.summary, i)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded text-xs flex items-center gap-1 cursor-pointer"
                            title="Copy to clipboard"
                          >
                            {copiedIdx === i ? <CheckCheck className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          {onApplySummary && (
                            <button
                              type="button"
                              onClick={() => {
                                onApplySummary(opt.summary);
                                onClose();
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md cursor-pointer flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Apply to Resume
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{opt.summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BULLET IMPROVER */}
          {activeTab === 'bullets' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Paste Raw Job Responsibility or Bullet:
                </label>
                <textarea
                  rows={3}
                  value={rawBullet}
                  onChange={(e) => setRawBullet(e.target.value)}
                  placeholder="e.g. Worked on the website and helped fix bugs in React..."
                  className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
                />
                <button
                  type="button"
                  onClick={handleImproveBullet}
                  disabled={loading || !rawBullet.trim()}
                  className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  Transform with STAR Method
                </button>
              </div>

              {improvedBullets.length > 0 && (
                <div className="space-y-3 animate-fadeIn">
                  <span className="text-xs font-bold text-slate-800 block">
                    Improved Action-Oriented Bullets:
                  </span>
                  {improvedBullets.map((b, i) => (
                    <div
                      key={i}
                      className="p-3 bg-white border border-slate-200 hover:border-blue-300 rounded-xl shadow-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-blue-600 uppercase">
                          {b.style}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(b.text, i + 10)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded text-xs"
                          >
                            {copiedIdx === i + 10 ? <CheckCheck className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-medium">{b.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GRAMMAR & TONE */}
          {activeTab === 'grammar' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Text to Proofread & Polish:
                </label>
                <textarea
                  rows={4}
                  value={grammarText}
                  onChange={(e) => setGrammarText(e.target.value)}
                  placeholder="Paste text here to review for passive voice, wordiness, and clarity..."
                  className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
                />
                <button
                  type="button"
                  onClick={handleCheckGrammar}
                  disabled={loading || !grammarText.trim()}
                  className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookCheck className="w-4 h-4" />}
                  Run Grammar & Clarity Check
                </button>
              </div>

              {grammarResult && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Diagnostics: {grammarResult.issuesCount || 0} Suggestion(s)
                    </span>
                  </div>

                  {grammarResult.suggestions && grammarResult.suggestions.length > 0 ? (
                    <div className="space-y-2">
                      {grammarResult.suggestions.map((s: any, idx: number) => (
                        <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="line-through text-rose-600 font-semibold">{s.original}</span>
                            <span>→</span>
                            <span className="text-green-700 font-bold">{s.replacement}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">{s.reason}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-green-700 font-medium">
                      ✓ No passive phrases or clarity issues detected in this snippet!
                    </p>
                  )}

                  {grammarResult.improvedVersion && (
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-xs font-bold text-slate-800 block mb-1">
                        Polished Version:
                      </span>
                      <p className="text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-200">
                        {grammarResult.improvedVersion}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SKILLS SUGGESTER */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={skillsRole}
                  onChange={(e) => setSkillsRole(e.target.value)}
                  placeholder="Target Role (e.g. Data Scientist, UX Designer)"
                  className="w-full sm:flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleSuggestSkills}
                  disabled={loading}
                  className="w-full sm:w-auto px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wrench className="w-4 h-4" />}
                  Fetch Industry Skills
                </button>
              </div>

              {suggestedSkills && (
                <div className="space-y-3 animate-fadeIn">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-1">
                      Technical Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedSkills.technical?.map((sk, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-md"
                        >
                          + {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-1">
                      Tools & Frameworks
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedSkills.tools?.map((sk, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 rounded-md"
                        >
                          + {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-1">
                      Soft & Leadership Competencies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedSkills.soft?.map((sk, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md"
                        >
                          + {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 text-xs text-slate-500">
          <span>AI outputs are suggestions. You maintain complete control over your resume content.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-slate-700 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
