import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ListingCategoryService } from '../../../services/listing-category.service';
import { ListingCategory } from '../../../models/listingCategory';

@Component({
   selector: 'app-listings',
   standalone: true,
   imports: [CommonModule, RouterModule, FooterComponent],
   templateUrl: './listings.component.html',
   styleUrl: './listings.component.css'
})
export class ListingsComponent implements OnInit{
   categoryService   = inject(ListingCategoryService);
   route             = inject(ActivatedRoute);
   router            = inject(Router);

   iconCategories: boolean = false;

   categories: ListingCategory[] = [];

   testeQtd: number = 10;

   searchListing: string | null = '';

   ngOnInit(): void {
      this.goToTheTopWindow();
      this.getParams();
      this.getCategories();
   }

   toggleIconCategories() {
      this.iconCategories = !this.iconCategories;
   }

   getCategories() {
      this.categoryService.categories(null).subscribe((response) => {
         this.categories = response;
      }, (error) => {
         console.error('ERROR: ', error);
      })
   }

   goToTheTopWindow() {
      window.scrollTo(0, 0);
   }

   getParams() {
      this.route.queryParamMap.subscribe((queryParams) => {
         this.searchListing = queryParams.get('search') || null;
      });
   }
}
