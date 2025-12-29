import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { TEMPLATES } from '../data/templates';
import { Template, ArchiveEntry, Trust } from '../types';
import { useStore } from '../lib/store';

interface DrafterProps {
  onArchive: (entry: ArchiveEntry) => void;
}

const Drafter: React.FC<DrafterProps> = ({ onArchive }) => {
  const { templateId } = useParams<{ templateId: string }>();
  const location = useLocation();
  const trusts = useStore((state) => state.trusts);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<string>('');
  const [isSealed, setIsSealed] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const trustId = params.get('trustId');
    
    if (templateId) {
        const tmpl = TEMPLATES.find(t => t.id === templateId);
        if (tmpl) {
            handleTemplateSelect(tmpl, trustId);
        }
    }
  }, [templateId, location.search, trusts]);

  const handleTemplateSelect = (template: Template, trustId: string | null) => {
    setSelectedTemplate(template);
    setIsSealed(false);
    setCompletedSteps({});
    setPreview('');

    let initialFormData: Record<string, string> = {};
    if (trustId && template.id === 'declaration-of-trust') {
        const trust = trusts.find(t => t.id === trustId);
        if (trust) {
            initialFormData = {
                trust_name: trust.name,
                trustees: trust.trustees.join(', '),
                date: new Date().toISOString().split('T')[0],
                asset_schedule: trust.assets.map(asset => {
                    if (asset.type === 'REAL_ESTATE') {
                        return `Real Estate Parcel: ${asset.parcelId}, described as "${asset.legalDescription}"`;
                    }
                    return '';
                }).join('\n- ')
            };
        }
    }
    setFormData(initialFormData);
  };

  const handleInputChange = (key: string, value: string) => {
    if (isSealed) return;
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const generatePreview = () => {
    if (!selectedTemplate) return;
    let text = selectedTemplate.content;
    selectedTemplate.fields.forEach(field => {
      const value = formData[field.key] || `[${field.label.toUpperCase()}]`;
      text = text.replace(new RegExp(`{{${field.key}}}`, 'g'), value);
    });
    setPreview(text);
    setIsSealed(false);
  };

  const calculateChecksum = async (text: string): Promise<string> => {
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleSeal = async () => {
    if (!preview || isSealed) return;
    const hash = await calculateChecksum(preview);
    const timestamp = new Date().toISOString();
    
    const sealBlock = `\n\n==================================================\n` +
    `   [ SOVEREIGN SEAL OF AUTHORSHIP ]\n` +
    `   DATE: ${timestamp.split('T')[0]} | TIME: ${timestamp.split('T')[1].replace('Z','')}\n` +
    `   SHA256: ${hash}\n` +
    `   NOTICE: THIS INSTRUMENT IS EXECUTED UNDER SEAL AND BOND.\n` +
    `==================================================`;

    setPreview(prev => prev + sealBlock);
    setIsSealed(true);
  };

  const handleSaveToArchive = async () => {
    if (!selectedTemplate || !preview) return;
    const checksum = await calculateChecksum(preview);
    onArchive({
      id: `draft-${Date.now()}`,
      timestamp: Date.now(),
      type: 'DRAFT',
      title: `Draft: ${selectedTemplate.name}`,
      summary: `Generated remedy draft for ${selectedTemplate.jurisdiction}`,
      details: preview,
      checksum,
    });
    alert("Draft archived successfully.");
  };

  // UI remains the same, so I will omit it for brevity, but the logic above is what matters.
  // The full return statement of the component would follow here.
  // ... (The rest of the component's JSX, which is unchanged)
  return (
    <div className="flex h-full bg-slate-950">
      <div className="w-96 bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="font-serif font-bold text-sovereign-200 text-lg mb-4">Template Selector</h2>
          <select 
            className="w-full bg-slate-950 border border-slate-700 text-slate-300 rounded p-2 mb-4"
            onChange={(e) => {
                const tmpl = TEMPLATES.find(t => t.id === e.target.value);
                if (tmpl) handleTemplateSelect(tmpl, null);
            }}
            value={selectedTemplate?.id || ''}
          >
            <option value="" disabled>-- Select a Remedy --</option>
            {TEMPLATES.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.jurisdiction})</option>
            ))}
          </select>
        </div>
        {selectedTemplate && (
            <div className="p-6 space-y-6 flex-1">
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold text-sovereign-400 uppercase">Parameters</h3>
                    </div>
                    <div className="space-y-4">
                        {selectedTemplate.fields.map(field => (
                        <div key={field.key}>
                            <label className="block text-xs text-slate-400 mb-1 font-mono">{field.label}</label>
                            <textarea
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded p-2 text-sm"
                                rows={field.type === 'textarea' ? 4 : 1}
                                value={formData[field.key] || ''}
                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                            />
                        </div>
                        ))}
                    </div>
                    <button 
                        onClick={generatePreview}
                        className="w-full bg-sovereign-700 hover:bg-sovereign-600 text-white font-serif font-bold py-2 rounded mt-4"
                    >
                        Generate Preview
                    </button>
                </div>
            </div>
        )}
      </div>
      <div className="flex-1 bg-slate-950 p-8 flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif font-bold text-sovereign-200 text-xl">Document Preview</h2>
            {preview && (
                <div className="space-x-2">
                    <button onClick={handleSaveToArchive} className="px-3 py-1 bg-sovereign-800 text-sovereign-100 border border-sovereign-600 text-xs rounded">
                        Confirm & Archive
                    </button>
                </div>
            )}
        </div>
        <div className="flex-1 bg-white text-slate-900 font-mono text-sm p-8 overflow-y-auto rounded-sm">
            {preview ? preview : <div className="text-slate-400">Awaiting Parameters...</div>}
        </div>
      </div>
    </div>
  );
};

export default Drafter;
