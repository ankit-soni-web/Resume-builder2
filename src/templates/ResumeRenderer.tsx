import React from 'react';
import { Resume } from '../types/resume';
import { ClassicTemplate } from './ClassicTemplate';
import { ModernMinimal } from './ModernMinimal';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { FresherTemplate } from './FresherTemplate';
import { TechnicalTemplate } from './TechnicalTemplate';
import { DataScienceTemplate } from './DataScienceTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { TwoColumnTemplate } from './TwoColumnTemplate';

interface ResumeRendererProps {
  resume: Resume;
  scale?: number;
  isPrintPreview?: boolean;
}

export const ResumeRenderer: React.FC<ResumeRendererProps> = ({
  resume,
  scale = 1,
  isPrintPreview = false,
}) => {
  const { design } = resume;

  // Font family class
  const fontClass = React.useMemo(() => {
    switch (design.fontFamily) {
      case 'Inter':
        return 'font-sans';
      case 'Merriweather':
        return 'font-serif';
      case 'JetBrains Mono':
        return 'font-mono';
      case 'Playfair Display':
        return 'font-serif';
      case 'Plus Jakarta Sans':
      default:
        return 'font-sans';
    }
  }, [design.fontFamily]);

  // Margins styling
  const paddingClass = React.useMemo(() => {
    switch (design.margins) {
      case 'compact':
        return 'p-6 sm:p-8';
      case 'spacious':
        return 'p-10 sm:p-14';
      case 'normal':
      default:
        return 'p-8 sm:p-10';
    }
  }, [design.margins]);

  // Font scale root style
  const fontSizeClass = React.useMemo(() => {
    switch (design.fontSize) {
      case 'compact':
        return 'text-[0.92rem]';
      case 'large':
        return 'text-[1.08rem]';
      case 'normal':
      default:
        return 'text-[1rem]';
    }
  }, [design.fontSize]);

  // Dimension constraints for A4 vs Letter
  // A4 ratio: 210 / 297 = 0.707 (e.g. 794px width x 1123px min-height)
  // US Letter ratio: 8.5 / 11 = 0.772 (e.g. 816px width x 1056px min-height)
  const isA4 = design.paperSize === 'a4';
  const paperDimensions = isA4
    ? 'w-[794px] min-h-[1123px]'
    : 'w-[816px] min-h-[1056px]';

  const renderTemplateContent = () => {
    switch (design.templateId) {
      case 'modern':
        return <ModernMinimal resume={resume} />;
      case 'executive':
        return <ExecutiveTemplate resume={resume} />;
      case 'fresher':
        return <FresherTemplate resume={resume} />;
      case 'technical':
        return <TechnicalTemplate resume={resume} />;
      case 'datascience':
        return <DataScienceTemplate resume={resume} />;
      case 'creative':
        return <CreativeTemplate resume={resume} />;
      case 'twocolumn':
        return <TwoColumnTemplate resume={resume} />;
      case 'classic':
      default:
        return <ClassicTemplate resume={resume} />;
    }
  };

  return (
    <div
      className="resume-print-container flex justify-center items-start origin-top transition-transform duration-200"
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
      }}
    >
      <div
        id="resume-document-root"
        className={`resume-page bg-white text-slate-800 shadow-xl border border-slate-200/80 rounded-xs relative ${paperDimensions} ${paddingClass} ${fontClass} ${fontSizeClass} transition-shadow duration-200`}
        style={{
          boxSizing: 'border-box',
          backgroundColor: '#FFFFFF',
          pageBreakAfter: 'always',
          breakAfter: 'page',
        }}
      >
        {renderTemplateContent()}

        {/* Page footer / numbering */}
        {design.showPageNumbers && (
          <div className="absolute bottom-3 right-6 text-[10px] text-slate-400 font-mono no-print">
            Page 1 • {resume.title || 'Resume'}
          </div>
        )}
      </div>
    </div>
  );
};
