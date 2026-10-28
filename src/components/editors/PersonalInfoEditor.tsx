import React from 'react';
import { PersonalInfo } from '../../types/resume';
import { User, Briefcase, Mail, Phone, MapPin, Linkedin, Github, Globe, Sparkles } from 'lucide-react';

interface Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export const PersonalInfoEditor: React.FC<Props> = ({ data, onChange }) => {
  const updateField = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
          <p className="text-xs text-slate-500">Recruiters and ATS parsers rely on this header to contact you.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            Full Name *
          </label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            placeholder="e.g. Alex Morgan"
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            Target Professional Title *
          </label>
          <input
            type="text"
            value={data.jobTitle}
            onChange={(e) => updateField('jobTitle', e.target.value)}
            placeholder="e.g. Senior Full-Stack Engineer"
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            Email Address *
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="e.g. alex.morgan@example.com"
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            Phone Number *
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="e.g. +1 (415) 555-0192"
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            City, State / Country *
          </label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="e.g. San Francisco, CA or London, UK"
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
            <Linkedin className="w-3.5 h-3.5 text-slate-400" />
            LinkedIn Profile
          </label>
          <input
            type="text"
            value={data.linkedin}
            onChange={(e) => updateField('linkedin', e.target.value)}
            placeholder="linkedin.com/in/alexmorgan"
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
            <Github className="w-3.5 h-3.5 text-slate-400" />
            GitHub Profile
          </label>
          <input
            type="text"
            value={data.github}
            onChange={(e) => updateField('github', e.target.value)}
            placeholder="github.com/alexmorgan"
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            Portfolio / Personal Website
          </label>
          <input
            type="text"
            value={data.website}
            onChange={(e) => updateField('website', e.target.value)}
            placeholder="alexmorgan.dev"
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>
      </div>
    </div>
  );
};
