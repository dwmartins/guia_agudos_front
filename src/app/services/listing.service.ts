import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { Listing } from '../models/listing';
import { Responses } from '../models/Responses';

@Injectable({
    providedIn: 'root'
})
export class ListingService {
    httpClient  = inject(HttpClient);
    authService = inject(AuthService);

    private API_URL = environment.API_URL;
    user: User;

    constructor() {
        this.user = this.authService.getUserLogged() || {} as User;
    }

    getAll(category: number, keywords: string) {
        return this.httpClient.get<Listing[]>(`${this.API_URL}/anuncios/?status=ativo&category=${category}&keywords=${keywords}`);
    }

    getById(id: number) {
        return this.httpClient.get<Listing>(`${this.API_URL}/anuncios/?listingId=${id}`);
    }

    newListing(listing: Listing, logoImage: File, coverImage: File, galleryImages: File[]) {
        const headers = new HttpHeaders({
            'user_id': this.user.id,
            'token': this.user.token
        });
        
        const formData = new FormData();

        if(logoImage) {
            formData.append('logoImage', logoImage);
        }
        
        if(coverImage) {
            formData.append('coverImage', coverImage);
        }

        if(galleryImages) {
            galleryImages.forEach((file, index) => {
                formData.append('galleryImage', file);
            });
        }

        for (const [key, value] of Object.entries(listing)) {
            if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value);
            }
        }

        return this.httpClient.post<Responses | Listing>(`${this.API_URL}/anuncios`, formData, {headers})
    }
}
