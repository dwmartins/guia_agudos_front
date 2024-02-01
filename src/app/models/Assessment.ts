export interface Assessment {
    id: number;
    listing_id: number;
    name: string;
    comment: string;
    assessment: number;
    active: 'Y' | 'N';
    createdAt: string;
    updatedAt: string;
}