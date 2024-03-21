import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  // Dados do site
  siteTitle   = "Guia Paulista";
  webSiteName = "Guia Paulista";
  websiteLogo = "GuiaPaulista";

  // Dados o admin
  adminName = "Douglas";
  adminPhone = "14991882505";
  adminEmail = "douglas5422@outlook.com";

  constructor() { }
}
