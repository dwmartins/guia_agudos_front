import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConstantsService } from '../../../services/helpers/constants.service';

@Component({
  selector: 'app-banner-promover',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './banner-promover.component.html',
  styleUrl: './banner-promover.component.css'
})
export class BannerPromoverComponent {
  constantsService = inject(ConstantsService);
}
