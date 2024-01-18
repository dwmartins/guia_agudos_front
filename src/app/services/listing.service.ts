import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  httpClient = inject(HttpClient);

  private API_URL = environment.API_URL;

  constructor() { }

  newListing() {
    
  }
}
