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

  constructor() { 
    this.user = this.authService.getUserLogged() || {} as User;
  }

  newAssessment(assessment: Assessment) {
    const headers = new HttpHeaders({
      'user_id': this.user.id,
      'token': this.user.token
    });

    return this.httpClient.post<Assessment | Responses>(`${this.API_URL}/anuncios/avaliacoes`, assessment, {headers});
  }

  fetchAll(status: string | null){
    return this.httpClient.get<Assessment[] | Responses>
  }
}
