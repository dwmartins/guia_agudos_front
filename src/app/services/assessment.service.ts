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

  constructor() { }

  newAssessment(assessment: Assessment) {
    const user = this.authService.getUserLogged() || {} as User;

    const headers = new HttpHeaders({
      'user_id': user.id,
      'token': user.token
    }); 

    return this.httpClient.post<Assessment | Responses>(`${this.API_URL}/anuncios/avaliacoes`, assessment, {headers: headers});
  }

  fetchAll(listingId: number){
    return this.httpClient.get<Assessment[]>(`${this.API_URL}/anuncios/avaliacoes?listingId=${listingId}`);
  }

  delete(assessmentId: number) {
    const user = this.authService.getUserLogged() || {} as User;

    const headers = new HttpHeaders({
      'user_id': user.id,
      'token': user.token
    }); 

    return this.httpClient.delete<Responses>(`${this.API_URL}/anuncios/avaliacoes/${assessmentId}`, {headers: headers});
  }
}
