import React from 'react';
import { CertificationItem } from '../../types/resume';
import { Plus, Trash2, Award } from 'lucide-react';

interface Props {
  items: CertificationItem[];
  onChange: (items: CertificationItem[]) => void;
}

export const CertificationsEditor: React.FC<Props> = ({ items, onChange }) => {
  const addCert = () => {
    const newItem: CertificationItem = {
      id: 'cert-' + Math.random().toString(36).substring(2, 9),
      name: '',
      issuer: '',
      date: '',
      credentialUrl: '',
    };
    onChange([...items, newItem]);
  };

  const updateCert = (id: string, field: keyof CertificationItem, value: string) => {
    onChange(
      items.map(c => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const deleteCert = (id: string) => {
    onChange(items.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Certifications & Licenses</h3>
          <p className="text-xs text-slate-500">Industry credentials, cloud certifications, and accredited courses.</p>
        </div>
        <button
          type="button"
          onClick={addCert}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Certification
        </button>
      </div>

      {items.length === 0 && (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <Award className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">No certifications added yet</p>
          <p className="text-[11px] text-slate-500 mt-0.5 mb-3">Add AWS, Cisco, PMP, Meta, Google or other credentials.</p>
          <button
            type="button"
            onClick={addCert}
            className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer"
          >
            + Add First Certification
          </button>
        </div>
      )}

      <div className="space-y-3">
        {items.map((c) => (
          <div key={c.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">{c.name || 'New Certification'}</span>
              <button
                type="button"
                onClick={() => deleteCert(c.id)}
                className="text-slate-400 hover:text-red-600 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Certification Name *</label>
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) => updateCert(c.id, 'name', e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Issuing Body / Authority *</label>
                <input
                  type="text"
                  value={c.issuer}
                  onChange={(e) => updateCert(c.id, 'issuer', e.target.value)}
                  placeholder="e.g. Amazon Web Services, Scrum Alliance"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Issue Date</label>
                <input
                  type="text"
                  value={c.date}
                  onChange={(e) => updateCert(c.id, 'date', e.target.value)}
                  placeholder="e.g. 2023-08"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Verification URL / ID (Optional)</label>
                <input
                  type="text"
                  value={c.credentialUrl || ''}
                  onChange={(e) => updateCert(c.id, 'credentialUrl', e.target.value)}
                  placeholder="https://credly.com/..."
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
