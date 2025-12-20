import React, { useState } from 'react';

type Status = 'pro_se' | 'sui_juris' | 'authorized_rep';

const STATUS_INFO = {
  pro_se: {
    title: 'Pro Se',
    subtitle: 'Representing the Legal Fiction',
    implication: 'You are admitting to being the legal person/defendant and acting as its attorney. This fully consents to the court\'s jurisdiction.',
    strength: 'Weakest',
    color: 'red',
  },
  sui_juris: {
    title: 'Sui Juris / In Propria Persona',
    subtitle: 'Appearing as a Man/Woman',
    implication: 'You are asserting you are a competent, living man or woman, distinct from the legal fiction. This challenges joinder and presumptive consent.',
    strength: 'Stronger',
    color: 'amber',
  },
  authorized_rep: {
    title: 'Authorized Representative',
    subtitle: 'Acting for the Legal Fiction',
    implication: 'You are the principal/beneficiary of the legal entity, appearing on its behalf to settle the account. This places you in a superior, creditor position.',
    strength: 'Strongest',
    color: 'emerald',
  }
};

const StatusSelector: React.FC = () => {
  const [selected, setSelected] = useState<Status>('authorized_rep');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-6 shadow-lg">
        <h3 className="text-sm font-bold text-sovereign-400 uppercase tracking-widest mb-4">
            Select Your Standing
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
            This selection is for educational purposes to understand your capacity. The strongest standing is "Authorized Representative," which separates the living man from the commercial entity.
        </p>
    </div>
  );
};

export default StatusSelector;
