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

interface BondResultsProps {
    results: Bond[];
    onSelect: (bond: Bond) => void;
}

const BondResults: React.FC<BondResultsProps> = ({ results, onSelect }) => {
    if (results.length === 0) {
        return (
            <div className="text-center py-20 text-slate-600 italic font-mono">
                No results found.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-slate-400">
                <thead className="bg-slate-900 text-xs text-slate-500 uppercase font-mono">
                    <tr>
                        <th scope="col" className="px-6 py-3">CUSIP</th>
                        <th scope="col" className="px-6 py-3">Issuer</th>
                        <th scope="col" className="px-6 py-3">Category</th>
                        <th scope="col" className="px-6 py-3">Dated Date</th>
                        <th scope="col" className="px-6 py-3"><span className="sr-only">Details</span></th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((bond) => (
                        <tr key={bond.cusip} className="border-b border-slate-800 hover:bg-slate-900/50">
                            <th scope="row" className="px-6 py-4 font-mono text-sovereign-400 whitespace-nowrap">
                                {bond.cusip}
                            </th>
                            <td className="px-6 py-4">{bond.issuer}</td>
                            <td className="px-6 py-4">
                                <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300">{bond.bondCategory}</span>
                            </td>
                            <td className="px-6 py-4 font-mono">{bond.datedDate}</td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => onSelect(bond)} className="font-medium text-sovereign-500 hover:underline">
                                    Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BondResults;
