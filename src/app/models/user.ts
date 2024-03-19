export interface User {
    id: number;
    name: string;
    lastName: string;
    email: string;
    aboutMe: string;
    address: string;
    complement: string;
    country: string;
    state: string;
    city: string;
    cep: number;
    phone: number;
    password: string;
    newPassword: string;
    active: 'Y' | 'N';
    user_type: 'admin' | 'common';
    photo_url: string;
    createdAt: string;
    updatedAt: string;
    token: string;
    [key: string]: string | number | boolean | 'Y' | 'N' | 'admin' | 'common';
}