import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ListingCategoryService } from '../../../services/listing-category.service';
import { ListingCategory } from '../../../models/listingCategory';
import { FooterComponent } from '../../components/footer/footer.component';
import { ListingService } from '../../../services/listing.service';
import { Listing } from '../../../models/listing';
import { ValidErrorsService } from '../../../services/helpers/valid-errors.service';
import { SpinnerService } from '../../../services/components/spinner.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
   selector: 'app-listings',
   standalone: true,
   imports: [CommonModule, RouterModule, FooterComponent, NgbTooltipModule],
   templateUrl: './listings.component.html',
   styleUrl: './listings.component.css'
})
export class ListingsComponent implements OnInit{
   categoryService      = inject(ListingCategoryService);
   listingService       = inject(ListingService);
   route                = inject(ActivatedRoute);
   router               = inject(Router);
   validErrorsService   = inject(ValidErrorsService);
   spinnerService        = inject(SpinnerService);

   iconCategories: boolean = false;

   categories: ListingCategory[] = [];

   searching: boolean = false;

   searchListing: string | null = '';

   listings: Listing[] = [];

   ngOnInit(): void {
      this.goToTheTopWindow();
      this.getParams();
      this.getListingsAll();
      this.getCategories();
   }

   toggleIconCategories() {
      this.iconCategories = !this.iconCategories;
   }

   getListingsAll() {
      this.searching = true;
      this.listingService.getAll('ativo', 0, '').subscribe((response) => {
         this.listings = response;
         this.searching = false;
      }, (error) => {
         this.searching = false;
         this.validErrorsService.validError(error, 'Falha ao buscar os anúncios');
      });
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
