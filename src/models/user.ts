export interface User {
    id: number;
    name: string;
    lastName: string;
    email: string;
    active: 'Y' | 'N';
    user_type: 'admin' | 'user';
    photo_url: string;
    createdAt: string;
    updatedAt: string;
    token: string;
}

export interface Warnings {
    alert: string;
    error: string;
}