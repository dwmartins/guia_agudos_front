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

  user_photos     = `${this.api_url}/files/user_photos/`;
  listing_logo    = `${this.api_url}/files/listing_logo/`;
  listing_cover   = `${this.api_url}/files/listing_cover/`;
  listing_gallery = `${this.api_url}/files/listing_gallery/`;

  user_photo_default = `${this.api_url}/files/system_photos/user_image.png`;
  listing_logo_default = `${this.api_url}/files/system_photos/listing_image.png`;

  constructor() { }
}
