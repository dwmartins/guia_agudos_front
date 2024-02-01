import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ListingCategory } from '../models/listingCategory';

@Injectable({
  providedIn: 'root'
})
export class ListingCategoryService {
  
  private API_URL = environment.API_URL;

  httpClient = inject(HttpClient)

  constructor() { }

  categories(limit: number | null) {
    return this.httpClient.get<ListingCategory[]>(`${this.API_URL}/anuncios/categorias?limit=${limit}`);
  }
}
