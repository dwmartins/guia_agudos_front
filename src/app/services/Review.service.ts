import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Review } from '../models/Review';
import { Responses } from '../models/Responses';
import { AuthService } from './auth.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  httpClient  = inject(HttpClient);
  authService = inject(AuthService);

  private API_URL = environment.API_URL;

  constructor() { }

  newReview(review: Review) {
    const user = this.authService.getUserLogged() || {} as User;

    const headers = new HttpHeaders({
      'user_id': user.id,
      'token': user.token
    }); 

    return this.httpClient.post<Responses>(`${this.API_URL}/anuncios/avaliacoes`, review, {headers: headers});
  }

  updateReview(review: Review) {
    const user = this.authService.getUserLogged() || {} as User;

    const headers = new HttpHeaders({
      'user_id': user.id,
      'token': user.token
    }); 

    return this.httpClient.put<Review>(`${this.API_URL}/anuncios/avaliacoes`, review, {headers: headers});
  }

  fetchAllByListing(listingId: number){
    return this.httpClient.get<Review[]>(`${this.API_URL}/anuncios/avaliacoes?listingId=${listingId}`);
  }

  delete(reviewId: number) {
    const user = this.authService.getUserLogged() || {} as User;

    const headers = new HttpHeaders({
      'user_id': user.id,
      'token': user.token
    }); 

    return this.httpClient.delete<Responses>(`${this.API_URL}/anuncios/avaliacoes/${reviewId}`, {headers: headers});
  }
}
