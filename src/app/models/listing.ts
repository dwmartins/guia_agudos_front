export interface Listing{
    name: string;
    summary: string;
    description: string;
    categories:  string[];
    keywords:  string[];
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
    [key: string]: string | number | string[];
}