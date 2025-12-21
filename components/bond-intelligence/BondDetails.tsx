import React from 'react';

interface Bond {
    cusip: string;
    issuer: string;
    type: string;
    datedDate: string;
    state: string;
    details: string;
    cusipPrefix?: string;
    bondCategory?: string;
}

interface BondDetailsProps {
    bond: Bond;
    onClose: () => void;
}

const BondDetails: React.FC<BondDetailsProps> = ({ bond, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-sovereign-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-sovereign-200">{bond.issuer}</h2>
                        <p className="text-sm text-slate-400 font-mono">{bond.type}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">&times;</button>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-slate-950 p-3 rounded border border-slate-800">
                            <label className="block text-xs text-slate-500 font-mono">CUSIP</label>
                            <div className="font-mono text-sovereign-400">{bond.cusip}</div>
                        </div>
                        <div className="bg-slate-950 p-3 rounded border border-slate-800">
                            <label className="block text-xs text-slate-500 font-mono">CUSIP-6 Prefix</label>
                            <div className="font-mono text-slate-300">{bond.cusipPrefix || 'N/A'}</div>
                        </div>
                        <div className="bg-slate-950 p-3 rounded border border-slate-800">
                            <label className="block text-xs text-slate-500 font-mono">Dated Date</label>
                            <div className="font-mono text-slate-300">{bond.datedDate}</div>
                        </div>
                        <div className="bg-slate-950 p-3 rounded border border-slate-800">
                            <label className="block text-xs text-slate-500 font-mono">Category</label>
                            <div className="font-mono text-slate-300">{bond.bondCategory}</div>
                        </div>
                    </div>
                     <div className="bg-slate-950 p-3 rounded border border-slate-800">
                        <label className="block text-xs text-slate-500 font-mono">Details</label>
                        <div className="text-slate-300">{bond.details}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BondDetails;
