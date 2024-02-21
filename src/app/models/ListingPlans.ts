export interface ListingPlans {
    id: number;
    description: string;
    level: string;
    isFree: string;
    active: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    plansInfo: ListingPlansInfo[]
}

export interface ListingPlansInfo {
    id: number;
    plansId: number;
    active: string;
    description: string;
    value: number;
    createdAt: string;
    updatedAt: string;
}