import React, { useState } from 'react';
import { generateAllonge } from '../services/geminiService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const EndorsementAllonge: React.FC = () => {
  const [instrumentDetails, setInstrumentDetails] = useState('');
  const [generatedAllonge, setGeneratedAllonge] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!instrumentDetails.trim()) {
      setError('Instrument details cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedAllonge('');
    try {
      const allonge = await generateAllonge(instrumentDetails);
      setGeneratedAllonge(allonge);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Endorsement Allonge Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="instrument-details" className="text-sm font-medium">
            Instrument Details & Endorsement Instructions
          </label>
          <Textarea
            id="instrument-details"
            placeholder="e.g., 'Pay to the order of The United States Treasury, for discharge of debt, per UCC 3-603. Instrument: IRS Notice CP14, Amount: $500, Date: 2024-07-26'"
            value={instrumentDetails}
            onChange={(e) => setInstrumentDetails(e.target.value)}
            className="h-32"
          />
        </div>
        
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Allonge'}
        </Button>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {generatedAllonge && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generated Allonge:</h3>
            <ScrollArea className="h-72 w-full rounded-md border p-4">
              <pre className="whitespace-pre-wrap text-sm">{generatedAllonge}</pre>
            </ScrollArea>
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(generatedAllonge)}>
              Copy to Clipboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EndorsementAllonge;
