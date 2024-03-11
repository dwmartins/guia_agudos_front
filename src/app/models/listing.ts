import { Review } from "./Review";

export interface Listing{
    id: number;
    user_id: number;
    expiration: string;
    title: string;
    summary: string;
    description: string;
    keywords:  string[] | null;
    email: string;
    url: string;
    phone: string;
    address: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
    map: string;
    status: string;
    plan: string;
    planId: number;
    observation: string;
    facebook: string;
    instagram: string;
    linkedIn: string;
    openingHours: string;
    paymentId: number;
    logoImage: string;
    coverImage: string;
    galleryImage: ListingGalleryImg[];
    payment: number;
    promotionalCode: string;
    freePlan: boolean;
    reviews: Review[];
    createdAt: string;
    updatedAt: string;
}

export interface ListingGalleryImg {
    id: number;
    listingId: number;
    imgUrl: string;
    createdAt: string;
    updatedAt: string;
}