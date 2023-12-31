import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListingCategoryService } from '../../services/listing-category.service';
import { ListingCategory } from '../../../models/listingCategory';

@Component({
   selector: 'app-listing-category',
   standalone: true,
   imports: [CommonModule, RouterModule, HttpClientModule],
   templateUrl: './listing-category.component.html',
   styleUrl: './listing-category.component.css'
})
export class ListingCategoryComponent implements OnInit {
   @Input() type: string = '';

   categories: ListingCategory[] = [];

   categoryService = inject(ListingCategoryService);

   ngOnInit(): void {
      this.getCategories();
      console.log(this.type)
   }

   getCategories() {
      const limit = 7;
      this.categoryService.categories(limit).subscribe((response) => {
         this.categories = response;
         console.log(this.categories);
      }, (error) => {
         console.error('ERROR: ', error);
      })
   }

}
