import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GlobalVariablesService } from '../../../services/helpers/global-variables.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  globalVariables = inject(GlobalVariablesService);

  logo: string = this.globalVariables.logo;
}
