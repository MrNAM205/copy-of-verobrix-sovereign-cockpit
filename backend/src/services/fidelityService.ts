import { Bond } from '../types';

// Placeholder for Fidelity Fixed Income API integration
const MOCK_FIDELITY_BONDS: Bond[] = [
    { 
        cusip: '010757AA3',
        issuer: 'Alabaster Water Board', 
        type: 'Water Revenue Bonds', 
        datedDate: '2019-12-01',
        state: 'Alabama',
        details: 'Water Revenue & Refunding Bonds, Series 2019 - From Fidelity'
    },
];

export const searchFidelity = async (query: string): Promise<Bond[]> => {
    console.log(`Searching Fidelity for: ${query}`);
    // In a real implementation, this would make a request to the Fidelity API
    const lowerQuery = query.toLowerCase();
    return MOCK_FIDELITY_BONDS.filter(bond => 
        bond.issuer.toLowerCase().includes(lowerQuery) ||
        bond.type.toLowerCase().includes(lowerQuery) ||
        bond.state.toLowerCase().includes(lowerQuery) ||
        bond.datedDate.includes(lowerQuery)
    );
};
