import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AlertsComponent } from './shared/components/alerts/alerts.component';
import { GlobalAlertsComponent } from './shared/components/global-alerts/global-alerts.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AlertsComponent, GlobalAlertsComponent, SpinnerComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'guia_agudos_front';
}
