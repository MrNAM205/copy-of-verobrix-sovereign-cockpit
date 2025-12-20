import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const FoiaGenerator: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const caseNumberFromQuery = queryParams.get('caseNumber') || '';
  const creditorFromQuery = queryParams.get('creditor') || '';

  const [agency, setAgency] = useState(creditorFromQuery || '');
  const [caseNumber, setCaseNumber] = useState(caseNumberFromQuery || '');
  const [requesterName, setRequesterName] = useState('');
  const [requesterAddress, setRequesterAddress] = useState('');
  const [generatedText, setGeneratedText] = useState('');

  const generateFoiaRequest = () => {
    const text = `
[Your Name]
[Your Address]
[City, State, ZIP]
[Date]

Freedom of Information Act Officer
[Name of Agency, e.g., Department of the Treasury]
[Agency Address]

RE: Freedom of Information Act (FOIA) Request

Dear Sir or Madam:

This is a request under the Freedom of Information Act (5 U.S.C. § 552).

I hereby request any and all records pertaining to the financial accounting and instruments associated with case number ${caseNumber}, involving ${agency}.

Specifically, I request the following:

1.  Any and all CUSIP numbers associated with the case.
2.  Copies of any and all performance bonds, indemnity bonds, or other surety bonds associated with the case or the public officials involved.
3.  All charging instruments, including but not limited to, the original promissory note or bill of exchange.
4.  A complete accounting of all transactions, showing all debits and credits, related to this case.

I am a member of the public seeking this information for non-commercial, personal use, and I request a waiver of all fees associated with this request. If my request is denied in whole or in part, I ask that you justify all deletions by reference to specific exemptions of the act.

Thank you for your prompt attention to this matter.

Sincerely,

${requesterName}
    `.trim();
    setGeneratedText(text);
  };

  return (
    <div className="h-full bg-slate-950 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-2xl font-serif font-bold text-sovereign-200">FOIA Request Generator</h2>
          <p className="text-sm text-slate-400 font-mono">Generate a FOIA request to trace commercial instruments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-500 uppercase">Request Details</h3>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono">Agency</label>
              <input
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded p-2 text-sm"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                placeholder="e.g., Department of Justice"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono">Case Number</label>
              <input
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded p-2 text-sm"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                placeholder="e.g., 2024-CV-12345"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono">Your Name</label>
              <input
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded p-2 text-sm"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="John H. Doe"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-mono">Your Address</label>
              <input
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded p-2 text-sm"
                value={requesterAddress}
                onChange={(e) => setRequesterAddress(e.target.value)}
                placeholder="123 Main St, Anytown, USA"
              />
            </div>
            <button
              onClick={generateFoiaRequest}
              className="w-full py-3 bg-sovereign-700 hover:bg-sovereign-600 text-white font-bold font-serif rounded shadow-lg"
            >
              Generate Request
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-500 uppercase">Generated Request</h3>
            <textarea
              readOnly
              className="w-full h-96 bg-white text-slate-900 font-mono text-sm p-4 rounded-sm border"
              value={generatedText}
              placeholder="Generated FOIA request will appear here..."
            />
            <button
              onClick={() => navigator.clipboard.writeText(generatedText)}
              disabled={!generatedText}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded border border-slate-700 disabled:opacity-50"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoiaGenerator;
