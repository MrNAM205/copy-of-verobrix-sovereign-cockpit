import React, { useState, useEffect } from 'react';
import BondSearch from './bond-intelligence/BondSearch';
import BondResults from './bond-intelligence/BondResults';
import BondDetails from './bond-intelligence/BondDetails';

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

const BondIntelligence: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Bond[]>([]);
    const [selectedBond, setSelectedBond] = useState<Bond | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (query: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError('Failed to fetch bond data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Initial search on component mount
    useEffect(() => {
        handleSearch('Alabama');
    }, []);

    return (
        <div className="h-full bg-slate-950 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
                <header className="border-b border-slate-800 pb-6">
                    <h1 className="text-3xl font-serif font-bold text-sovereign-200">Municipal Bond Intelligence</h1>
                    <p className="text-slate-400 font-mono text-sm">CUSIP, Issuer, and Era-based Bond Analysis</p>
                </header>

                <BondSearch onSearch={handleSearch} loading={loading} />

                {error && (
                    <div className="text-center py-10 text-red-500 font-mono">
                        {error}
                    </div>
                )}

                {!error && (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg">
                        <BondResults results={results} onSelect={setSelectedBond} />
                    </div>
                )}
            </div>

            {selectedBond && <BondDetails bond={selectedBond} onClose={() => setSelectedBond(null)} />}
        </div>
    );
};

export default BondIntelligence;
