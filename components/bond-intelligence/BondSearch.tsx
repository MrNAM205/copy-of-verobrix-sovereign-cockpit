import React, { useState } from 'react';

interface BondSearchProps {
    onSearch: (query: string) => void;
    loading: boolean;
}

const BondSearch: React.FC<BondSearchProps> = ({ onSearch, loading }) => {
    const [query, setQuery] = useState('Alabama 1987');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSearch} className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex items-center gap-4">
            <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-sovereign-500"
                placeholder="Search by State, Year, Issuer, or Bond Type (e.g., Alabama 1987)"
            />
            <button 
                type="submit"
                disabled={loading}
                className="bg-sovereign-700 hover:bg-sovereign-600 text-white px-6 py-2 rounded text-sm font-bold font-serif disabled:opacity-50"
            >
                {loading ? 'SEARCHING...' : 'SEARCH'}
            </button>
        </form>
    );
};

export default BondSearch;
