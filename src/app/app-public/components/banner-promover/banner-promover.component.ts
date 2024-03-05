import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GlobalVariablesService } from '../../../services/helpers/global-variables.service';

@Component({
  selector: 'app-banner-promover',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './banner-promover.component.html',
  styleUrl: './banner-promover.component.css'
})
export class BannerPromoverComponent {
  globalVariables = inject(GlobalVariablesService);
}
