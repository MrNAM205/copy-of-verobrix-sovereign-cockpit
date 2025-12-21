import express from 'express';
import cors from 'cors';
import { searchEmma } from './services/emmaService';
import { searchFidelity } from './services/fidelityService';
import { searchBloomberg } from './services/bloombergService';
import { resolveCusipPrefix } from './intelligence/cusipResolver';
import { correlateStateFileNumber } from './intelligence/stateFileCorrelator';
import { classifyBondType } from './intelligence/bondTypeClassifier';
import { analyzeEraPatterns } from './intelligence/eraAnalyzer';
import { Bond } from './types';

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bond Intelligence Cockpit Backend is running!');
});

// --- API Endpoints ---

// POST /api/search - Search for bonds from all sources
app.post('/api/search', async (req, res) => {
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ error: 'Search query is required.' });
    }
    
    try {
        const [emmaResults, fidelityResults, bloombergResults] = await Promise.all([
            searchEmma(query),
            searchFidelity(query),
            searchBloomberg(query)
        ]);

        let allResults: Bond[] = [...emmaResults, ...fidelityResults, ...bloombergResults];

        // Add CUSIP prefix and classify bond type
        allResults = allResults.map(bond => ({
            ...bond,
            cusipPrefix: resolveCusipPrefix(bond.issuer),
            bondCategory: classifyBondType(bond.details)
        }));

        res.json(allResults);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while searching for bonds.' });
    }
});

// GET /api/bond/:cusip - Get bond details
app.get('/api/bond/:cusip', async (req, res) => {
    const { cusip } = req.params;
    
    const allBonds: Bond[] = [
        ...(await searchEmma(cusip)),
        ...(await searchFidelity(cusip)),
        ...(await searchBloomberg(cusip))
    ];
    
    let bond: Bond | undefined = allBonds.find(b => b.cusip === cusip);

    if (bond) {
        bond = {
            ...bond,
            cusipPrefix: resolveCusipPrefix(bond.issuer),
            bondCategory: classifyBondType(bond.details)
        };
        res.json(bond);
    } else {
        res.status(404).json({ error: 'Bond not found.' });
    }
});

// POST /api/correlate - Correlate State File Number to CUSIP
app.post('/api/correlate', (req, res) => {
    const { stateFileNumber } = req.body;
    if (!stateFileNumber) {
        return res.status(400).json({ error: 'State File Number is required.' });
    }
    
    const correlation = correlateStateFileNumber(stateFileNumber);
    res.json(correlation);
});

// POST /api/analyze/era - Analyze bond patterns for a given era
app.post('/api/analyze/era', async (req, res) => {
    const { year } = req.body;
    if (!year || typeof year !== 'number') {
        return res.status(400).json({ error: 'A valid year is required.' });
    }

    try {
        const allBonds: Bond[] = [
            ...(await searchEmma(year.toString())),
            ...(await searchFidelity(year.toString())),
            ...(await searchBloomberg(year.toString()))
        ];

        const analysis = analyzeEraPatterns(allBonds, year);
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while analyzing the era.' });
    }
});


app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
