import React from 'react';
import { Link } from 'react-router-dom';
import { SCRIPTS } from '../data/scripts';

const ScriptList: React.FC = () => {
  return (
    <div className="h-full bg-slate-950 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="border-b border-slate-800 pb-4 mb-6">
          <h1 className="text-3xl font-serif font-bold text-sovereign-200">Lawful Scripts</h1>
          <p className="text-slate-400 font-mono text-sm">Verbal templates for asserting rights and navigating processes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCRIPTS.map(script => (
            <Link
              key={script.id}
              to={`/scripts/${script.id}`}
              className="block bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-sovereign-700 transition-colors group"
            >
              <h2 className="font-bold font-serif text-lg text-sovereign-300 group-hover:text-sovereign-200 mb-2">{script.title}</h2>
              <p className="text-xs text-slate-400 mb-4">{script.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-500">{script.category}</span>
                <span className="text-xs font-mono text-sovereign-500 group-hover:underline">View Script &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScriptList;
