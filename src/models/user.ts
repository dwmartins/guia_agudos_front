export interface User {
    id: number;
    name: string;
    lastName: string;
    email: string;
    active: 'Y' | 'N';
    user_type: 'admin' | 'common';
    photo_url: string;
    createdAt: string;
    updatedAt: string;
    token: string;
}

export interface Responses {
    alert: string;
    error: string;
}