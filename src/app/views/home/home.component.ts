import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ListingCategoryComponent } from '../../components/listing-category/listing-category.component';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { RouterModule } from '@angular/router';
import { Footer2Component } from '../../components/footer-2/footer-2.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ListingCategoryComponent, CarouselComponent, RouterModule, FooterComponent],
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
