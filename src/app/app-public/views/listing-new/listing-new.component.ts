import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListingCategoryService } from '../../../services/listing-category.service';
import { ListingCategory } from '../../../models/listingCategory';
import { FooterComponent } from '../../components/footer/footer.component';
import { AlertService } from '../../../services/components/alert.service';
import { ActivatedRoute } from '@angular/router';
import { ListingPlans } from '../../../models/ListingPlans';
import { PlansService } from '../../../services/plans.service';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageValidationService } from '../../../services/helpers/image-validation.service';
import { PromotionalCodeService } from '../../../services/promotional-code.service';
import { SpinnerService } from '../../../services/components/spinner.service';
import { ListingService } from '../../../services/listing.service';
import { Listing } from '../../../models/listing';
import { User } from '../../../models/user';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-listing-new',
    standalone: true,
    imports: [CommonModule, FooterComponent, FormsModule, NgbTooltipModule, ReactiveFormsModule],
    templateUrl: './listing-new.component.html',
    styleUrl: './listing-new.component.css'
})
export class ListingNewComponent implements OnInit{
    categoryService         = inject(ListingCategoryService);
    alertService            = inject(AlertService);
    route                   = inject(ActivatedRoute);
    plansService            = inject(PlansService);
    imageService            = inject(ImageValidationService);
    promotionalCodeService  = inject(PromotionalCodeService);
    spinnerService          = inject(SpinnerService);
    formBuilder             = inject(FormBuilder);
    listingService          = inject(ListingService);
    modalListing            = inject(NgbModal);
    authService             = inject(AuthService);

    @ViewChild('newListing', { static: true }) newListing!: ElementRef;

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
    galleryImages!: File[];

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

    tooltips = {
        keywords: 'Palavras-chaves para as pessoas encontrarem seu negocio mais fácil',
        phone: 'Será utilizado para WhatsApp'
    }

    constructor() {
        this.formListing = this.formBuilder.group({
            user_id: [],
            plan_id: [],
            title: ['', [Validators.required]],
            summary: ['', [Validators.required]],
            description: [''],
            categories: [],
            keywords: [],
            address: [''],
            city: [''],
            state: [''],
            zipCode: [],
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
        this.plansService.getPlansById(this.planId,"Y").subscribe(response => {
            this.spinnerService.hide(); 
            this.showView = true;
            this.listingPlans = response;

            this.formListing.patchValue({
                plan_id: this.listingPlans[0].id
            });
        }, error => {
            this.showView = true;
            this.spinnerService.hide(); 
            console.error('ERROR: ', error);
            this.alertService.showAlert('error', 'Falha ao buscar os planos.');
        })
    }

    getCategories() {
        this.categoryService.categories(null).subscribe((response) => {
           this.categories = response;
           this.searchItensCategory = response;
        }, (error) => {
           console.error('ERROR: ', error);
           this.alertService.showAlert('error', 'Falha ao buscar as categorias.');
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
            return item.description === "Categorias";
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
            return item.description === "Palavras-chave";
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
            this.planId = params['planId'];
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
            this.logoImage = file;
            if(this.imageService.validImage(file)) {
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
            this.coverImage = file;
            if(this.imageService.validImage(file)) {
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
      
        if (files) {
            this.galleryImages = Array.from(files);
            for (let i = 0; i < files.length; i++) {
            const file = files[i];
      
            if (this.imageService.validImage(file)) {
              const reader = new FileReader();
      
              reader.onload = () => {
                const result = reader.result;
                if (result) {
                  this.previewGalleryImg.push(result.toString());
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
            if(response.alert) {
                this.alertService.showAlert('info', response.alert);
                this.promotionalCode = '';
                return;
            }

            this.codeValid = true;
            this.alertService.showAlert('success', response.success);

            this.formListing.patchValue({
                promotionalCode: this.promotionalCode
            });
        }, error => {
            this.promotionalCode = '';
            console.error('ERROR: ', error);
            this.alertService.showAlert('error', 'Falha ao validar o cupom de desconto.');
        })
    }

    submitForm() {
        console.log(this.formListing.value)
        if(this.formListing.valid) {
            this.spinnerService.show('Criando anúncio, aguarde...');

            this.listingService.newListing(this.formListing.value, this.logoImage, this.coverImage, this.galleryImages).subscribe(response => {
                this.spinnerService.hide();

                if('alert' in response) {
                    this.alertService.showAlert('info', response.alert);
                    return;
                }

                this.listing = response;

                this.modalListing.open(this.newListing, { centered: true });
            }, error => {
                this.spinnerService.hide();
                console.error('ERROR: ', error);
                this.alertService.showAlert('error', 'Falha ao criar o anúncio');
            });
        } else {
            this.alertService.showAlert('info', 'Preencha todos os campos obrigatórios');
            this.formListing.markAllAsTouched();
        }
    }

    goToTheTopWindow() {
        window.scrollTo(0, 0);
    }
}
