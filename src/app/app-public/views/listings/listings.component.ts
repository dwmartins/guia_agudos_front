import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
import { FormsModule, NgModel } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { GlobalVariablesService } from '../../../services/helpers/global-variables.service';

@Component({
   selector: 'app-listings',
   standalone: true,
   imports: [CommonModule, RouterModule, FooterComponent, NgbTooltipModule, FormsModule],
   templateUrl: './listings.component.html',
   styleUrl: './listings.component.css'
})
export class ListingsComponent implements OnInit, OnDestroy{
   titleService		      = inject(Title);	
   globalVariablesService  = inject(GlobalVariablesService);
   categoryService         = inject(ListingCategoryService);
   listingService          = inject(ListingService);
   route                   = inject(ActivatedRoute);
   router                  = inject(Router);
   validErrorsService      = inject(ValidErrorsService);
   spinnerService          = inject(SpinnerService);

   iconCategories: boolean = false;

   categories: ListingCategory[] = [];

   searching: boolean = false;

   searchListing: string = '';
   searchListingByCategory!: number;

   queryParams = {
      keywords: '',
      categoryId: 0
   }

   categoryParamsSearch: ListingCategory[] = [];

   listings: Listing[] = [];
   searchItem: string = '';
   searchItensListing: Listing[] = [];

   filters = {
      keywords: '',
      category: 0
   }

   ngOnInit(): void {
      this.titleService.setTitle(`${this.globalVariablesService.title} - Anunciantes`);
      this.goToTheTopWindow();
      this.getParams();
      this.getListingsAll();
      this.getCategories();
   }

   ngOnDestroy(): void {
      this.titleService.setTitle(this.globalVariablesService.title);
   }

   toggleIconCategories() {
      this.iconCategories = !this.iconCategories;
   }

   getListingsAll() {
      this.searching = true;
      this.listingService.getAll(this.queryParams.categoryId, this.queryParams.keywords).subscribe((response) => {
         this.listings = response;
         this.searchItensListing = response;
         this.searching = false;
      }, (error) => {
         this.searching = false;
         this.validErrorsService.validError(error, 'Falha ao buscar os anúncios');
      });
   }

   searchListingByFilter() {
      this.queryParams.keywords = '';
      this.searching = true;
      this.listingService.getAll(this.filters.category, this.filters.keywords).subscribe((response) => {
         this.searchItensListing = response;
         this.searching = false;

      }, (error) => {
         this.searching = false;
         this.validErrorsService.validError(error, 'Falha ao buscar os anúncios');
      });
   }

   searchListingFilter() {
      this.searchItensListing = this.listings.filter(object =>
         object.title.toLowerCase().includes(this.searchItem.toLowerCase()) ||
         object.summary.toLowerCase().includes(this.searchItem.toLowerCase())
      );
   }

   cleanFilters() {
      this.filters.category = 0;
      this.filters.keywords = '';
      this.queryParams.keywords = '';
      this.queryParams.categoryId = 0;
      this.categoryParamsSearch = [];
      this.getListingsAll();
   }

   getCategories() {
      this.searching = true;
      this.categoryService.categories(null).subscribe((response) => {
         this.searching = false;
         this.categories = response;
         this.categoryParamsSearch = this.categories.filter(object => object.id === this.queryParams.categoryId);
      }, (error) => {
         this.searching = false;
         console.error('ERROR: ', error);
      })
   }

   viewListing(listing: Listing) {
      if(listing.plan != "GRÁTIS") {
         this.router.navigate(['/anunciante', listing.id]);
      }
   }

   goToTheTopWindow() {
      window.scrollTo(0, 0);
   }

   getParams() {
      this.route.queryParamMap.subscribe((queryParams) => {
         this.queryParams.keywords = queryParams.get('search')!;
         this.queryParams.categoryId = parseInt(queryParams.get('category')!);
      });
   }
}
