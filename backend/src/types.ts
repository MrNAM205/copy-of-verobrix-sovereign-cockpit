export interface Bond {
    cusip: string;
    issuer: string;
    type: string;
    datedDate: string;
    state: string;
    details: string;
    cusipPrefix?: string | null;
    bondCategory?: string;
}
