import React, { useState } from 'react';

type Status = 'pro_se' | 'sui_juris' | 'authorized_rep';

const STATUS_INFO = {
  pro_se: {
    title: 'Pro Se (Acting as the Persona)',
    subtitle: 'Assuming the role of the Statutory Persona',
    implication: 'You are identifying as the statutory persona and representing it yourself. This fully accepts the jurisdiction of the administrative body or court over the persona.',
    strength: 'Standard',
    color: 'red',
  },
  sui_juris: {
    title: 'In Propria Persona (Individual Capacity)',
    subtitle: 'Appearing as a private individual',
    implication: 'You are asserting that you are a private individual, not acting in a representative or official capacity. Courts may still presume you are acting for the statutory persona unless clearly stated otherwise.',
    strength: 'Situational',
    color: 'amber',
  },
  authorized_rep: {
    title: 'Authorized Representative',
    subtitle: 'Acting in a Representative Capacity',
    implication: 'You are the principal acting on behalf of the statutory persona (the agent). This establishes a clear legal distinction, allowing you to manage its affairs without incurring personal liability.',
    strength: 'Strategic',
    color: 'emerald',
  }
};

const StatusSelector: React.FC = () => {
  const [selected, setSelected] = useState<Status>('authorized_rep');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-6 shadow-lg">
        <h3 className="text-sm font-bold text-sovereign-400 uppercase tracking-widest mb-4">
            Select Your Legal Capacity
        </h3>
        <div className="space-y-3">
            {(Object.keys(STATUS_INFO) as Status[]).map(key => {
                const status = STATUS_INFO[key];
                const isSelected = selected === key;
                return (
                    <div 
                        key={key}
                        onClick={() => setSelected(key)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${ 
                            isSelected 
                                ? `border-${status.color}-500 bg-${status.color}-900/20` 
                                : 'border-slate-700 hover:border-slate-600'
                        }`}
                    >
                        <div className="flex justify-between items-center">
                            <h4 className={`font-bold text-sm text-${status.color}-400`}>{status.title}</h4>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border border-${status.color}-800 bg-${status.color}-900/50`}>
                                {status.strength}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono mt-1 mb-2">{status.subtitle}</p>
                        <p className="text-xs text-slate-400 leading-tight">{status.implication}</p>
                    </div>
                )
            })}
        </div>
        <p className="text-[10px] text-slate-500 mt-4 italic">
            This selection helps clarify your legal capacity. "Authorized Representative" is often the most strategic standing as it distinguishes the individual from the statutory persona being managed.
        </p>
    </div>
  );
};

export default StatusSelector;
