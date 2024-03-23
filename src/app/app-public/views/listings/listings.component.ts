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
import { NgbRatingConfig, NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ConstantsService } from '../../../services/helpers/constants.service';
import { SpinnerLoadingComponent } from '../../../shared/components/spinner-loading/spinner-loading.component';

@Component({
   selector: 'app-listings',
   standalone: true,
   imports: [CommonModule, RouterModule, FooterComponent, NgbTooltipModule, FormsModule, SpinnerLoadingComponent, NgbRatingModule],
   templateUrl: './listings.component.html',
   styleUrl: './listings.component.css'
})
export class ListingsComponent implements OnInit, OnDestroy{
   titleService		      = inject(Title);	
   constantsService        = inject(ConstantsService);
   categoryService         = inject(ListingCategoryService);
   listingService          = inject(ListingService);
   route                   = inject(ActivatedRoute);
   router                  = inject(Router);
   validErrorsService      = inject(ValidErrorsService);
   spinnerService          = inject(SpinnerService);
   ngbRatingConfig			= inject(NgbRatingConfig);

   spinnerSearching: boolean = false;
   categories: ListingCategory[] = [];
   listings: Listing[] = [];

   searchItensListing: Listing[] = [];
   searchItensCategory: ListingCategory[] = [];

   categoryParamsSearch: ListingCategory[] = [];

   
   searchListing: string = '';
   searchCategory: string = '';
  

   filters = {
      keywords: '',
      categoryId: 0
   }

   queryParams = {
      keywords: '',
      categoryId: 0
   }

   logoDefault: string = "../../../../assets/img/logoDefault.png";

   rating = 4

   constructor() {
      this.ngbRatingConfig.max = 5;
		this.ngbRatingConfig.readonly = true;
   }

   ngOnInit(): void {
      this.titleService.setTitle(`${this.constantsService.siteTitle} - Anúncios`);
      this.goToTheTopWindow();
      this.getParams();
      this.getListingsAll();
      this.getCategories();
   }

   ngOnDestroy(): void {
      this.titleService.setTitle(this.constantsService.siteTitle);
   }

   setFilterCategory(category: ListingCategory) {
      this.filters.categoryId = category.id;
   }

   getCategoryById(id: number) {
      const item = this.categories.find(item => item.id === id);
      return item;
   }

   getListingsAll() {
      this.spinnerSearching = true;
      this.listingService.getAll(this.queryParams.categoryId, this.queryParams.keywords, "ativo").subscribe((response) => {
         this.listings = response;
         this.searchItensListing = response;
         this.spinnerSearching = false;
      }, (error) => {
         this.spinnerSearching = false;
         this.validErrorsService.validError(error, 'Falha ao buscar os anúncios');
      });
   }

   getCategories() {
      this.spinnerSearching = true;
      this.categoryService.categories(null).subscribe((response) => {
         this.spinnerSearching = false;
         this.categories = response;
         this.searchItensCategory = response;
         this.categoryParamsSearch = this.categories.filter(object => object.id === this.queryParams.categoryId);
      }, (error) => {
         this.spinnerSearching = false;
         console.error('ERROR: ', error);
      })
   }

   getListingByFilter() {
      this.queryParams.keywords = '';
      this.spinnerSearching = true;
      this.listingService.getAll(this.filters.categoryId, this.filters.keywords, "ativo").subscribe((response) => {
         this.searchItensListing = response;
         this.spinnerSearching = false;

      }, (error) => {
         this.spinnerSearching = false;
         this.validErrorsService.validError(error, 'Falha ao buscar os anúncios');
      });
   }

   getAllRating(listing: Listing) {
		if(!listing.reviews.length) {
			return 0;
		}

		const sum = listing.reviews.reduce((acc, review) => acc + review.review, 0);
		const result =  sum / listing.reviews.length;
		return result
	}

   searchListingFilter() {
      this.searchItensListing = this.listings.filter(object =>
         object.title.toLowerCase().includes(this.searchListing.toLowerCase()) ||
         object.summary.toLowerCase().includes(this.searchListing.toLowerCase())
      );
   }

   searchCategoryFilter() {
      this.searchItensCategory = this.categories.filter(Object => 
         Object.cat_name.toLocaleLowerCase().includes(this.searchCategory.toLowerCase())
      );
   }

   cleanFilters() {
      this.filters.categoryId = 0;
      this.filters.keywords = '';
      this.queryParams.keywords = '';
      this.queryParams.categoryId = 0;
      this.categoryParamsSearch = [];
      this.getListingsAll();
   }

   viewListing(listing: Listing) {
      if(listing.plan != "GRÁTIS") {
         this.router.navigate(['/anuncio', listing.id]);
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
