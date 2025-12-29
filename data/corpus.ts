import { CorpusItem, CorpusType } from '../types';

export const CORPUS: CorpusItem[] = [
    {
        id: 'three-fifths-precedent',
        type: CorpusType.COMMENTARY,
        title: 'The Three-Fifths Precedent',
        citation: 'U.S. Constitution, Art. 1, Sec. 2, Cl. 3 (Superseded)',
        jurisdiction: 'Federal / Historical',
        tags: ['status', 'strawman', 'history', 'personhood'],
        text: `The Three-Fifths Compromise is not merely a historical relic concerning slavery; it is the foundational precedent for the state's ability to create a separate, taxable "person" attached to a living man but not equal to him. It established that a man could be legally and commercially bifurcated. The ALL-CAPS "legal fiction" is the modern heir to this concept—an administrable entity for the state to contract with. The strategic remedy is not to argue the history, but to rebut the presumption that you are this fractional "person" by assuming the capacity of Authorized Representative for the entity.`
    },
    // ... existing corpus items
];