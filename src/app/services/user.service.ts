import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User, Warnings } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environment.API_URL;

  constructor(private httpClient: HttpClient) { }

  login(user: User) {
    return this.httpClient.post<User | Warnings>(`${this.API_URL}/usuario/login`, user);
  }
}
