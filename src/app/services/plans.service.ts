import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BannerPrice } from '../models/BannerPrice';
import { ListingPlans } from '../models/ListingPlans';

@Injectable({
  providedIn: 'root'
})
export class PlansService {

  private API_URL = environment.API_URL;

  httpClient = inject(HttpClient);

  constructor() { }

  banners(status: string | null) {
    return this.httpClient.get<BannerPrice[]>(`${this.API_URL}/banner?status=${status}`);
  }

  listingPlans(status: string | null) {
    return this.httpClient.get<ListingPlans[]>(`${this.API_URL}/anuncios/precos?status=${status}`);
  }
}
