import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Responses } from '../models/Responses';
import { User } from '../models/user';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PromotionalCodeService {
  httpClient = inject(HttpClient);
  authService = inject(AuthService);

  user: User;

  private API_URL = environment.API_URL;

  constructor() { 
    this.user = this.authService.getUserLogged() || {} as User;
  }

  validCode(code: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'user_id': this.user.id,
      'token': this.user.token
    });

    const promotionalCode = {
      code: code
    }

    return this.httpClient.post<Responses>(`${this.API_URL}/codigo-promocional/usar`, promotionalCode, { headers });
  }
}
