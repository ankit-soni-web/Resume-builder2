import React from 'react';
import { DesignSettings, TemplateId, FontFamily, FontSize, LineHeight, Margins, HeadingStyle, PaperSize } from '../types/resume';
import { TEMPLATES, COLOR_PALETTES, FONT_OPTIONS } from '../data/templates';
import { RotateCcw, Palette, Type, Layout, Sliders, Check } from 'lucide-react';

interface Props {
  design: DesignSettings;
  onChange: (updatedDesign: DesignSettings) => void;
  onResetDesign: () => void;
}

export const DesignPanel: React.FC<Props> = ({ design, onChange, onResetDesign }) => {
  const update = (field: keyof DesignSettings, value: any) => {
    onChange({
      ...design,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-blue-600" />
            Resume Design & Customization
          </h3>
          <p className="text-xs text-slate-500">Fine-tune typography, spacing, accents, and paper layout.</p>
        </div>
        <button
          type="button"
          onClick={onResetDesign}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          title="Reset design styling back to template default without affecting resume content"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Design
        </button>
      </div>

      {/* Template Selector Grid */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
          Select Layout Template (8 Styles)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map((t) => {
            const isSelected = design.templateId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => update('templateId', t.id)}
                className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.accentColor }}></span>
                  <span className="text-xs font-bold text-slate-900 leading-tight">{t.name}</span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1">{t.tagline}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                    {t.category}
                  </span>
                  {t.isAtsFriendly && (
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-green-50 text-green-700 border border-green-200">
                      ATS Validated
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Accent Picker */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
          Primary Accent Color
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {COLOR_PALETTES.map((color) => {
            const isSelected = design.primaryColor.toLowerCase() === color.value.toLowerCase();
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => update('primaryColor', color.value)}
                title={color.name}
                className={`w-7 h-7 rounded-full transition-transform cursor-pointer relative flex items-center justify-center shadow-xs ${
                  isSelected ? 'scale-115 ring-2 ring-offset-2 ring-slate-800' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color.value }}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
          <div className="flex items-center gap-1.5 ml-2">
            <input
              type="color"
              value={design.primaryColor}
              onChange={(e) => update('primaryColor', e.target.value)}
              className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0.5 bg-white"
              title="Custom hex color"
            />
            <span className="text-xs text-slate-500 font-mono">{design.primaryColor}</span>
          </div>
        </div>
      </div>

      {/* Typography Font Family */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5" />
          Font Family
        </label>
        <div className="space-y-1.5">
          {FONT_OPTIONS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => update('fontFamily', f.value as FontFamily)}
              className={`w-full p-2.5 text-left text-xs rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                design.fontFamily === f.value
                  ? 'border-blue-600 bg-blue-50/60 font-semibold text-blue-900 ring-1 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
              }`}
            >
              <span>{f.label}</span>
              {design.fontFamily === f.value && <Check className="w-3.5 h-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size & Spacing Controls */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Font Size Scale</label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
            {(['compact', 'normal', 'large'] as FontSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => update('fontSize', size)}
                className={`py-1 text-[11px] font-medium rounded capitalize cursor-pointer transition-colors ${
                  design.fontSize === size ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Page Margins</label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
            {(['compact', 'normal', 'spacious'] as Margins[]).map((margin) => (
              <button
                key={margin}
                type="button"
                onClick={() => update('margins', margin)}
                className={`py-1 text-[11px] font-medium rounded capitalize cursor-pointer transition-colors ${
                  design.margins === margin ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {margin}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Paper Size & Page Numbering */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1">
            <Layout className="w-3.5 h-3.5 text-slate-400" />
            Paper Standard
          </label>
          <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg">
            {(['a4', 'letter'] as PaperSize[]).map((paper) => (
              <button
                key={paper}
                type="button"
                onClick={() => update('paperSize', paper)}
                className={`py-1 text-[11px] font-medium rounded uppercase cursor-pointer transition-colors ${
                  design.paperSize === paper ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {paper === 'a4' ? 'A4 (Global)' : 'Letter (US)'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={design.showPageNumbers}
              onChange={(e) => update('showPageNumbers', e.target.checked)}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span>Show page numbers</span>
          </label>
        </div>
      </div>
    </div>
  );
};
