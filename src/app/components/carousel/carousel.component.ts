import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { Carousel } from '../../../models/carousel';
import { CarouselService } from '../../services/carousel.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
   selector: 'app-carousel',
   standalone: true,
   imports: [CommonModule, HttpClientModule, FormsModule],
   templateUrl: './carousel.component.html',
   styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit{
   carouselService   = inject(CarouselService);
   route             = inject(ActivatedRoute);
   router            = inject(Router)


   carousel: Carousel[] = [];
   search: string = '';

   ngOnInit(): void {
      // this.getCarousel();
   }

   getCarousel() {
      this.carouselService.carousel('ativo').subscribe((response) => {
         this.carousel = response;
         console.log(response)
      }, (error) => {
         console.error('ERROR: ', error);
      })
   }

   getListings() {
      this.router.navigate(['/anuncios'], {queryParams: {search: this.search}});
   }
}
