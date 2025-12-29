import { Bond } from '../types';
import { scrapeNewIssues } from './emmaScraper';

const stateAbbreviations = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export const searchEmma = async (query: string): Promise<Bond[]> => {
    console.log(`Searching EMMA for: ${query}`);
    
    // Extract state from query or default to AL
    const queryParts = query.toUpperCase().split(' ');
    const state = queryParts.find(part => stateAbbreviations.includes(part)) || 'AL';

    const bonds = await scrapeNewIssues(state);
    
    // If the query is just a state, return all results for that state
    if (queryParts.length === 1 && stateAbbreviations.includes(queryParts[0])) {
        return bonds;
    }

    // Further filter by the original query for more relevance
    const lowerQuery = query.toLowerCase();
    return bonds.filter(bond => 
        bond.issuer.toLowerCase().includes(lowerQuery) ||
        bond.type.toLowerCase().includes(lowerQuery) ||
        bond.datedDate.includes(lowerQuery)
    );
};
