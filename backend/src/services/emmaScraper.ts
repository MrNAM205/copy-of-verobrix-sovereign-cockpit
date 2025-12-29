import axios from 'axios';
import { Bond } from '../types';

// DISCLAIMER: This scraper is for educational and demonstration purposes only.
// The MSRB EMMA website structure may change, which would break this scraper.
// A robust implementation should use the official MSRB API if available or a headless browser.

const EMMA_BASE_URL = 'https://emma.msrb.org';

export const scrapeNewIssues = async (state: string = 'AL'): Promise<Bond[]> => {
    try {
        const searchUrl = `${EMMA_BASE_URL}/Issue/GetNewIssues?searchCriteria.states[0]=${state}&searchCriteria.issueDateFrom=${getOneYearAgoDate()}&searchCriteria.issueDateTo=${getTodayDate()}`;

        const response = await axios.get(searchUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "en-US,en;q=0.9",
                "Referer": "https://emma.msrb.org/",
                "Origin": "https://emma.msrb.org",
                "Connection": "keep-alive"
            },
            timeout: 15000
        });
        
        const issues = response.data.Nis;

        if (!issues || issues.length === 0) {
            return [];
        }

        const bonds: Bond[] = issues.map((issue: any) => ({
            cusip: issue.Cusip,
            issuer: issue.Issuer,
            type: issue.Desc,
            datedDate: issue.DatedDate.split('T')[0],
            state: issue.State,
            details: issue.Desc,
        }));

        return bonds;

    } catch (error) {
        console.error('Error scraping EMMA:', error);
        return [{
            cusip: 'ETIMEDOUT',
            issuer: 'EMMA Connection Error',
            type: 'The MSRB EMMA website is not responding to automated requests.',
            datedDate: getTodayDate(),
            state: state,
            details: 'This is a network-level block or timeout. A more robust scraping method (e.g., headless browser) is required for long-term reliability.'
        }];
    }
};

const getTodayDate = () => {
    const today = new Date();
    return `${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}-${today.getFullYear()}`;
}

const getOneYearAgoDate = () => {
    const today = new Date();
    const oneYearAgo = new Date(new Date().setFullYear(today.getFullYear() - 1));
    return `${(oneYearAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneYearAgo.getDate().toString().padStart(2, '0')}-${oneYearAgo.getFullYear()}`;
}