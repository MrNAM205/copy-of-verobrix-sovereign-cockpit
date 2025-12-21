import { classifyBondType, BondCategory } from './bondTypeClassifier';
import { Bond } from '../types';

export const analyzeEraPatterns = (bonds: Bond[], era: number): { dominantType: BondCategory, trend: string } => {
    const eraBonds = bonds.filter(bond => new Date(bond.datedDate).getFullYear() === era);

    if (eraBonds.length === 0) {
        return {
            dominantType: 'Unknown',
            trend: 'No bond data available for this era.'
        };
    }

    const typeCounts = eraBonds.reduce((acc, bond) => {
        const category = classifyBondType(bond.details);
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {} as Record<BondCategory, number>);

    const dominantType = Object.keys(typeCounts).reduce((a, b) => typeCounts[a as BondCategory] > typeCounts[b as BondCategory] ? a : b) as BondCategory;

    let trend = 'Revenue-backed financing appears dominant.';
    if (dominantType === 'General Obligation') {
        trend = 'General Obligation bonds were significant in this era.';
    } else if (dominantType.includes('Revenue')) {
        trend = `${dominantType} bonds were a key financing tool.`;
    }

    return {
        dominantType,
        trend
    };
};
