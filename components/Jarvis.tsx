import React, { useState, useRef } from 'react';
import { jarvisExtract } from '../services/geminiService';
import { useStore } from '../lib/store';
import { ArchiveEntry } from '../types';

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jarvisExtract } from '../services/geminiService';
import { useStore } from '../lib/store';
import { constructIntelligencePrompt } from '../lib/intelligence';

const Jarvis: React.FC = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<{ name: string, type: string, data: string } | null>(null);
  const [report, setReport] = useState<IntelligenceReport | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        const base64Data = base64String.split(',')[1];
        
        setFile({
            name: f.name,
            type: f.type,
            data: base64Data
        });
        setText(''); 
      };
      reader.readAsDataURL(f);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExtract = async () => {
    const documentContent = file || text;
    if (!documentContent) return;

    setLoading(true);
    setReport(null);

    // The prompt contains all instructions. For file-based documents, the text in the prompt
    // is minimal, as the model will analyze the provided image/PDF.
    const prompt = constructIntelligencePrompt(file ? '' : text);
    const raw = await jarvisExtract(prompt, documentContent);

    try {
        const json = JSON.parse(raw);
        setReport(json);
    } catch (e) {
        console.error("Failed to parse intelligence report:", e);
        setReport({
            classification: { type: 'Unknown', intent: 'Unknown', riskLevel: 'High', requiredPersona: 'Representative' },
            summary: 'Failed to parse the response from the intelligence engine. The raw response is available in the vault.',
            deadlines: [],
            violations: [{ statute: 'Due Process', description: 'Could not parse AI response.', severity: 'High' }],
            recommendedRemedyId: null,
            recommendedActions: ['Manually review the raw response in the vault archive.', 'Retry the analysis.'],
        });
    }
    setLoading(false);
  };

  const addToArchive = useStore((state) => state.addToArchive);

  const handleSave = async () => {
    if (!report) return;

    const id = crypto.randomUUID();
    const dataToHash = JSON.stringify(report);
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(dataToHash));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const checksum = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const newEntry: ArchiveEntry = {
      id,
      timestamp: Date.now(),
      type: 'COGNITION',
      title: `Intelligence Report: ${report.classification.type}`,
      summary: `Source: ${file ? file.name : 'Text Input'}. Risk Level: ${report.classification.riskLevel}.`,
      details: JSON.stringify(report, null, 2),
      checksum,
    };

    addToArchive(newEntry);
    alert('Intelligence Report secured in Vault.');
  };
  
  const recommendedRemedy = report?.recommendedRemedyId ? REMEDY_DEFINITIONS.find(r => r.id === report.recommendedRemedyId) : null;

  return (
    <div className="h-full bg-slate-950 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center space-x-4 border-b border-sovereign-800 pb-4">
            <div className="w-10 h-10 rounded bg-sovereign-900/50 flex items-center justify-center border border-sovereign-700">
                <svg className="w-6 h-6 text-sovereign-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
            </div>
            <div>
                <h2 className="text-2xl font-serif font-bold text-sovereign-200">JARVIS Engine</h2>
                <p className="text-sm text-slate-400 font-mono">Document Intelligence & Violation Analysis</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto">
            {/* Input Column */}
            <div className="flex flex-col space-y-4">
                <div className="flex-1 flex flex-col space-y-4 bg-slate-900 p-4 border border-slate-800 rounded-lg">
                    <label className="text-xs font-mono text-sovereign-500 uppercase">Input Source</label>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors flex-grow flex flex-col justify-center ${file ? 'border-emerald-600 bg-emerald-900/10' : 'border-slate-700 hover:border-sovereign-600'}`}>
                         {!file ? (
                            <label htmlFor="jarvis-upload" className="cursor-pointer">
                                <svg className="w-8 h-8 text-slate-500 mb-2 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                <span className="text-sm text-slate-300 font-mono">Upload Document</span>
                                <span className="block text-[10px] text-slate-500 mt-1">PDF, JPG, PNG supported</span>
                            </label>
                        ) : (
                            <div>
                                <svg className="w-8 h-8 text-emerald-500 mb-2 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span className="text-sm text-emerald-300 font-mono break-all">{file.name}</span>
                                <button onClick={clearFile} className="mt-2 text-xs text-red-400 hover:text-red-300 underline">Remove</button>
                            </div>
                        )}
                    </div>
                    <input type="file" ref={fileInputRef} accept="image/*,application/pdf" onChange={handleFileChange} className="hidden" id="jarvis-upload"/>
                    <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500">OR</span></div></div>
                    <textarea 
                        className="h-32 bg-slate-950 border border-slate-700 rounded p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-sovereign-500 resize-none disabled:opacity-50"
                        placeholder={file ? "File selected, text input disabled." : "Paste text content directly..."}
                        value={text}
                        disabled={!!file}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleExtract}
                        disabled={loading || (!text && !file)}
                        className="flex-1 py-3 bg-sovereign-700 hover:bg-sovereign-600 text-white font-bold font-serif rounded shadow-lg transition-all disabled:opacity-50"
                    >
                        {loading ? 'ANALYZING...' : 'ANALYZE DOCUMENT'}
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={!report}
                        className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-sovereign-200 border border-sovereign-800 font-bold font-serif rounded shadow-lg transition-all disabled:opacity-50"
                    >
                        SECURE TO VAULT
                    </button>
                </div>
            </div>

            {/* Output Column */}
            <div className="flex flex-col space-y-4">
                 <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex-grow">
                    <h3 className="text-sm font-mono text-sovereign-500 uppercase mb-4">Intelligence Report</h3>
                    {!report && !loading && <div className="flex items-center justify-center h-full text-slate-600 font-mono text-xs">Awaiting Analysis...</div>}
                    {loading && <div className="flex items-center justify-center h-full text-sovereign-400 font-mono text-sm animate-pulse">Running full-spectrum analysis...</div>}
                    
                    {report && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Classification */}
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-xs text-slate-400">Type</div>
                                    <div className="text-sm font-bold text-white">{report.classification.type}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400">Intent</div>
                                    <div className="text-sm font-bold text-white">{report.classification.intent}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400">Risk Level</div>
                                    <div className={`text-sm font-bold ${report.classification.riskLevel === 'High' || report.classification.riskLevel === 'Urgent' ? 'text-red-400' : 'text-amber-400'}`}>{report.classification.riskLevel}</div>
                                </div>
                            </div>
                            {/* Summary */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-300 mb-1">Summary</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">{report.summary}</p>
                            </div>
                            {/* Violations */}
                            {report.violations.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-red-400 mb-2">Detected Violations</h4>
                                    <div className="space-y-2">
                                        {report.violations.map((v, i) => (
                                            <div key={i} className="bg-red-900/20 border border-red-800/50 p-2 rounded">
                                                <p className="text-xs text-red-300"><span className="font-bold">{v.statute}:</span> {v.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Deadlines */}
                            {report.deadlines.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-amber-400 mb-2">Key Deadlines</h4>
                                    <div className="space-y-2">
                                        {report.deadlines.map((d, i) => (
                                            <div key={i} className="bg-amber-900/20 border border-amber-800/50 p-2 rounded">
                                                <p className="text-xs text-amber-300"><span className="font-bold">{new Date(d.date).toLocaleDateString()}:</span> {d.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Recommended Remedy */}
                            {recommendedRemedy && (
                                <div className="bg-emerald-900/20 border border-emerald-800/50 p-4 rounded">
                                    <h4 className="text-sm font-bold text-emerald-400 mb-2">Recommended Remedy</h4>
                                    <p className="text-lg font-serif text-white">{recommendedRemedy.remedyName}</p>
                                    <p className="text-xs text-slate-400 mb-3">Authority: {recommendedRemedy.statutoryAuthority}</p>
                                    <button 
                                        onClick={() => navigate(`/remedy?initiate=${recommendedRemedy.id}`)}
                                        className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2 rounded shadow-lg text-sm transition-colors"
                                    >
                                        INITIATE REMEDY
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Jarvis;