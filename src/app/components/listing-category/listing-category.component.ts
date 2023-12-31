import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListingCategoryService } from '../../services/listing-category.service';
import { ListingCategory } from '../../../models/listingCategory';
import { FormsModule } from '@angular/forms';

@Component({
   selector: 'app-listing-category',
   standalone: true,
   imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
   templateUrl: './listing-category.component.html',
   styleUrl: './listing-category.component.css'
})
export class ListingCategoryComponent implements OnInit {
   @Input() type: string = '';

   SearchingCategories: boolean = false;
   notResults: boolean = false;

   categories: ListingCategory[] = [];
   searchItensCategory: ListingCategory[] = [];
   searchItem: string = '';

   categoryService = inject(ListingCategoryService);

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

   filterCategories(): void {
      this.searchItensCategory = this.categories.filter(object =>
         object.cat_name.toLowerCase().includes(this.searchItem.toLowerCase())
      );
   }

}
