export interface Listing{
    id: number;
    title: string;
    summary: string;
    description: string;
    categories:  string[];
    keywords:  string[];
    payment: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    facebook: string;
    instagram: string;
    linkedIn: string;
    phone: string;
    email: string;
    url: string;
    promotionalCode: string;
    freePlan: boolean;
    expiration: string;
}