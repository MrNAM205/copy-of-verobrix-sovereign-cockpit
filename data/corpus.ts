import { CorpusItem, CorpusType } from '../types';

export const CORPUS: CorpusItem[] = [
    {
        id: 'legal-personhood-concept',
        type: CorpusType.COMMENTARY,
        title: 'The Doctrine of Legal Personhood',
        citation: 'See, e.g., Santa Clara County v. Southern Pacific Railroad, 118 U.S. 394 (1886)',
        jurisdiction: 'Federal / Foundational',
        tags: ['personhood', 'capacity', 'corporate-law', 'legal-fiction'],
        text: `Jurisprudence has long recognized the concept of a "legal person" — an entity that is not a human being but is treated as one for legal purposes. Corporations, trusts, and government agencies are all legal persons. This doctrine is a tool that allows the law to manage complex commercial and administrative affairs by creating distinct entities with their own rights and responsibilities. Understanding this is the first step to navigating the administrative state.`,
        notes: `This reframes the 'strawman' idea into the recognized legal doctrine of corporate or entity personhood. It's accurate, defensible, and achieves the same goal of establishing a separate entity.`
    },
    {
        id: 'statutory-identity',
        type: CorpusType.COMMENTARY,
        title: 'The Individual vs. The Statutory Persona',
        citation: '26 U.S. Code § 7701(a)(1); UCC § 1-201(b)(27)',
        jurisdiction: 'Federal / Statutory',
        tags: ['personhood', 'capacity', 'statutory-law', 'irs', 'ucc'],
        text: `When interacting with administrative systems (like the IRS or a state DMV), an individual is often treated as a "Person" as defined within that system's governing statutes. This creates a 'statutory persona'—an administrative identity used for tracking, taxing, and contracting. The strategic approach is not to deny this persona exists, but to clarify your relationship to it: you are the living individual, acting in a specific capacity (e.g., as representative or agent) for that statutory persona.`,
        notes: `This replaces the ALL-CAPS NAME theory with a more precise concept: an identity created by and for a specific statutory system. It's grounded in how the tax code and UCC actually operate.`
    },
    {
        id: 'agency-representative-capacity',
        type: CorpusType.DOCTRINE,
        title: 'Agency and Representative Capacity',
        citation: 'Restatement (Third) of Agency § 1.01',
        jurisdiction: 'Common Law',
        tags: ['agency', 'capacity', 'principal', 'agent', 'representative'],
        text: `Agency is the fiduciary relationship that arises when one person (a "principal") manifests assent to another person (an "agent") that the agent shall act on the principal's behalf and subject to the principal's control. By clearly stating you are acting "as an authorized representative" or "by agent," you are invoking this powerful legal framework. This allows you to perform duties for the statutory persona without becoming personally liable for its obligations, provided you act within the scope of your authority.`,
        notes: 'This provides the core mechanism for the PersonaManager. It gives the user a legally recognized way to act for their "statutory persona" without using sovereign citizen language.'
    },
    {
        id: 'ucc-definition-person',
        type: CorpusType.STATUTE,
        title: 'UCC § 1-201(b)(27) - Definition of "Person"',
        citation: 'Uniform Commercial Code § 1-201(b)(27)',
        jurisdiction: 'State / Commercial Law',
        tags: ['ucc', 'personhood', 'definition', 'commercial-law'],
        text: `The UCC broadly defines a "Person" as "an individual, corporation, business trust, estate, trust, partnership, limited liability company, association, joint venture, government, governmental subdivision, agency, or instrumentality, public corporation, or any other legal or commercial entity." This definition is crucial because it confirms that the commercial legal system views "individuals" and various "legal entities" as distinct types of persons.`,
        notes: 'This is a direct statutory anchor. It shows, in black-letter law, that the distinction between an individual and other legal/commercial entities is real and codified.'
    }
];
