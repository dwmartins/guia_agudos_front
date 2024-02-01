import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Carousel, Responses } from '../models/carousel';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  private API_URL = environment.API_URL;

  httpClient = inject(HttpClient);

  constructor() { }

  carousel(status: string | null) {
    return this.httpClient.get<Carousel[]>(`${this.API_URL}/carousel?status=${status}`);
  }
}
