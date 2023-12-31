import { Component, OnInit, inject } from '@angular/core';
import { BannerPrice } from '../../../models/BannerPrice';
import { PlansService } from '../../services/plans.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.css'
})
export class PlansComponent implements OnInit{
  plansService = inject(PlansService);

  banners: BannerPrice[] = [];

  ngOnInit(): void {
    this.getBanners();
  }

  getBanners() {
    this.plansService.banners("Y").subscribe((response) =>{
      this.banners = response;
    }, (error) => {
      console.error('ERROR: ', error);
    })
  }
}
