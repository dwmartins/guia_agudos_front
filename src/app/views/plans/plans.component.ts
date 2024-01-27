import { Component, OnInit, inject } from '@angular/core';
import { BannerPrice } from '../../../models/BannerPrice';
import { PlansService } from '../../services/plans.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';
import { Footer2Component } from '../../components/footer-2/footer-2.component';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, Footer2Component],
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
