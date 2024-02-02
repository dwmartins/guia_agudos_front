import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AlertsComponent } from './shared/components/alerts/alerts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AlertsComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'guia_agudos_front';
}
