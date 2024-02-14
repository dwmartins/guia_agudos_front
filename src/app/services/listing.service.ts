import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { Listing } from '../models/listing';

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

    newListing(listing: Listing, logoImage: File, coverImage: File, galleryImages: File[]) {
        const headers = new HttpHeaders({
            'user_id': this.user.id,
            'token': this.user.token
        });
        
        const formData = new FormData();

        formData.append('logoImage', logoImage);
        formData.append('coverImage', coverImage);

        if(galleryImages) {
            galleryImages.forEach((file, index) => {
                formData.append('galleryImage', file, `galleryImage${index + 1}`);
            });
        }

        Object.keys(listing).forEach(key => {
            formData.append(key, String(listing[key]));
        });

        console.log(formData)

        return this.httpClient.post<Listing | Response>(`${this.API_URL}/anuncios`, formData, {headers})
    }
}
