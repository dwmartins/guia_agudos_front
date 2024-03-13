import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ListingCategory } from '../../../models/listingCategory';
import { ListingCategoryService } from '../../../services/listing-category.service';

@Component({
   selector: 'app-listing-category',
   standalone: true,
   imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
   templateUrl: './listing-category.component.html',
   styleUrl: './listing-category.component.css'
})
export class ListingCategoryComponent implements OnInit {
   categoryService = inject(ListingCategoryService);
   router          = inject(Router);
   
   @Input() type: string = '';

   SearchingCategories: boolean = false;
   notResults: boolean = false;

   categories: ListingCategory[] = [];
   searchItensCategory: ListingCategory[] = [];
   searchItem: string = '';


   ngOnInit(): void {
      this.getCategories();
   }

   getCategories() {
      const limit = this.type ? null : 7;
      this.SearchingCategories = true;
      this.categoryService.categories(limit).subscribe((response) => {
         this.SearchingCategories = false;
         this.categories = response;
         this.searchItensCategory = response;

         if (!this.categories.length) {
            this.notResults = true;
         }

      }, (error) => {
         this.SearchingCategories = false;
         this.notResults = true;
         console.error('ERROR: ', error);
      })
   }

   searchListingByCategory(categoryId: number) {
      this.router.navigate(['/anunciantes'], {queryParams: {category: categoryId}});
   }

   filterCategories(): void {
      this.searchItensCategory = this.categories.filter(object =>
         object.cat_name.toLowerCase().includes(this.searchItem.toLowerCase())
      );
   }

}
