import React, { useState } from 'react';
import { Resume } from '../types/resume';
import { ResumeRenderer } from '../templates/ResumeRenderer';
import { exportResumeAsJson } from '../services/resumeStorage';
import { X, Printer, Download, ZoomIn, ZoomOut, FileJson, Check, Info } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  resume: Resume;
}

export const PrintPreviewModal: React.FC<Props> = ({ isOpen, onClose, resume }) => {
  const [zoom, setZoom] = useState(0.85);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    exportResumeAsJson(resume);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/80 backdrop-blur-sm">
      {/* Top action toolbar (no-print) */}
      <header className="no-print h-16 bg-slate-900 text-white px-4 sm:px-6 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white tracking-wide">
            Print & PDF Export Preview
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            • {resume.title || 'Resume'} ({resume.design.paperSize.toUpperCase()})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5 mr-2">
            <button
              type="button"
              onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-700 cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-slate-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom(prev => Math.min(1.3, prev + 0.1))}
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-700 cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <FileJson className="w-3.5 h-3.5 text-amber-400" />
            Backup JSON
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* PDF Export Tip banner (no-print) */}
      <div className="no-print bg-blue-950/80 text-blue-200 text-xs px-4 py-2 border-b border-blue-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            <strong>Pro-Tip for PDF Saving:</strong> In your browser print dialog, select <strong>Destination: "Save as PDF"</strong>, Paper size: <strong>{resume.design.paperSize.toUpperCase()}</strong>, and ensure <strong>"Background graphics" is enabled</strong> for pristine vector lines.
          </span>
        </div>
      </div>

      {/* Preview Canvas */}
      <main className="flex-1 overflow-auto p-6 sm:p-10 flex justify-center items-start bg-slate-800/40">
        <ResumeRenderer resume={resume} scale={zoom} isPrintPreview={true} />
      </main>
    </div>
  );
};
