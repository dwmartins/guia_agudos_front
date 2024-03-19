import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../../../models/user';
import { AuthService } from '../../../services/auth.service';
import { DateService } from '../../../services/helpers/date.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { ListingService } from '../../../services/listing.service';
import { Listing } from '../../../models/listing';
import { ValidErrorsService } from '../../../services/helpers/valid-errors.service';
import { AlertService } from '../../../services/components/alert.service';
import { ConstantsService } from '../../../services/helpers/constants.service';
import { SpinnerService } from '../../../services/components/spinner.service';
import { NgbModal, NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ListingPlansService } from '../../../services/listingPlans.service';
import { ListingPlans } from '../../../models/ListingPlans';
import { forkJoin } from 'rxjs';
import { ImageValidationService } from '../../../services/helpers/image-validation.service';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule, RouterModule, FooterComponent, NgbRatingModule],
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit, OnDestroy{
    titleService		    = inject(Title);	
    modal 					= inject(NgbModal);
    authService             = inject(AuthService);
    userService             = inject(UserService);
    dateService             = inject(DateService);
    listingService          = inject(ListingService);
    validErrorsService  	= inject(ValidErrorsService);
    alertService 			= inject(AlertService);
    constantsService        = inject(ConstantsService);
    route 					= inject(ActivatedRoute);
	router 					= inject(Router);
    spinnerService          = inject(SpinnerService);
    ngbRatingConfig			= inject(NgbRatingConfig);
    listingPlansService     = inject(ListingPlansService);
    imageService            = inject(ImageValidationService);


    @ViewChild('modalDeleteListing', {static: true}) modalDeleteListing!: ElementRef;
    @ViewChild('modalChangePhotoUser', {static: true}) modalChangePhotoUser!: ElementRef;

    user!: User;
    newPhotoUser!: File;
    previewNewPhotoUser: string | null | undefined;

    listings: Listing[] = [];
    listingPlans: ListingPlans[] = [];
    listingToDelete: Partial<Listing> = {};

    imgDefaultLogo: string = '../../../../assets/img/logoDefault.png';
    imgDefaultUser: string = '../../../../assets/img/no-image-user.jpg';

    spinnerDeleteListing: boolean = false;
    spinnerChangePhotoUser: boolean = false;

    constructor() {
        this.getUserLogged();
        this.ngbRatingConfig.max = 5;
		this.ngbRatingConfig.readonly = true;
    }

    ngOnInit(): void {
        this.titleService.setTitle(`Perfil - ${this.user.name} ${this.user.lastName}`);
        this.getData();
    }

    ngOnDestroy(): void {
        this.titleService.setTitle(this.constantsService.siteTitle);
    }

    getUserLogged() {
        const user = this.authService.getUserLogged();
        if(user) {
            this.user = user;
        }
    }

    setGreeting() {
        const now = new Date();
        const hour = now.getHours();

        if (hour >= 6 && hour < 12) {
            return'Bom dia';
        } else if (hour >= 12 && hour < 18) {
            return'Boa tarde';
        } else {
            return'Boa noite';
        }
    }

    getData() {
        this.spinnerService.show("Buscando dados do seu perfil, aguarde...");
    
        const listingsObservable = this.listingService.getByUser(this.user.id!);
        const plansObservable = this.listingPlansService.getPlans("Y");
    
        forkJoin([listingsObservable, plansObservable]).subscribe(
            ([listingsResponse, plansResponse]) => {
                this.spinnerService.hide();
                this.listings = listingsResponse;
                this.listingPlans = plansResponse;
            
            },
            (error) => {
                this.validErrorsService.validError(error, "Falha ao buscar dados do seu perfil.");
                this.spinnerService.hide();
            }
        );
    }

    getListings() {
        this.listingService.getByUser(this.user.id!).subscribe((response) => {
            this.listings = response;
        }, (error) => {
            this.validErrorsService.validError(error, "Falha ao buscar os anúncios.");
        });
    }

    getAllRating(listing: Listing) {
		if(!listing.reviews) {
			return 0;
		}

		const sum = listing.reviews.reduce((acc, review) => acc + review.review, 0);
		const result =  sum / listing.reviews.length;
		return result
	}

    openModalDeleteReview(listing: Listing) {
		this.listingToDelete = listing;
		this.modal.open(this.modalDeleteListing, {centered: true});
	}

    deleteListing() {
        this.spinnerDeleteListing = true;
        this.listingService.delete(this.listingToDelete.id!).subscribe((response) => {
            this.modal.dismissAll(this.modalDeleteListing);
            this.spinnerDeleteListing = false;
            this.alertService.showAlert('success', 'Anúncio excluído com sucesso.');
            this.getListings();

        }, (error) => {
            this.modal.dismissAll(this.modalDeleteListing);
            this.spinnerDeleteListing = false;
            this.validErrorsService.validError(error, "Falha ao excluir o anúncio.");
        });
    }

    viewListing(listing: Listing) {
        if(this.hasDetailsPage(listing)) {
            this.router.navigate(['/anunciante', listing.id]);
        }
    }

    hasDetailsPage(listing: Listing) {
        const plan = this.listingPlans.find(plan => plan.id === listing.planId);
        const plansInfo = plan?.plansInfo;

        const detailPage = plansInfo?.find(obj => obj.description === "Página de detalhes");

        if(detailPage?.active === "Y") {
            return true;
        }

        return false;
    }

    previewPhotoUser(event: Event) {
        const fileInput = event.target as HTMLInputElement;
        const file = fileInput.files?.[0];

        if(file) {
            if(this.imageService.validImage(file)){
                this.newPhotoUser = file;
                const reader = new FileReader();

                reader.onload = () => {
                    this.previewNewPhotoUser = reader.result?.toString();
                };
                reader.readAsDataURL(file);
            }

            this.modal.open(this.modalChangePhotoUser, {centered: true});
        }
	}

    ChangePhotoUser() {
        this.spinnerChangePhotoUser = true;
        this.userService.updatePhoto(this.newPhotoUser).subscribe((response) => {
            this.modal.dismissAll(this.modalChangePhotoUser);
            this.spinnerChangePhotoUser = false;
            this.alertService.showAlert('success', 'Foto de perfil atualizada com sucesso.');

            
            this.authService.updateUserLogged(response);
            this.getUserLogged();
        }, (error) => {
            this.modal.dismissAll(this.modalChangePhotoUser);
            this.spinnerChangePhotoUser = false;
            this.validErrorsService.validError(error, "Falha ao atualizar sua foto de perfil.");
        })
    }
}
