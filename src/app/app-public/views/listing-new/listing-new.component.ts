import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListingCategoryService } from '../../../services/listing-category.service';
import { ListingCategory } from '../../../models/listingCategory';
import { FooterComponent } from '../../components/footer/footer.component';
import { AlertService } from '../../../services/components/alert.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ListingPlans } from '../../../models/ListingPlans';
import { ListingPlansService } from '../../../services/listingPlans.service';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageValidationService } from '../../../services/helpers/image-validation.service';
import { PromotionalCodeService } from '../../../services/promotional-code.service';
import { SpinnerService } from '../../../services/components/spinner.service';
import { ListingService } from '../../../services/listing.service';
import { Listing } from '../../../models/listing';
import { User } from '../../../models/user';
import { AuthService } from '../../../services/auth.service';
import { ValidErrorsService } from '../../../services/helpers/valid-errors.service';
import { ConstantsService } from '../../../services/helpers/constants.service';
import { PlansInfoService } from '../../../services/helpers/plans-info.service';

@Component({
    selector: 'app-listing-new',
    standalone: true,
    imports: [CommonModule, FooterComponent, FormsModule, NgbTooltipModule, ReactiveFormsModule, RouterModule],
    templateUrl: './listing-new.component.html',
    styleUrl: './listing-new.component.css'
})
export class ListingNewComponent implements OnInit{
    constants               = inject(ConstantsService);
    plansInfo               = inject(PlansInfoService);
    categoryService         = inject(ListingCategoryService);
    alertService            = inject(AlertService);
    route                   = inject(ActivatedRoute);
    listingPlansService     = inject(ListingPlansService);
    imageService            = inject(ImageValidationService);
    promotionalCodeService  = inject(PromotionalCodeService);
    spinnerService          = inject(SpinnerService);
    formBuilder             = inject(FormBuilder);
    listingService          = inject(ListingService);
    modalListing            = inject(NgbModal);
    authService             = inject(AuthService);
    validErrorsService      = inject(ValidErrorsService);
    router                  = inject(Router);

    @ViewChild('newListing', { static: true }) newListing!: ElementRef;
    @ViewChild('openingHours', { static: true }) openingHours!: ElementRef;

    formListing: FormGroup;

    categories: ListingCategory[] = [];
    searchItensCategory: ListingCategory[] = [];
    searchItem: string = '';
    categoriesSelect: ListingCategory[] = [];
    planId!: number;
    listingPlans: ListingPlans[] = [];

    keywords: string[] = [];
    searchKeywords!: string;

    logoImage!: File;
    coverImage!: File;
    galleryImages: File[] = [];

    previewLogoImg!: string | null | undefined;
    previewCoverImg!: string | null | undefined;
    previewGalleryImg: (string | ArrayBuffer)[] = [];

    promotionalCode: string = '';
    codeValid: boolean = false;

    showView: boolean = false;

    listing!: Listing;
    listingId!: number;
    listingLevel: string = '';

    user!: User

    daysOfWeek: string[] = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    schedules: { [key: string]: { open: string; close: string } } = {};

    tooltips = {
        keywords: 'Palavras-chaves para as pessoas encontrarem seu negocio mais fácil',
        phone: 'Será utilizado para WhatsApp',
        map: 'A tag HTML <iframe> do Google Maps permite incorporar mapas interativos em páginas da web.'
    }

    constructor() {
        this.daysOfWeek.forEach(day => {
            this.schedules[day] = { open: '', close: '' };
        });

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
        this.goToTheTopWindow();
        this.getParameterData();
        this.getListingPlans();
        this.getCategories();
        this.user = this.authService.getUserLogged() || {} as User;
    }

    getListingPlans() {
        this.spinnerService.show();
        this.listingPlansService.getPlansById(this.planId,"Y").subscribe(response => {
            if(!response.length) {
                this.spinnerService.hide()
                return this.router.navigate(['/']);
            }

            this.spinnerService.hide(); 
            this.showView = true;
            this.listingPlans = response;

            this.formListing.patchValue({
                plan_id: this.listingPlans[0].id
            });

            return 
        }, error => {
            this.showView = true;
            this.spinnerService.hide(); 
            this.router.navigate(['/']);
            this.validErrorsService.validError(error, 'Falha ao buscar os planos.');
        })
    }

    getCategories() {
        this.categoryService.categories(null).subscribe((response) => {
           this.categories = response;
           this.searchItensCategory = response;
        }, (error) => {
           this.validErrorsService.validError(error, 'Falha ao buscar as categorias.');
        })
    }

    filterCategories(): void {
        this.searchItensCategory = this.categories.filter(object =>
           object.cat_name.toLowerCase().includes(this.searchItem.toLowerCase())
        );
    }

    setCategory(category: ListingCategory) {
        const categoryInfo = this.listingPlans[0].plansInfo;

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

    removeCategory(id: number) {
        this.categoriesSelect = this.categoriesSelect.filter(category => category.id !== id);

        this.formListing.patchValue({
            categories: this.categoriesSelect
        });
    }

    setKeywords(keywords: string){
        const keywordsInfo = this.listingPlans[0].plansInfo;
        
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

    removeKeyword(keywords: string) {
        this.keywords = this.keywords.filter(item => item !== keywords);

        this.formListing.patchValue({
            keywords: this.keywords
        });
    }

    getParameterData() {
        this.route.params.subscribe(params => {
            this.planId = params['id'];
        })
    }

    getFieldPlans(field: string) {
        const planField = this.listingPlans[0].plansInfo;

        const active = planField.find(item => {
            return item.description === field;
        });

        if(active?.active === 'Y') {
            return true;
        }

        return false;
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

    previewGallery(event: Event) {
        const fileInput = event.target as HTMLInputElement;
        const files = fileInput.files;

        const galleryInfo = this.listingPlans[0].plansInfo;

        const maxImgs = galleryInfo.find(item => {
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

    validPromotionalCode() {
        if(!this.promotionalCode) {
            this.alertService.showAlert('info', 'Digite o seu cupom de desconto.');
            return;
        }

        this.promotionalCodeService.validCode(this.promotionalCode).subscribe(response => {
            this.codeValid = true;
            this.alertService.showAlert('success', response.success);

            this.formListing.patchValue({
                promotionalCode: this.promotionalCode
            });
        }, error => {
            this.promotionalCode = '';
            this.validErrorsService.validError(error, 'Falha ao validar o cupom de desconto.');
        })
    }

    openOpiningHours() {
        this.daysOfWeek.forEach(day => {
            this.schedules[day] = { open: '09:00', close: '18:00' };
        });

        this.modalListing.open(this.openingHours, { centered: true });
    }

    cleanScheduleByDay(day: string) {
        this.schedules[day] = { open: '', close: '' };
    }

    saveSchedule() {
        this.modalListing.dismissAll();

        this.formListing.patchValue({
            openingHours: JSON.stringify(this.schedules)
        });
    }

    removeSchedule() {
        this.formListing.patchValue({
            openingHours: ''
        });
    }

    submitForm() {
        if(this.formListing.valid) {
            this.spinnerService.show('Criando anúncio, aguarde...');

            this.listingService.newListing(this.formListing.value, this.logoImage, this.coverImage, this.galleryImages).subscribe(response => {
                this.spinnerService.hide();
                this.listing = response;
                this.formListing.reset();
                this.keywords = [];
                this.categoriesSelect = [];

                this.modalListing.open(this.newListing, { centered: true });
            }, error => {
                this.spinnerService.hide();
                this.validErrorsService.validError(error, 'Falha ao criar o anúncio');
            });
        } else {
            this.alertService.showAlert('info', 'Preencha todos os campos obrigatórios');
            this.formListing.markAllAsTouched();
        }
    }

    finalizeOrder(listing: Listing) {
        const msg = `
            Olá, gostaria de finalizar meu pedido.\n
            *ID do anúncio:* ${listing.id}\n
            *Titulo:* ${listing.title}\n
            *Plano:* ${listing.plan}
        `;
        window.open(`https://wa.me/${this.constants.adminPhone}/?text=${window.encodeURIComponent(msg)}`)
    }

    goToTheTopWindow() {
        window.scrollTo(0, 0);
    }
}
