import React, { useState } from 'react';
import { FileText, Sparkles, LayoutTemplate, FolderGit2, Menu, X, Shield, Plus, User } from 'lucide-react';

interface Props {
  activePage: string;
  onNavigate: (page: string) => void;
  onNewResume?: () => void;
}

export const Navbar: React.FC<Props> = ({ activePage, onNavigate, onNewResume }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="no-print bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('landing')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#14213D] via-[#1E3A8A] to-[#3563E9] text-white flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                Resume<span className="text-blue-600">Craft</span>
              </span>
              <span className="text-[10px] font-semibold text-teal-600 block leading-none tracking-wider uppercase">
                Pro Studio
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => handleNav('landing')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activePage === 'landing' ? 'text-blue-600 bg-blue-50/70 font-bold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNav('templates')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activePage === 'templates' ? 'text-blue-600 bg-blue-50/70 font-bold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Templates (8)
            </button>
            <button
              type="button"
              onClick={() => handleNav('dashboard')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activePage === 'dashboard' ? 'text-blue-600 bg-blue-50/70 font-bold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => handleNav('editor')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activePage === 'editor' ? 'text-blue-600 bg-blue-50/70 font-bold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Resume Editor
            </button>
          </div>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/80 rounded-full text-[11px] font-medium text-slate-600 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              Guest Mode (Autosaved)
            </div>

            {onNewResume && (
              <button
                type="button"
                onClick={onNewResume}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#14213D] hover:bg-slate-800 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                New Resume
              </button>
            )}

            <button
              type="button"
              onClick={() => handleNav('login')}
              className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-2.5 py-1.5 transition-colors cursor-pointer flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
              Sign In
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <button
            type="button"
            onClick={() => handleNav('landing')}
            className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNav('templates')}
            className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            Explore Templates (8)
          </button>
          <button
            type="button"
            onClick={() => handleNav('dashboard')}
            className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            My Resumes Dashboard
          </button>
          <button
            type="button"
            onClick={() => handleNav('editor')}
            className="w-full text-left px-3 py-2 text-sm font-semibold text-blue-600 bg-blue-50/70 rounded-lg"
          >
            Open Resume Editor
          </button>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {onNewResume && (
              <button
                type="button"
                onClick={() => {
                  onNewResume();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-xs font-bold text-white bg-blue-600 rounded-lg"
              >
                + Create New Resume
              </button>
            )}
            <button
              type="button"
              onClick={() => handleNav('login')}
              className="w-full py-2 text-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
            >
              Sign In / Account
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
