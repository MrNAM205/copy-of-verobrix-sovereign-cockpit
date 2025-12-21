// Placeholder for Bond Type Classification logic

export type BondCategory = 
    | 'Hospital Revenue'
    | 'Water Revenue'
    | 'Tobacco Settlement'
    | 'Transportation'
    | 'Education'
    | 'Economic Development'
    | 'General Obligation'
    | 'Unknown';

export const classifyBondType = (description: string): BondCategory => {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('hospital')) return 'Hospital Revenue';
    if (lowerDesc.includes('water')) return 'Water Revenue';
    if (lowerDesc.includes('tobacco')) return 'Tobacco Settlement';
    if (lowerDesc.includes('highway') || lowerDesc.includes('transportation')) return 'Transportation';
    if (lowerDesc.includes('school') || lowerDesc.includes('education')) return 'Education';
    if (lowerDesc.includes('economic development')) return 'Economic Development';
    if (lowerDesc.includes('general obligation')) return 'General Obligation';
    return 'Unknown';
};
