import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User } from '../models/user';
import { Responses } from '../models/Responses';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environment.API_URL;

  constructor(private httpClient: HttpClient) { }

  login(user: User) {    
    return this.httpClient.post<User | Responses>(`${this.API_URL}/user/login`, user);
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

  validToken(user: User) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'user_id': user.id,
      'token': user.token
    });
    
    return this.httpClient.get<Responses>(`${this.API_URL}/user/auth`, { headers });
  }
}
