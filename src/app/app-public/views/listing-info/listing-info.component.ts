import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Lightbox, LightboxModule } from 'ngx-lightbox';
import { AlertsComponent } from '../../../components/alerts/alerts.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { AssessmentService } from '../../../services/assessment.service';
import { User } from '../../../models/user';
import { Assessment } from '../../../models/Assessment';

@Component({
  	selector: 'app-listing-info',
  	standalone: true,
  	imports: [RouterModule, CommonModule, LightboxModule, ReactiveFormsModule, HttpClientModule, AlertsComponent, FooterComponent],
  	templateUrl: './listing-info.component.html',
  	styleUrl: './listing-info.component.css'
})
export class ListingInfoComponent implements OnInit{	
	@ViewChild('modalAssessment', {static: true}) modalAssessment!: ElementRef;
	@ViewChild('commentAssessment', {static: true}) commentAssessment!: ElementRef;

	route 				= inject(ActivatedRoute);
	router 				= inject(Router);
	lightbox 			= inject(Lightbox);
	modal 				= inject(NgbModal);
	formBuilder 		= inject(FormBuilder);
	assessmentService 	= inject(AssessmentService)

	listingId: number = 0;
	iconCategories: boolean = false;
	user: Partial<User> = {};

	alert: any[] = [];

	selectedStars: number = 0;
  	hoverStars: number = 0;
  	totalStars: number = 5;
  	currentIcon: string = 'bi-star';
  	hoverIcon: string = 'bi-star-fill';
	notAssessment!: boolean;

	formAssessment: FormGroup;
	assessment: Assessment[] = [];

	maxLengthComment: number = 130;
	currentLengthComment: number = 130

	constructor() {
		this.formAssessment = this.formBuilder.group({
			listing_id: [0],
			user_id: [''],
			comment: ['', [Validators.required]],
			assessment: [0, [Validators.required]]
		})
	}

	galleryImages = [
		'https://images.unsplash.com/photo-1682687220247-9f786e34d472?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8',
		'https://images.unsplash.com/photo-1682687982134-2ac563b2228b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		'https://images.unsplash.com/photo-1682686580036-b5e25932ce9a?q=80&w=1375&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		'https://images.unsplash.com/photo-1682687220199-d0124f48f95b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHw2fHx8ZW58MHx8fHx8',
		'https://images.unsplash.com/photo-1682685797828-d3b2561deef4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D'
	]

	ngOnInit(): void {
		this.goToTheTopWindow();
		this.getParams();
	}

	getParams() {
		this.route.params.subscribe(params => {
			this.listingId = params['id'];
		})
	}

	toggleIconOpeningHours() {
      this.iconCategories = !this.iconCategories;
   	}

	openLightbox(index: number): void {
		const album = this.galleryImages.map(link => {
		  return { src: link, caption: '', thumb: '' };
		});
  
		this.lightbox.open(album, index);
	}
	
	OpenModalUserAssessment() {
		if(this.getUserLogged()) {
			this.cleanFormAssessment();
			this.modal.open(this.modalAssessment, {centered: true});
		} else {
			const params = `/anuncios/${this.listingId}`;
			this.router.navigate(['/login'], {queryParams: {redirectTo: params}})
		}
	}

	submitAssessment() {
		this.formAssessment.get('listing_id')?.setValue(this.listingId);
		this.formAssessment.get('user_id')?.setValue(this.user.id);

		if(!this.selectedStars) {
			this.notAssessment = true;
			return;
		}

		if(this.formAssessment.valid) {
			this.assessmentService.newAssessment(this.formAssessment.value).subscribe((response) => {
				this.modal.dismissAll(this.modalAssessment);
				this.alerts('success', 'Avaliação inserida com sucesso.');
			},(error) => {
				this.alerts('error', 'Falha ao inserir sua avaliação.');
				console.error('ERROR: ', error);
			})
		}
	}

	cleanFormAssessment() {
		this.formAssessment.reset({
		  comment: '',
		  assessment: ''
		});

		this.selectedStars = 0;
	}

	selectStars(stars: number): void {
		this.notAssessment = false;
		this.selectedStars = stars;
		this.formAssessment.get('assessment')?.setValue(this.selectedStars);
	}
	
	hoverStar(stars: number): void {
		this.hoverStars = stars;
	}
	
	resetHover(): void {
		this.hoverStars = 0;
	}

	getUserLogged() {
		const user = localStorage.getItem('userData');

		if(user) {
			this.user = JSON.parse(user) as User;
			return true;
		}

		return false;
	}

	maxLengthValidator(maxLength: number) {
		return (control: AbstractControl): ValidationErrors | null => {
			const value: string = control.value || '';
			const length = value.trim().length;
		
			return length > maxLength ? { maxLengthExceeded: true } : null;
		};
	}

	countCaracterComment() {
		const currentLength = this.formAssessment.get('comment')?.value.length
		this.currentLengthComment = Math.max(0, this.maxLengthComment - currentLength);
	}

	alerts(type: string, description: string | any) {
		this.alert.push({
		   type: type,
		   description: description
		})
	}

	goToTheTopWindow() {
		window.scrollTo(0, 0);
	}
}
