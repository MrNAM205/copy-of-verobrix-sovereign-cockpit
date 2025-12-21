import { Bond } from '../types';

// Placeholder for MSRB EMMA API integration
const MOCK_EMMA_BONDS: Bond[] = [
    { 
        cusip: '518066AA3',
        issuer: 'Lauderdale County & Florence Ala Public Hospital Board', 
        type: 'Hospital Revenue Bonds', 
        datedDate: '1987-10-01',
        state: 'Alabama',
        details: 'Hospital Revenue Bonds (Coffee Health Group), 1987 - From EMMA'
    },
];

export const searchEmma = async (query: string): Promise<Bond[]> => {
    console.log(`Searching EMMA for: ${query}`);
    // In a real implementation, this would make a request to the EMMA API
    const lowerQuery = query.toLowerCase();
    return MOCK_EMMA_BONDS.filter(bond => 
        bond.issuer.toLowerCase().includes(lowerQuery) ||
        bond.type.toLowerCase().includes(lowerQuery) ||
        bond.state.toLowerCase().includes(lowerQuery) ||
        bond.datedDate.includes(lowerQuery)
    );
};
