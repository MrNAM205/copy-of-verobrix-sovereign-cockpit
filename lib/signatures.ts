import { Persona, SignatureMode } from '../types';

/**
 * Generates a signature string based on the persona and selected signature mode.
 *
 * @param persona - The active persona object.
 * @param mode - The selected signature mode.
 * @returns A formatted signature string.
 */
export const generateSignature = (persona: Persona | null, mode: SignatureMode): string => {
  if (!persona) {
    return 'No active persona selected.';
  }

  const fullName = `${persona.givenName} ${persona.familyName}`;

  switch (mode) {
    case SignatureMode.INDIVIDUAL:
      // Combines given name with a colon for the family name, per user spec
      return `${persona.givenName}: ${persona.familyName}`;

    case SignatureMode.REPRESENTATIVE:
      return `${fullName}, Authorized Representative`;

    case SignatureMode.TRUSTEE:
      return `${fullName}, Trustee`;
      
    case SignatureMode.EXECUTOR:
      return `${fullName}, Executor`;

    case SignatureMode.UCC_RESERVATION:
      return `${fullName}, without prejudice`;

    default:
      // Fallback for any unhandled cases
      return fullName;
  }
};
