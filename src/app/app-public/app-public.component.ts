import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-app-public',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app-public.component.html',
})
export class AppPublicComponent {

}
