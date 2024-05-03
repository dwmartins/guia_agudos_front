import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ConstantsService } from '../../../services/helpers/constants.service';
import { PlansInfoService } from '../../../services/helpers/plans-info.service';
import { ListingCategoryService } from '../../../services/listing-category.service';
import { AlertService } from '../../../services/components/alert.service';
import { ListingPlansService } from '../../../services/listingPlans.service';
import { ImageValidationService } from '../../../services/helpers/image-validation.service';
import { SpinnerService } from '../../../services/components/spinner.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListingService } from '../../../services/listing.service';
import { NgbModal, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth.service';
import { ValidErrorsService } from '../../../services/helpers/valid-errors.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Listing } from '../../../models/listing';
import { ListingCategory } from '../../../models/listingCategory';
import { forkJoin } from 'rxjs';
import { ListingPlans } from '../../../models/ListingPlans';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SpinnerLoadingComponent } from '../../../shared/components/spinner-loading/spinner-loading.component';
import { User } from '../../../models/user';

@Component({
    selector: 'app-listing-edit',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NgbTooltipModule, SpinnerLoadingComponent, NgbNavModule],
    templateUrl: './listing-edit.component.html',
    styleUrl: './listing-edit.component.css'
})
export class ListingEditComponent implements OnInit, OnDestroy{
    titleService		= inject(Title);
    constants           = inject(ConstantsService);
    plansInfo           = inject(PlansInfoService);
    categoryService     = inject(ListingCategoryService);
    alertService        = inject(AlertService);
    listingPlansService = inject(ListingPlansService);
    imageService        = inject(ImageValidationService);
    spinnerService      = inject(SpinnerService);
    formBuilder         = inject(FormBuilder);
    listingService      = inject(ListingService);
    modalListing        = inject(NgbModal);
    authService         = inject(AuthService);
    validErrorsService  = inject(ValidErrorsService);
    route               = inject(ActivatedRoute);
    router 			    = inject(Router);

    navbarActive = 1;

    formListing: FormGroup;

    user!: User;

    listingId: number = 0;
    listing!: Listing;

    categories: ListingCategory[] = [];
    searchItensCategory: ListingCategory[] = [];
    categoriesSelect: ListingCategory[] = [];
    searchCategory: string = "";

    keywords: string[] = [];
    searchKeywords: string = "";

    listingPlans: Partial<ListingPlans> = {};

    spinnerEdit: boolean = false;

    tooltips = {
        keywords: 'Palavras-chaves para as pessoas encontrarem seu negocio mais fácil',
        phone: 'Será utilizado para WhatsApp',
        map: 'A tag HTML <iframe> do Google Maps permite incorporar mapas interativos em páginas da web.'
    }

    constructor() {
        this.formListing = this.formBuilder.group({
            plan_id: [],
            title: ['', [Validators.required]],
            summary: ['', [Validators.required]],
            description: [''],
            categories: [''],
            keywords: [''],
            address: [''],
            city: [''],
            state: [''],
            zipCode: [''],
            map: [''],
            facebook: [''],
            instagram: [''],
            linkedIn: [''],
            openingHours: [''],
            promotionalCode: [''],
            phone: [''],
            email: [''],
            url: [''],
        });
    }

    ngOnInit(): void {
        this.titleService.setTitle("Editar anúncio");
        this.user = this.authService.getUserLogged() as User;
        this.goToTheTopWindow();
        this.getParameterData();
        this.getData()
    }

    ngOnDestroy(): void {
        this.titleService.setTitle(this.constants.siteTitle);
    }

    getParameterData() {
        this.route.params.subscribe(params => {
            this.listingId = params['id'];
        })
    }

    getData() {
        this.spinnerService.show("Buscando dados do seu anúncio, aguarde...");

        const listingObservable = this.listingService.getById(this.listingId);
        const categoriesObservable = this.categoryService.categories(null);
        
        forkJoin([listingObservable, categoriesObservable]).subscribe(
            ([listingResponse, categoryResponse]) => {
                this.spinnerService.hide();

                if(listingResponse.user_id != this.user.id) {
                    this.router.navigate(['/']);
                }

                this.listing = listingResponse;
                this.categories = categoryResponse;
                this.searchItensCategory = categoryResponse;

                this.formListing.patchValue({
                    title: this.listing.title,
                    summary: this.listing.summary,
                    description: this.listing.description,
                    keywords: this.listing.keywords,
                    address: this.listing.address,
                    city: this.listing.city,
                    state: this.listing.state,
                    zipCode: this.listing.zipCode,
                    map: this.listing.map,
                    facebook: this.listing.facebook,
                    instagram: this.listing.instagram,
                    linkedIn: this.listing.linkedIn,
                    openingHours: this.listing.openingHours,
                    promotionalCode: this.listing.promotionalCode,
                    phone: this.listing.phone,
                    email: this.listing.email,
                    url: this.listing.url,
                });

                if (listingResponse.keywords && typeof listingResponse.keywords === 'string') {
                    this.keywords = JSON.parse(listingResponse.keywords);
                }

                this.getListingPlans(this.listing.planId);
            }, (error) => {
                this.validErrorsService.validError(error, "Falha ao buscar os dados do anúncio.");
                this.spinnerService.hide();
                this.router.navigate(['/']);
            }
        )
    }

    getListingPlans(planId: number) {
        this.listingPlansService.getPlansById(planId, "Y").subscribe((response) => {
            [this.listingPlans] = response;

            this.formListing.patchValue({
                plan_id: this.listingPlans.id
            });

        }, (error) => {
            this.validErrorsService.validError(error, "Falha ao buscar os dados do anúncio.");
            this.router.navigate(['/']);
        })
    }

    getFieldPlans(field: string) {
        const planField = this.listingPlans.plansInfo;

        if(planField) {
            const active = planField.find(item => {
                return item.description === field;
            });

            if(active?.active === "Y") {
                return true;
            }
        }

        return false;
    }

    filterCategories(): void {
        this.searchItensCategory = this.categories.filter(object =>
           object.cat_name.toLowerCase().includes(this.searchCategory.toLowerCase())
        );
    }

    setCategory(category: ListingCategory) {
        const categoryInfo = this.listingPlans.plansInfo;

        if(categoryInfo) {
            const maxCategory = categoryInfo.find(item => {
                return item.description === this.plansInfo.categories;
            });
    
            if(this.categoriesSelect.length === maxCategory?.value) {
                this.alertService.showAlert('info', 'Você atingiu o limite máximo de categorias do seu plano.');
                return;
            }
    
            const exists = this.categoriesSelect.some(existsCategory => existsCategory.id === category.id);
            if(exists) {
                this.alertService.showAlert('info', 'Você já selecionou essa categoria.');
                return;
            }
            
            this.categoriesSelect.push(category);
    
            this.formListing.patchValue({
                categories: this.categoriesSelect
            });
        }
    }

    setKeywords(keywords: string){
        const keywordsInfo = this.listingPlans.plansInfo;

        if(keywordsInfo) {
            const maxKeywords = keywordsInfo.find(item => {
                return item.description === this.plansInfo.keyWords;
            });
    
            if(!keywords) {
                this.alertService.showAlert('info', 'Escreva a palavra-chave');
                return;
            }
    
            if(this.keywords.length === maxKeywords?.value) {
                this.alertService.showAlert('info', 'Você atingiu o limite máximo de palavras-chave do seu plano.');
                return;
            }
    
            const exists = this.keywords.some(existisKeywords => existisKeywords === keywords);
    
            if(exists) {
                this.alertService.showAlert('info', 'Você já adicionou uma palavra-chave igual.');
                return;
            }
    
            this.keywords.push(keywords);
            this.searchKeywords = '';
    
            this.formListing.patchValue({
                keywords: this.keywords
            });
        }
    }

    removeCategory(id: number) {
        this.categoriesSelect = this.categoriesSelect.filter(category => category.id !== id);

        this.formListing.patchValue({
            categories: this.categoriesSelect
        });
    }

    removeKeyword(keywords: string) {
        this.keywords = this.keywords.filter(item => item !== keywords);

        this.formListing.patchValue({
            keywords: this.keywords
        });
    }

    goToTheTopWindow() {
        window.scrollTo(0, 0);
    }
}
