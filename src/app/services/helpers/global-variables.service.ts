import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {

  title = "Guia Paulista";
  logo = "GuiaPaulista"

  constructor() { }
}
