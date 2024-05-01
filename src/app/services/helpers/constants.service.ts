import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  // Dados do site
  siteTitle     = "Guia Paulista";
  webSiteName   = "Guia Paulista";
  websiteLogo   = "GuiaPaulista";
  webSiteDomain = "guiapaulista.com"

  // Dados o admin
  adminName = "Douglas";
  adminPhone = "14991882505";
  adminEmail = "douglas5422@outlook.com";

  // Dados da api
  api_url = environment.API_URL;

  system_photos   = `${this.api_url}/files/system_photos/`;
  user_photos     = `${this.api_url}/files/user_photos/`;
  listing_cover   = `${this.api_url}/files/listing_cover/`;
  listing_gallery = `${this.api_url}/files/listing_gallery/`;

  constructor() { }
}
