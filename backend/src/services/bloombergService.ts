import { Bond } from '../types';

// Placeholder for Bloomberg API integration
const MOCK_BLOOMBERG_BONDS: Bond[] = [
    { 
        cusip: '01077PAA5',
        issuer: 'Alabama 21st Century Authority', 
        type: 'Tobacco Settlement Revenue Bonds', 
        datedDate: '2012-08-01',
        state: 'Alabama',
        details: 'Series 2012-A - From Bloomberg'
    },
];

export const searchBloomberg = async (query: string): Promise<Bond[]> => {
    console.log(`Searching Bloomberg for: ${query}`);
    // In a real implementation, this would make a request to the Bloomberg API
    const lowerQuery = query.toLowerCase();
    return MOCK_BLOOMBERG_BONDS.filter(bond => 
        bond.issuer.toLowerCase().includes(lowerQuery) ||
        bond.type.toLowerCase().includes(lowerQuery) ||
        bond.state.toLowerCase().includes(lowerQuery) ||
        bond.datedDate.includes(lowerQuery)
    );
};
