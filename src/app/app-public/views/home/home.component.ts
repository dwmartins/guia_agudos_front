import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListingCategoryComponent } from '../../../components/listing-category/listing-category.component';
import { CarouselComponent } from '../../../components/carousel/carousel.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { BannerPromoverComponent } from '../../../components/banner-promover/banner-promover.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ListingCategoryComponent, CarouselComponent, RouterModule, FooterComponent, BannerPromoverComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  
  ngOnInit(): void {
    this.goToTheTopWindow();
  }

  goToTheTopWindow() {
    window.scrollTo(0, 0);
 }
}
