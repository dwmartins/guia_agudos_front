import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User, Responses } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environment.API_URL;

  constructor(private httpClient: HttpClient) { }

  login(user: User) {
    return this.httpClient.post<User | Responses>(`${this.API_URL}/usuario/login`, user);
  }

  sendNewPassword(user: User) {
    return this.httpClient.post<User | Responses>(`${this.API_URL}/usuario/nova-senha`, user);
  }
}
