import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { Lightbox, LightboxModule } from 'ngx-lightbox';
import { ReviewService } from '../../../services/Review.service';
import { User } from '../../../models/user';
import { Assessment } from '../../../models/Assessment';
import { AlertsComponent } from '../../../shared/components/alerts/alerts.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ListingService } from '../../../services/listing.service';
import { ValidErrorsService } from '../../../services/helpers/valid-errors.service';
import { Listing, ListingGalleryImg } from '../../../models/listing';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { AlertService } from '../../../services/components/alert.service';
import { RedirectService } from '../../../services/redirect.service';
import { Redirect } from '../../../models/Redirect';
import { GlobalVariablesService } from '../../../services/helpers/global-variables.service';
import { SpinnerService } from '../../../services/components/spinner.service';
import { OpeningHours } from '../../../models/OpeningHours';
import { AuthService } from '../../../services/auth.service';

@Component({
  	selector: 'app-listing-info',
  	standalone: true,
  	imports: [RouterModule, CommonModule, LightboxModule, ReactiveFormsModule, HttpClientModule, AlertsComponent, FooterComponent, NgbRatingModule],
  	templateUrl: './listing-info.component.html',
  	styleUrl: './listing-info.component.css'
})
export class ListingInfoComponent implements OnInit, OnDestroy{
	authService             = inject(AuthService);
	titleService			= inject(Title);	
	globalVariablesService  = inject(GlobalVariablesService);
	route 					= inject(ActivatedRoute);
	router 					= inject(Router);
	lightbox 				= inject(Lightbox);
	modal 					= inject(NgbModal);
	formBuilder 			= inject(FormBuilder);
	reviewService 			= inject(ReviewService);
	listingService 			= inject(ListingService);
	validErrorsService  	= inject(ValidErrorsService);
	alertService 			= inject(AlertService);
	redirectService			= inject(RedirectService);
	spinnerService          = inject(SpinnerService);
	domSanitizer			= inject(DomSanitizer);
	ngbRatingConfig			= inject(NgbRatingConfig);
	
	@ViewChild('modalReview', {static: true}) modalReview!: ElementRef;
	@ViewChild('modalDeleteReview', {static: true}) modalDeleteReview!: ElementRef;

	imgDefaultUser: string = '../../../../assets/img/no-image-user.jpg';
	imgDefaultLogo: string = '../../../../assets/img/logoDefault.png';

	listingId: number = 0;
	user!: User;
	listing: Partial<Listing> = {};
	openingHours: OpeningHours = {};
	daysOfWeek: string[] = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
	nowOpen: boolean = false;
	map: string = '';
	galleryImages: ListingGalleryImg[] = [];

	alert: any[] = [];

	selectedStars: number = 0;
  	hoverStars: number = 0;
  	totalStars: number = 5;
  	currentIcon: string = 'bi-star';
  	hoverIcon: string = 'bi-star-fill';
	notReview!: boolean;
	editingReview: boolean = false;

	rating: number = 0;
	formReview: FormGroup;
	reviews: Assessment[] = [];
	reviewToDelete: Partial<Assessment> = {}
	spinnerReview: boolean = false;
	spinnerDeleteReview: boolean = false;

	maxLengthComment: number = 130;
	currentLengthComment: number = 130

	constructor() {
		this.formReview = this.formBuilder.group({
			id: [0],
			listing: [0],
			user: [''],
			comment: ['', [Validators.required]],
			assessment: [0]
		});

		this.ngbRatingConfig.max = 5;
		this.ngbRatingConfig.readonly = true;
	}

	ngOnInit(): void {
		this.goToTheTopWindow();
		this.getParams();
		this.user = this.authService.getUserLogged() || {} as User;
	}

	ngOnDestroy(): void {
		this.titleService.setTitle(this.globalVariablesService.title);
	}

	getParams() {
		this.route.params.subscribe(params => {
			this.listingId = params['id'];
		})

		this.getListing();
		this.getReviews();
	}

	getListing() {
		this.spinnerService.show("Buscando anúncio, aguarde...");
		this.listingService.getById(this.listingId).subscribe((response) => {
			this.spinnerService.hide();
			this.listing = response;

			this.openingHours = this.listing.openingHours ? JSON.parse(this.listing.openingHours!) : {};

			if(this.listing.galleryImage) {
				this.galleryImages = this.listing.galleryImage;
			}

			this.setMap();
			this.titleService.setTitle(this.listing.title!);
		}, (error) => {
			this.spinnerService.hide();
			this.validErrorsService.validError(error, 'Falha ao buscar o anúncio');
		})
	}

	getReviews() {
		this.reviewService.fetchAll(this.listingId).subscribe((response) => {
			this.reviews = response;
		}, (error) => {
			this.validErrorsService.validError(error, 'Falha ao buscar as avaliações');
		})
	}

	formatDateAssessment(date: string) {
		const data = new Date(date);
		const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
		const formattedDate = data.toLocaleDateString('pt-BR', options);
		return formattedDate;
	}

	getAllRating() {
		if(!this.reviews.length) {
			return 0;
		}

		const sum = this.reviews.reduce((acc, assessment) => acc + assessment.assessment, 0);
		const result =  sum / this.reviews.length;
		return result
	}

	setMap() {
		if(this.listing.map) {
			const sanitizedHTML = this.listing.map?.replace('<iframe', `<iframe style="width: 100%; height: 300px;"`);

			if(sanitizedHTML) {
				this.map = sanitizedHTML;
			}
		}
	}

	isDayOpen(): boolean {
		const today = new Date();
		const dayOfWeek = today.getDay();
		const day = this.daysOfWeek[dayOfWeek];

		if(!this.openingHours[day]) {
			return false;
		}

		const openTime = new Date(today.toDateString() + ' ' + this.openingHours[day].open);
		const closeTime = new Date(today.toDateString() + ' ' + this.openingHours[day].close);
		return today >= openTime && today <= closeTime;
	}

	openLightbox(index: number): void {
		const album = this.galleryImages.map(link => {
		  return { src: link.imgUrl, caption: '', thumb: '' };
		});
	  
		this.lightbox.open(album, index);
	}  
	
	OpenModalNewReview() {
		this.notReview = false;
		this.editingReview = false;
		this.rating = 0;
		if(this.authService.getUserLogged()) {
			this.cleanFormReview();
			this.modal.open(this.modalReview, {centered: true});
		} else {
			this.alertService.showAlert('info', 'Você precisa realizar o login para avaliar.');

			const sharedData: Redirect = {
                redirectTo: `/app/anunciante/${this.listingId}`,
                redirectMsg: ''
            }

            this.redirectService.setData(sharedData);
            this.router.navigate(['/app/login']);
		}
	}

	openModalEditingReview(review: Assessment) {
		this.notReview = false;
		this.editingReview = true;
		this.rating = review.assessment;
		
		this.formReview.patchValue({
			id: review.id,
			listing: this.listingId,
			user: this.user.id,
			comment: review.comment,
			assessment: review.assessment
		});

		this.modal.open(this.modalReview, {centered: true});
		this.countCaracterComment();
	}

	submitReview() {
		if(!this.rating) {
			this.notReview = true;
			return;
		}

		this.formReview.patchValue({
			listing: this.listingId,
			user: this.user.id,
			assessment: this.rating
		});

		if(this.editingReview) {
			if(this.formReview.valid) {
				this.spinnerReview = true;
				this.reviewService.updateReview(this.formReview.value).subscribe((response) => {
					this.spinnerReview = false;
					this.modal.dismissAll(this.modalReview);
					this.alertService.showAlert('success', 'Avaliação atualizada com sucesso.');
					this.getReviews();
					return;
				}, (error) => {
					this.spinnerReview = false;
					this.validErrorsService.validError(error, 'Falha ao atualizar sua avaliação.');
					this.modal.dismissAll(this.modalReview);
					return;
				});
			}
		} else {
			if(this.formReview.valid) {
				this.spinnerReview = true;
				this.reviewService.newAssessment(this.formReview.value).subscribe((response) => {
					this.spinnerReview = false;
					this.modal.dismissAll(this.modalReview);
					this.alertService.showAlert('success', 'Avaliação inserida com sucesso.');
					this.getReviews();
				},(error) => {
					this.spinnerReview = false;
					this.validErrorsService.validError(error, 'Falha ao inserir sua avaliação.');
					this.modal.dismissAll(this.modalReview);
				});
			}
		}
	}

	openModalDeleteReview(assessment: Assessment) {
		this.reviewToDelete = assessment;
		this.modal.open(this.modalDeleteReview, {centered: true});
	}

	deleteReview() {
		if(this.reviewToDelete.user !== this.user.id) {
			this.alertService.showAlert('info', 'Esta avaliação não pertence a você.');
			return
		}
		this.spinnerDeleteReview = true;
		this.reviewService.delete(this.reviewToDelete.id!).subscribe((response) => {
			this.spinnerDeleteReview = false;
			this.getReviews();

			if(response.success) {
				this.alertService.showAlert('success', 'Avaliação excluída com sucesso.');
				this.modal.dismissAll(this.modalDeleteReview);
				return;
			}
		}, (error) => {
			this.spinnerDeleteReview = false;
			this.validErrorsService.validError(error, 'Falha ao deletar a sua avaliação.');
			this.modal.dismissAll(this.modalDeleteReview);
		});
	}

	cleanFormReview() {
		this.formReview.reset({
		  comment: '',
		  assessment: ''
		});

		this.notReview = false;
		this.rating = 0;
	}

	maxLengthValidator(maxLength: number) {
		return (control: AbstractControl): ValidationErrors | null => {
			const value: string = control.value || '';
			const length = value.trim().length;
		
			return length > maxLength ? { maxLengthExceeded: true } : null;
		};
	}

	countCaracterComment() {
		const currentLength = this.formReview.value.comment.length;
		this.currentLengthComment = Math.max(0, this.maxLengthComment - currentLength);
	}

	goToTheTopWindow() {
		window.scrollTo(0, 0);
	}
}
