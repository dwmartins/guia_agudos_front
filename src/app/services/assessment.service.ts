import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Assessment } from '../models/Assessment';
import { Responses } from '../models/Responses';
import { AuthService } from './auth.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  httpClient  = inject(HttpClient);
  authService = inject(AuthService);

  private API_URL = environment.API_URL;
  user: User;
  headers: HttpHeaders;

  constructor() { 
    this.user = this.authService.getUserLogged() || {} as User;

    this.headers = new HttpHeaders({
      'user_id': this.user.id,
      'token': this.user.token
    }); 
  }

  newAssessment(assessment: Assessment) {
    return this.httpClient.post<Assessment | Responses>(`${this.API_URL}/anuncios/avaliacoes`, assessment, {headers: this.headers});
  }

  fetchAll(listingId: number){
    return this.httpClient.get<Assessment[]>(`${this.API_URL}/anuncios/avaliacoes?listingId=${listingId}`);
  }

  delete(assessmentId: number) {
    return this.httpClient.delete<Responses>(`${this.API_URL}/anuncios/avaliacoes/${assessmentId}`, {headers: this.headers});
  }
}
