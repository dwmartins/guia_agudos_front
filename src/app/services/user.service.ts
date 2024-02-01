import { HttpClient, HttpClientModule } from '@angular/common/http';
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
    return this.httpClient.post<User | Responses>(`${this.API_URL}/usuario/login`, user);
  }

  sendNewPassword(user: User) {
    return this.httpClient.post<User | Responses>(`${this.API_URL}/usuario/nova-senha`, user);
  }

  newUser(user: User, photo: File) {
    const formData = new FormData();

    formData.append('photo', photo);

    Object.keys(user).forEach(key => {
      formData.append(key, String(user[key]));
    });

    return this.httpClient.post<User | Responses>(`${this.API_URL}/usuario/novo`, formData);
  }

  testeee(photo: File) {
    const formData = new FormData();
    formData.append('photo', photo)
    formData.append('name', 'douglas')
    formData.append('teste', 'dodsdsuglas')

    return this.httpClient.post<User | Responses>(`${this.API_URL}/usuario/novo`, formData);
  }
}
