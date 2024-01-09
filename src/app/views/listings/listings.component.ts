import { Component, OnInit, inject } from '@angular/core';
import { ListingCategoryService } from '../../services/listing-category.service';
import { ListingCategory } from '../../../models/listingCategory';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
   selector: 'app-listings',
   standalone: true,
   imports: [CommonModule, RouterModule],
   templateUrl: './listings.component.html',
   styleUrl: './listings.component.css'
})
export class ListingsComponent implements OnInit{
   categoryService = inject(ListingCategoryService);

   iconCategories: boolean = false;

   categories: ListingCategory[] = [];

   testeQtd: number = 10;

   ngOnInit(): void {
      this.getCategories();
   }

   toggleIconCategories() {
      this.iconCategories = !this.iconCategories;
   }

   getCategories() {
      this.categoryService.categories(null).subscribe((response) => {
         this.categories = response;
         console.log(this.categories);
      }, (error) => {
         console.error('ERROR: ', error);
      })
   }
}
