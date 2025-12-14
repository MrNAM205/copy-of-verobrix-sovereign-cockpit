import React, { useState } from 'react';
import { Playbook, PlaybookStep } from '../types';
import { initialPlaybooks } from '../data/playbooks';

const PlaybookNavigator: React.FC = () => {
    const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(initialPlaybooks[0]);
    const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

    const toggleStep = (stepId: string) => {
        setCompletedSteps(prev => ({
            ...prev,
            [stepId]: !prev[stepId]
        }));
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'High': return 'text-red-400 border-red-900/50 bg-red-900/20';
            case 'Medium': return 'text-amber-400 border-amber-900/50 bg-amber-900/20';
            case 'Low': return 'text-emerald-400 border-emerald-900/50 bg-emerald-900/20';
            default: return 'text-slate-400 border-slate-700 bg-slate-800';
        }
    };

    return (
        <div className="flex h-full bg-slate-950 text-slate-200">
            {/* Playbook List Sidebar */}
            <div className="w-80 border-r border-sovereign-800 bg-slate-900/50 p-6 flex flex-col">
                <h2 className="text-lg font-serif text-sovereign-400 mb-6 tracking-wide">Tactical Playbooks</h2>
                <div className="space-y-4">
                    {initialPlaybooks.map(pb => (
                        <button
                            key={pb.id}
                            onClick={() => setSelectedPlaybook(pb)}
                            className={`w-full text-left p-4 rounded-lg border transition-all ${selectedPlaybook?.id === pb.id ? 'bg-sovereign-900/30 border-sovereign-600 text-sovereign-200 shadow-md' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-sovereign-700'}`}
                        >
                            <div className="font-bold text-sm mb-1">{pb.title}</div>
                            <div className="text-xs text-slate-500 line-clamp-2">{pb.description}</div>
                            <div className="mt-2 text-[10px] uppercase tracking-wider text-slate-600 font-mono">{pb.category}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
                {selectedPlaybook ? (
                    <div className="max-w-4xl mx-auto">
                        <header className="mb-10 border-b border-sovereign-800/50 pb-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-3 py-1 text-xs font-mono rounded-full bg-sovereign-900/50 text-sovereign-400 border border-sovereign-800">
                                    {selectedPlaybook.category} PROTOCOL
                                </span>
                                <span className="text-xs text-slate-500 font-mono">ID: {selectedPlaybook.id}</span>
                            </div>
                            <h1 className="text-3xl font-serif text-sovereign-100 mb-3">{selectedPlaybook.title}</h1>
                            <p className="text-slate-400 leading-relaxed">{selectedPlaybook.description}</p>
                        </header>

                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-sovereign-800 before:via-slate-800 before:to-transparent">
                            {selectedPlaybook.steps.map((step, idx) => (
                                <div key={step.id} className="relative pl-16 group">
                                    {/* Timeline Node */}
                                    <div className={`absolute left-0 top-1 w-12 h-12 rounded-full border-2 flex items-center justify-center bg-slate-950 z-10 transition-colors ${completedSteps[step.id] ? 'border-emerald-500 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-slate-700 text-slate-600'}`}>
                                        <span className="font-mono font-bold">{idx + 1}</span>
                                    </div>

                                    {/* Card */}
                                    <div className={`p-6 rounded-xl border bg-slate-900/80 backdrop-blur-sm transition-all duration-300 ${completedSteps[step.id] ? 'border-emerald-900/50 shadow-lg' : 'border-slate-800 hover:border-slate-700'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className={`text-xl font-bold ${completedSteps[step.id] ? 'text-emerald-400' : 'text-sovereign-200'}`}>
                                                {step.title}
                                            </h3>
                                            <div className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${getRiskColor(step.riskLevel)}`}>
                                                {step.riskLevel} Risk
                                            </div>
                                        </div>

                                        <p className="text-slate-300 mb-4 font-light text-lg">{step.action}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="p-4 rounded bg-slate-950/50 border border-slate-800/50">
                                                <div className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">Rationale</div>
                                                <p className="text-sm text-slate-400 italic">"{step.rationale}"</p>
                                            </div>
                                            <div className="p-4 rounded bg-slate-950/50 border border-slate-800/50">
                                                <div className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">Source</div>
                                                <p className="text-sm text-sovereign-400 font-mono">{step.source}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end border-t border-slate-800/50 pt-4">
                                            <button
                                                onClick={() => toggleStep(step.id)}
                                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${completedSteps[step.id] ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50' : 'bg-sovereign-600 text-slate-900 hover:bg-sovereign-500'}`}
                                            >
                                                {completedSteps[step.id] ? (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        <span>Completed</span>
                                                    </>
                                                ) : (
                                                    <span>Mark Complete</span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-600 font-mono uppercase tracking-widest">Select a Playbook Protocol</div>
                )}
            </div>
        </div>
    );
};

export default PlaybookNavigator;
