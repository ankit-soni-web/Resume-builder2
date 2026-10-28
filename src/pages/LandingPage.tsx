import React, { useState } from 'react';
import { TEMPLATES } from '../data/templates';
import { Resume } from '../types/resume';
import { SAMPLE_RESUMES } from '../data/sampleResumes';
import {
  FileText, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Download,
  Layers, Palette, Clock, Star, HelpCircle, ChevronRight, Award,
  Cpu, Users, Briefcase, GraduationCap
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
  onSelectTemplate: (templateId: string) => void;
  onOpenSampleResume: (resumeId: string) => void;
}

export const LandingPage: React.FC<Props> = ({ onNavigate, onSelectTemplate, onOpenSampleResume }) => {
  const [selectedAudience, setSelectedAudience] = useState<'professionals' | 'students' | 'engineers' | 'executives'>('professionals');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Are the resume templates truly ATS-friendly?',
      a: 'Yes. All templates utilize standard single-pass linear hierarchy, clean semantic headings, standard fonts, and vector-compatible styling tested against Workday, Taleo, Greenhouse, and Lever. No decorative elements disrupt parsing.',
    },
    {
      q: 'Can I export my resume directly to PDF for free?',
      a: 'Absolutely. ResumeCraft renders true selectable vector PDF resumes through your browser print engine with custom @media print rules, ensuring 100% sharp text, exact margins, and zero watermarks.',
    },
    {
      q: 'Will my data be saved if I do not create an account?',
      a: 'Yes. ResumeCraft includes a full Guest Mode with localStorage persistence and autosave. Your resumes stay safely saved in your browser even across refreshes. You can also export full JSON backups anytime.',
    },
    {
      q: 'How does the AI Resume Assistant work?',
      a: 'Our AI assistant connects to Google Gemini 3.8 Flash via a secure server endpoint to generate high-impact professional summaries, rewrite responsibilities into STAR bullet points with action verbs, and analyze job descriptions for keyword gaps. If offline or unconfigured, an intelligent rule engine seamlessly activates.',
    },
    {
      q: 'Can I switch templates after filling in my resume details?',
      a: 'Yes! Your resume data and layout templates are completely decoupled. You can switch between any of our 8 distinct templates with a single click without losing a single character.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-800 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/60 bg-gradient-to-b from-white via-slate-50/50 to-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Next-Generation Resume Studio • Built for 2026 Hiring</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#14213D] leading-[1.12]">
              Build a Resume That <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#14213D] via-[#1E40AF] to-[#3563E9] bg-clip-text text-transparent">
                Opens Doors.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Create recruiter-approved, ATS-optimized resumes in minutes. Choose from 8 designer templates, polish bullet points with real AI assistance, and download flawless PDFs without design hassle.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('editor')}
                className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-white bg-[#14213D] hover:bg-[#1f2f53] rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>Create My Resume</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('templates')}
                className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Explore 8 Templates</span>
              </button>
            </div>

            {/* Trust highlights */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                100% ATS Verified
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                Vector Selectable PDF Export
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                No Credit Card or Sign-Up Needed
              </span>
            </div>
          </div>

          {/* Realistic Hero Visual / Sample Showcase */}
          <div className="mt-12 lg:mt-16 relative max-w-5xl mx-auto">
            <div className="p-3 sm:p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 px-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-green-400"></span>
                  <span className="text-xs font-semibold text-slate-500 ml-2">ResumeCraft Live Workspace Preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                    ATS Score: 94/100
                  </span>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Autosaved
                  </span>
                </div>
              </div>

              {/* Sample Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SAMPLE_RESUMES.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => onOpenSampleResume(sample.id)}
                    className="p-4 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                          {sample.design.templateId.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-slate-400">Sample Preset</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {sample.personalInfo.fullName}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">{sample.personalInfo.jobTitle}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-3 mt-2 leading-relaxed">
                        {sample.summary}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-blue-600">
                      <span>Open & Customize</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps: How It Works */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Effortless Workflow</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              From Blank Canvas to Landed Interview in 3 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-6 bg-[#F8FAFC] rounded-2xl border border-slate-200 relative group hover:border-blue-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-base mb-4 shadow-sm">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Choose a Crafted Template</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pick from 8 distinct layout archetypes: Classic ATS, Modern Minimal, Corporate Executive, Student/Fresher, or Developer Matrix.
              </p>
            </div>

            <div className="p-6 bg-[#F8FAFC] rounded-2xl border border-slate-200 relative group hover:border-blue-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#14213D] text-white font-bold flex items-center justify-center text-base mb-4 shadow-sm">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Fill with Real AI Assistance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Type your experience and let our STAR bullet improver polish your contributions into quantified, action-driven statements.
              </p>
            </div>

            <div className="p-6 bg-[#F8FAFC] rounded-2xl border border-slate-200 relative group hover:border-blue-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-base mb-4 shadow-sm">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Audit & Download Flawless PDF</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Run the instant ATS checker, inspect page breaks in live preview, and download your clean vector PDF instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Template Showcase Carousel/Grid */}
      <section className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Versatile Layout Catalog</span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
                8 Distinct, Professionally Calibrated Templates
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Every template features unique layout architecture, typography hierarchy, and ATS compliance.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('templates')}
              className="px-4 py-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 rounded-xl border border-blue-200 self-start md:self-auto cursor-pointer"
            >
              View All 8 in Template Gallery →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all p-4 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-40 bg-slate-100 rounded-xl border border-slate-200/60 p-3 mb-3.5 flex flex-col justify-between relative overflow-hidden group-hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tmpl.accentColor }}></span>
                      {tmpl.isAtsFriendly && (
                        <span className="text-[9px] font-bold text-green-700 bg-green-50 px-1.5 py-0.2 rounded border border-green-200">
                          ATS Friendly
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5 opacity-80">
                      <div className="h-2 w-1/2 rounded bg-slate-300"></div>
                      <div className="h-1.5 w-3/4 rounded bg-slate-200"></div>
                      <div className="h-1.5 w-full rounded bg-slate-200"></div>
                      <div className="h-1.5 w-5/6 rounded bg-slate-200"></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {tmpl.layout}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {tmpl.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {tmpl.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onSelectTemplate(tmpl.id)}
                    className="w-full py-2 text-xs font-bold text-slate-700 hover:text-white bg-slate-100 hover:bg-[#14213D] rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Use This Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audiences: Students, Freshers, Experienced, Tech */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Tailored For Every Journey</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              Engineered for Your Career Stage
            </h2>
          </div>

          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-slate-100 rounded-xl">
              {(['professionals', 'students', 'engineers', 'executives'] as const).map((aud) => (
                <button
                  key={aud}
                  type="button"
                  onClick={() => setSelectedAudience(aud)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg capitalize transition-colors cursor-pointer ${
                    selectedAudience === aud
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {aud}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-3xl mx-auto p-6 bg-slate-50 border border-slate-200 rounded-2xl">
            {selectedAudience === 'professionals' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">For Mid & Senior Professionals</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Focus on career growth, team leadership, cross-functional impact, and quantifiable accomplishments. Highlight promotions, revenue scale, and operational efficiencies using the Classic or Modern Minimal templates.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs font-medium bg-white px-2.5 py-1 rounded-md border border-slate-200">✓ Quantified metrics tracking</span>
                  <span className="text-xs font-medium bg-white px-2.5 py-1 rounded-md border border-slate-200">✓ Multi-role timeline layout</span>
                  <span className="text-xs font-medium bg-white px-2.5 py-1 rounded-md border border-slate-200">✓ Workday & Taleo compliant</span>
                </div>
              </div>
            )}

            {selectedAudience === 'students' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-teal-600" />
                  <h3 className="text-base font-bold text-slate-900">For College Students & Freshers</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Put your education, relevant coursework, campus leadership, hackathons, and internship capstones at the top of the page. Stand out with clean formatting even when entering the workforce for the first time.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs font-medium bg-white px-2.5 py-1 rounded-md border border-slate-200">✓ Prioritized Education section</span>
                  <span className="text-xs font-medium bg-white px-2.5 py-1 rounded-md border border-slate-200">✓ Coursework & Projects highlight</span>
                  <span className="text-xs font-medium bg-white px-2.5 py-1 rounded-md border border-slate-200">✓ Internship & Hackathon sections</span>
                </div>
              </div>
            )}

            {selectedAudience === 'engineers' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">For Software & Data Engineers</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Highlight your categorized technical skills matrix (Languages, Frameworks, Cloud, Databases), GitHub repositories, latency improvements, and distributed systems architecture with developer-friendly aesthetics.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs font-medium bg-white px-2.5 py-1 rounded-md border border-slate-200">✓ Technical Skills Matrix</span>
                  <span className="text-xs font-medium bg-white px-2.5 py-1 rounded-md border border-slate-200">✓ GitHub & Open Source tags</span>
                  <span className="text-xs font-medium bg-white px-2.5 py-1 rounded-md border border-slate-200">✓ System throughput metrics</span>
                </div>
              </div>
            )}

            {selectedAudience === 'executives' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base font-bold text-slate-900">For Directors & Executives</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Commanding presence with a dedicated Executive Career Profile box, P&L responsibility figures, M&A integration highlights, board affiliations, and thought leadership publications.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs font-medium bg-white px-2.5 py-1 rounded-md border border-slate-200">✓ Executive Summary callout</span>
                  <span className="text-xs font-medium bg-white px-2.5 py-1 rounded-md border border-slate-200">✓ Board & publications support</span>
                  <span className="text-xs font-medium bg-white px-2.5 py-1 rounded-md border border-slate-200">✓ Premium editorial typography</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200/70">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Frequently Asked Questions</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              Common Inquiries
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex justify-between items-center cursor-pointer hover:bg-slate-50"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-[#14213D] text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Build Your Professional Resume?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Join thousands of applicants crafting ATS-friendly resumes that get noticed by hiring managers.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('editor')}
              className="px-8 py-3.5 text-sm font-bold text-[#14213D] bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Get Started Now — It's Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-white">ResumeCraft</span>
            <span>— Professional Resume Builder & Editor</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <button type="button" onClick={() => onNavigate('templates')} className="hover:text-white cursor-pointer">Templates</button>
            <button type="button" onClick={() => onNavigate('dashboard')} className="hover:text-white cursor-pointer">Dashboard</button>
            <button type="button" onClick={() => onNavigate('editor')} className="hover:text-white cursor-pointer">Editor</button>
            <button type="button" onClick={() => onNavigate('login')} className="hover:text-white cursor-pointer">Account</button>
          </div>

          <p className="text-slate-500">© 2026 ResumeCraft. Designed for high-impact careers.</p>
        </div>
      </footer>
    </div>
  );
};
