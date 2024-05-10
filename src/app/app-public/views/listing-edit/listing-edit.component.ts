import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
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

    @ViewChild('openingHours', { static: true }) openingHours!: ElementRef;

    navbarActive = 1;

    formListing: FormGroup;

    user!: User;

    listingId: number = 0;
    listing!: Listing;

    logoImage!: File;
    coverImage!: File;
    galleryImages: File[] = [];

    previewLogoImg!: string | null | undefined;
    previewCoverImg!: string | null | undefined;
    previewGalleryImg: (string | ArrayBuffer)[] = [];

    temporaryLogoImgPreview!: File;

    categories: ListingCategory[] = [];
    searchItensCategory: ListingCategory[] = [];
    categoriesSelect: ListingCategory[] = [];
    searchCategory: string = "";

    keywords: string[] = [];
    searchKeywords: string = "";

    listingPlans: Partial<ListingPlans> = {};

    daysOfWeek: string[] = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    schedules: { [key: string]: { open: string; close: string } } = {};

    tooltips = {
        keywords: 'Palavras-chaves para as pessoas encontrarem seu negocio mais fácil',
        phone: 'Será utilizado para WhatsApp',
        map: 'A tag HTML <iframe> do Google Maps permite incorporar mapas interativos em páginas da web.'
    }

    constructor() {
        this.formListing = this.formBuilder.group({
            id: [],
            plan_id: [],
            user_id: [],
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

                if (listingResponse.keywords && typeof listingResponse.keywords === 'string') {
                    this.keywords = JSON.parse(listingResponse.keywords);
                }

                this.formListing.patchValue({
                    id: this.listing.id,
                    user_id: this.listing.user_id,
                    title: this.listing.title,
                    summary: this.listing.summary,
                    description: this.listing.description,
                    keywords: this.keywords,
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

    removeCategory(id: number) {
        this.categoriesSelect = this.categoriesSelect.filter(category => category.id !== id);

        this.formListing.patchValue({
            categories: this.categoriesSelect
        });
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

    removeKeyword(keywords: string) {
        this.keywords = this.keywords.filter(item => item !== keywords);

        this.formListing.patchValue({
            keywords: this.keywords
        });
    }

    openOpiningHours() {
        
        if(this.listing.openingHours) {
            const openingHours = JSON.parse(this.listing.openingHours);
            console.log(openingHours)
            
            this.daysOfWeek.forEach(day => {
                this.schedules[day] = {open: openingHours[day].open, close: openingHours[day].close};
            })
        } else {
            this.daysOfWeek.forEach(day => {
                this.schedules[day] = { open: '09:00', close: '18:00' };
            });
        }

        this.modalListing.open(this.openingHours, { centered: true });
    }

    saveSchedule() {
        this.modalListing.dismissAll();

        this.formListing.patchValue({
            openingHours: JSON.stringify(this.schedules)
        });
    }

    cleanScheduleByDay(day: string) {
        this.schedules[day] = { open: '', close: '' };
    }

    removeSchedule() {
        this.formListing.patchValue({
            openingHours: ''
        });
    }

    submitFormInfos() {
        if(this.formListing.valid) {
            this.spinnerService.show('Salvando seu anúncio, aguarde...');
            this.listingService.updateListing(this.formListing.value).subscribe(response => {
                this.spinnerService.hide();
                this.alertService.showAlert('success', 'Anúncio atualizado com sucesso.');

            }, error => {
                this.spinnerService.hide();
                this.validErrorsService.validError(error, 'Falha ao atualizar o anúncio');
            });

        } else {
            this.alertService.showAlert('info', 'Preencha todos os campos obrigatórios.');
            this.formListing.markAllAsTouched();
        }
    }

    previewLogo(event: Event) {
        const fileInput = event.target as HTMLInputElement;
        const file = fileInput.files?.[0];
        
        if(file) {
            if(this.imageService.validImage(file)) {
                this.logoImage = file;
                const reader = new FileReader();

                reader.onload = () => {
                    this.previewLogoImg = reader.result?.toString();
                };
                reader.readAsDataURL(file);
            }
        }
    }

    updateLogoImage() {
        this.spinnerService.show('Atualizando a imagem de logotipo, aguarde...');
        this.listingService.updateLogoImage(this.logoImage, this.listingId).subscribe(response => {
            this.previewLogoImg = '';
            this.spinnerService.hide();
            this.alertService.showAlert('success', 'O logotipo foi atualizado com sucesso');


        }, error => {
            this.spinnerService.hide();
            this.validErrorsService.validError(error, 'Falha ao atualizar a logotipo');
        })
    }

    previewCapa(event: Event) {
        const fileInput = event.target as HTMLInputElement;
        const file = fileInput.files?.[0];

        if(file) {
            if(this.imageService.validImage(file)) {
                this.coverImage = file;
                const reader = new FileReader();

                reader.onload = () => {
                    this.previewCoverImg = reader.result?.toString();
                };
                reader.readAsDataURL(file);
            }
        }
    }

    updateCoverImage() {
        this.spinnerService.show('Atualizando a imagem de capa, aguarde...');
        this.listingService.updateCoverImage(this.coverImage, this.listingId).subscribe(response => {
            this.previewCoverImg = '';
            this.spinnerService.hide();
            this.alertService.showAlert('success', 'A imagem de capa foi atualizada com sucesso');


        }, error => {
            this.spinnerService.hide();
            this.validErrorsService.validError(error, 'Falha ao atualizar a imagem de capa');
        })
    }

    previewGallery(event: Event) {
        const fileInput = event.target as HTMLInputElement;
        const files = fileInput.files;

        const galleryInfo = this.listingPlans.plansInfo;

        const maxImgs = galleryInfo?.find(item => {
            return item.description === "Galeria de imagens";
        });
        
        if(this.galleryImages && maxImgs?.value && this.galleryImages.length >= maxImgs?.value ) {
            this.alertService.showAlert('info', 'Você atingiu o limite máximo de imagens do seu plano.');
            return;
        }
      
        if (files) {
            if(maxImgs?.value && (files.length + this.previewGalleryImg.length) > maxImgs?.value) {
                this.alertService.showAlert('info', 'Você ultrapassou o limite máximo de imagens do seu plano.');
                return;
            }

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (this.imageService.validImage(file)) {
                    const reader = new FileReader();
                    
                    reader.onload = () => {
                        const result = reader.result;
                        if (result) {
                            this.previewGalleryImg.push(result.toString());
                            this.galleryImages.push(file);
                        }
                    };

                    reader.readAsDataURL(file);
                }
            }
        }
    }

    goToTheTopWindow() {
        window.scrollTo(0, 0);
    }

    reloadPage() {
        window.location.reload();
    }
}
