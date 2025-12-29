import React from 'react';

interface GuidingPrinciplesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuidingPrinciplesModal: React.FC<GuidingPrinciplesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-sovereign-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
          <h2 className="text-2xl font-serif font-bold text-sovereign-200">Guiding Principles</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white">&times;</button>
        </div>
        
        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <p>
            This platform is a cockpit for strategic navigation of administrative, financial, and legal systems. Our methodology is grounded in a deep respect for black-letter law and a commitment to using established, enforceable procedures to achieve real-world outcomes.
          </p>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
            <h3 className="font-bold text-sovereign-400 mb-2">Our Strategic Approach:</h3>
            <ul className="space-y-3 list-disc list-inside text-xs">
              <li>
                <span className="font-bold">Master the Administrative Process:</span> The most effective remedies are found by mastering the existing rules of procedure. We focus on using an agency's or corporation's own processes (deadlines, forms, and appeals) to ensure compliance and accountability.
              </li>
              <li>
                <span className="font-bold">Use Real, Enforceable Law:</span> Our playbooks are built on a foundation of powerful consumer protection and administrative laws, including the FDCPA, FCRA, TILA, RESPA, and the Administrative Procedure Act (APA). These are the tools that provide real leverage.
              </li>
              <li>
                <span className="font-bold">Manage Legal Personhood:</span> The legal system uses the concept of "legal persons" (e.g., corporations, trusts) to manage affairs. We use this same architecture to your advantage, helping you act in the proper 'capacity' (e.g., as an individual, a trustee, or a representative for an entity) to manage liability and control legal interactions.
              </li>
               <li>
                <span className="font-bold">Pragmatism Over Theory:</span> We prioritize what is effective over what is theoretical. Our goal is to generate responses, enforce deadlines, and achieve tangible outcomes, not to make philosophical points that are easily dismissed. Success is measured by results.
              </li>
            </ul>
          </div>

          <div className="p-4 bg-red-900/10 border border-red-800/50 rounded-lg">
            <h3 className="font-bold text-red-400 mb-2">A Rejection of Ineffective Tactics:</h3>
            <p className="text-xs text-red-300/90">
              This platform is designed for strategic execution, not "paper terrorism" or frivolous arguments. We explicitly reject tactics that have been consistently dismissed by courts and agencies, as they are counterproductive to achieving real remedy. This includes arguments based on pseudo-commercial theories (e.g., "accept for value" without a valid basis), unusual formatting, or attempts to claim immunity from the law. Our focus is on precision, discipline, and the diligent application of established legal and administrative processes.
            </p>
          </div>

          <p>
            By using this tool, you affirm your commitment to proceeding with strategic discipline, with a clear-eyed focus on real-world application of the law to achieve your desired outcome.
          </p>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={onClose} 
            className="px-8 py-2 bg-sovereign-700 hover:bg-sovereign-600 text-white font-bold font-serif rounded shadow-lg transition-all"
          >
            I Understand and Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidingPrinciplesModal;
