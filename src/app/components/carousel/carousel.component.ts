import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { Carousel } from '../../../models/carousel';
import { CarouselService } from '../../services/carousel.service';

@Component({
   selector: 'app-carousel',
   standalone: true,
   imports: [CommonModule, HttpClientModule],
   templateUrl: './carousel.component.html',
   styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit{
   carouselService = inject(CarouselService);

   carousel: Carousel[] = [];

   ngOnInit(): void {
      this.getCarousel();
   }

   getCarousel() {
      this.carouselService.carousel('ativo').subscribe((response) => {
         this.carousel = response;
      }, (error) => {
         console.error('ERROR: ', error);
      })
   }
}
