import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Trust, RealEstateAsset } from '../types';

const AssetInjectionForm = ({ trust, onSave, onCancel }: { trust: Trust, onSave: (asset: RealEstateAsset) => void, onCancel: () => void }) => {
    const [parcelId, setParcelId] = useState('');
    const [legalDescription, setLegalDescription] = useState('');
    const [deedReference, setDeedReference] = useState('');

    const handleSave = () => {
        if (!parcelId || !legalDescription) {
            alert('Parcel ID and Legal Description are required.');
            return;
        }
        onSave({
            type: 'REAL_ESTATE',
            parcelId,
            legalDescription,
            deedReference,
        });
    };

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg mt-4 space-y-4 border border-emerald-800 animate-fade-in">
            <h4 className="text-sm font-bold text-emerald-400">Inject Real Estate Asset into "{trust.name}"</h4>
            <div>
                <label className="block text-xs text-slate-400 mb-1 font-mono">Parcel ID (APN)</label>
                <input value={parcelId} onChange={e => setParcelId(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" placeholder="e.g., 01-23-45-678-901.002-030" />
            </div>
            <div>
                <label className="block text-xs text-slate-400 mb-1 font-mono">Legal Description</label>
                <textarea value={legalDescription} onChange={e => setLegalDescription(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white h-20" placeholder="e.g., Lot 5, Block 3, of the PLAT of..."></textarea>
            </div>
            <div>
                <label className="block text-xs text-slate-400 mb-1 font-mono">Deed/Patent Reference</label>
                <input value={deedReference} onChange={e => setDeedReference(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" placeholder="e.g., Book 123, Page 456" />
            </div>
            <div className="flex gap-4">
                <button onClick={handleSave} className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded text-sm font-bold">Save Asset</button>
                <button onClick={onCancel} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded text-sm">Cancel</button>
            </div>
        </div>
    );
};


const TrustBuilder: React.FC = () => {
    const trusts = useStore((state) => state.trusts);
    const addTrust = useStore((state) => state.addTrust);
    const updateTrust = useStore((state) => state.updateTrust);

    const [isCreating, setIsCreating] = useState(false);
    const [fundingTrustId, setFundingTrustId] = useState<string | null>(null);

    const [newTrustName, setNewTrustName] = useState('');
    const [newTrustees, setNewTrustees] = useState('');
    const [newTrustJurisdiction, setNewTrustJurisdiction] = useState('Common Law');

    const handleCreateTrust = () => {
        if (!newTrustName.trim() || !newTrustees.trim()) {
            alert('Trust Name and at least one Trustee are required.');
            return;
        }
        const newTrust: Trust = {
            id: crypto.randomUUID(),
            name: newTrustName,
            trustees: newTrustees.split(',').map(t => t.trim()),
            beneficiaries: [], // Simplified for now
            createdAt: new Date().toISOString(),
            jurisdiction: newTrustJurisdiction,
            assets: [],
        };
        addTrust(newTrust);
        setIsCreating(false);
        setNewTrustName('');
        setNewTrustees('');
    };

    const handleSaveAsset = (trust: Trust, asset: RealEstateAsset) => {
        const updatedTrust = {
            ...trust,
            assets: [...trust.assets, asset]
        };
        updateTrust(updatedTrust);
        setFundingTrustId(null);
    };

    return (
        <div className="h-full bg-slate-950 p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-8">
                <header className="border-b border-slate-800 pb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-sovereign-200">Trust Builder</h1>
                        <p className="text-slate-400 font-mono text-sm">Establish and Manage Private Trusts</p>
                    </div>
                    {!isCreating && (
                        <button 
                            onClick={() => setIsCreating(true)}
                            className="bg-sovereign-700 hover:bg-sovereign-600 text-white px-4 py-2 rounded text-sm font-bold font-serif"
                        >
                            + Create New Trust
                        </button>
                    )}
                </header>

                {isCreating && (
                    <div className="bg-slate-900 p-6 rounded-lg border border-sovereign-800 space-y-4 animate-fade-in">
                        <h3 className="text-lg font-serif text-white">New Trust Details</h3>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 font-mono">Trust Name</label>
                            <input value={newTrustName} onChange={e => setNewTrustName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" placeholder="e.g., The John Henry Doe Family Trust" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 font-mono">Trustee(s)</label>
                            <input value={newTrustees} onChange={e => setNewTrustees(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" placeholder="John Henry Doe (comma-separated)" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 font-mono">Jurisdiction</label>
                            <select value={newTrustJurisdiction} onChange={e => setNewTrustJurisdiction(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white">
                                <option>Common Law</option>
                                <option>State of Alabama</option>
                                <option>Ecclesiastical</option>
                            </select>
                        </div>
                        <div className="flex gap-4 pt-2">
                            <button onClick={handleCreateTrust} className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded text-sm font-bold">Save Trust</button>
                            <button onClick={() => setIsCreating(false)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded text-sm">Cancel</button>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {trusts.length === 0 && !isCreating ? (
                         <div className="text-center py-20 text-slate-600 italic font-mono">
                            No trusts established. Click "Create New Trust" to begin.
                        </div>
                    ) : (
                        trusts.map(trust => (
                            <div key={trust.id} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{trust.name}</h3>
                                        <p className="text-xs text-slate-400 font-mono">Jurisdiction: {trust.jurisdiction}</p>
                                    </div>
                                    <span className="text-xs font-mono text-slate-500">
                                        Created: {new Date(trust.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-800">
                                    <h4 className="text-xs text-sovereign-400 uppercase font-bold mb-2">Assets ({trust.assets.length})</h4>
                                    {trust.assets.length === 0 ? (
                                        <p className="text-xs text-slate-500 italic">No assets injected into this trust.</p>
                                    ) : (
                                        <ul className="text-xs text-slate-400 list-disc pl-5 font-mono">
                                            {trust.assets.map((asset, index) => (
                                                <li key={index}>
                                                    {asset.type === 'REAL_ESTATE' ? `Real Estate: ${asset.parcelId}` : `Vehicle: ${asset.vin}`}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                     <button onClick={() => setFundingTrustId(trust.id)} className="mt-4 bg-emerald-900/30 text-emerald-400 border border-emerald-800 hover:bg-emerald-900/50 rounded text-xs font-bold px-3 py-1">
                                        + Inject Asset
                                    </button>
                                    {fundingTrustId === trust.id && (
                                        <AssetInjectionForm 
                                            trust={trust} 
                                            onSave={(asset) => handleSaveAsset(trust, asset)} 
                                            onCancel={() => setFundingTrustId(null)}
                                        />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrustBuilder;
