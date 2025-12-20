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
            This platform is dedicated to the principles of lawful self-governance, accountability, and the masterful use of administrative and commercial processes. Our methodology is grounded in black-letter law and historical precedent, not in frivolous arguments or extremist ideologies.
          </p>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
            <h3 className="font-bold text-sovereign-400 mb-2">Our Core Tenets:</h3>
            <ul className="space-y-2 list-disc list-inside text-xs">
              <li>
                <span className="font-bold">Accountability through Paperwork:</span> We believe that the pen is mightier than the sword. Correctly structured and lawfully sound documents are the primary tools for holding entities accountable.
              </li>
              <li>
                <span className="font-bold">Commercial Law as the Basis:</span> We operate on the understanding that modern governance functions primarily through commercial law (e.g., the Uniform Commercial Code - UCC), treating notices and charges as contracts or presentments.
              </li>
              <li>
                <span className="font-bold">Distinction, Not Separation:</span> We emphasize the critical legal distinction between the "living man/woman" (the principal) and the "legal fiction" or "strawman" (the transmitting utility). This is a principle of control and liability, not an attempt to create a "diplomatic immunity" from all law.
              </li>
              <li>
                <span className="font-bold">Honor and Discharge:</span> We advocate for honoring all presentments by "accepting them for value" and discharging them through proper administrative processes, rather than dishonoring them by arguing or ignoring them.
              </li>
            </ul>
          </div>

          <div className="p-4 bg-red-900/10 border border-red-800/50 rounded-lg">
            <h3 className="font-bold text-red-400 mb-2">What We Unequivocally Reject:</h3>
            <p className="text-xs text-red-300/90">
              This platform and its creators explicitly disavow and condemn any association with so-called "sovereign citizen" groups that advocate for unlawful violence, tax evasion schemes, or frivolous "paper terrorism." Such actions are counterproductive, dishonorable, and have no place in the pursuit of lawful remedy. We are scholars of law and administrative process, not adherents to any ideology that promotes conflict or disrespect for the rule of law. The term "sovereign citizen" is often a pejorative label used to dismiss valid legal arguments; we reclaim the term "sovereign" in its original meaning: to be the final authority in one's own affairs, operating honorably within the bounds of law.
            </p>
          </div>

          <p>
            By using this tool, you affirm your commitment to proceeding in honor, with clean hands, and with a sincere intent to achieve lawful and peaceful remedy through the administrative process.
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
