import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User } from '../models/user';
import { Responses } from '../models/Responses';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  httpClient  = inject(HttpClient);
  authService = inject(AuthService);

  private API_URL = environment.API_URL;
  user!: User;

  constructor() {
    this.user = this.authService.getUserLogged() || {} as User;
  }

  sendNewPassword(user: User) {
    return this.httpClient.post<User | Responses>(`${this.API_URL}/user/new-password`, user);
  }

  newUser(user: User, photo: File) {
    const formData = new FormData();

    formData.append('photo', photo);

    Object.keys(user).forEach(key => {
      formData.append(key, String(user[key]));
    });

    return this.httpClient.post<User | Responses>(`${this.API_URL}/user/create`, formData);
  }

  updatePhoto(photo: File) {

    const headers = new HttpHeaders({
      'user_id': this.user.id,
      'token': this.user.token
    });

    const formData = new FormData();
    formData.append('photo', photo);

    Object.keys(this.user).forEach(key => {
        formData.append(key, String(this.user[key]));
    });

    return this.httpClient.put<User>(`${this.API_URL}/user/update-photo`, formData, {headers: headers});
  }
}
