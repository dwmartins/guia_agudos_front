import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../../../models/user';
import { AuthService } from '../../../services/auth.service';
import { DateService } from '../../../services/helpers/date.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { ListingService } from '../../../services/listing.service';
import { Listing } from '../../../models/listing';
import { ValidErrorsService } from '../../../services/helpers/valid-errors.service';
import { AlertService } from '../../../services/components/alert.service';
import { GlobalVariablesService } from '../../../services/helpers/global-variables.service';
import { SpinnerService } from '../../../services/components/spinner.service';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ListingPlansService } from '../../../services/listingPlans.service';
import { ListingPlans } from '../../../models/ListingPlans';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule, RouterModule, FooterComponent, NgbRatingModule],
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit, OnDestroy{
    titleService		    = inject(Title);	
    authService             = inject(AuthService);
    dateService             = inject(DateService);
    listingService          = inject(ListingService);
    validErrorsService  	= inject(ValidErrorsService);
    alertService 			= inject(AlertService);
    globalVariablesService  = inject(GlobalVariablesService);
    route 					= inject(ActivatedRoute);
	router 					= inject(Router);
    spinnerService          = inject(SpinnerService);
    ngbRatingConfig			= inject(NgbRatingConfig);
    listingPlansService     = inject(ListingPlansService);

    user!: User;
    listings: Listing[] = [];
    listingPlans: ListingPlans[] = [];

    imgDefaultLogo: string = '../../../../assets/img/logoDefault.png';
    imgDefaultUser: string = '../../../../assets/img/no-image-user.jpg';

    constructor() {
        this.ngbRatingConfig.max = 5;
		this.ngbRatingConfig.readonly = true;
    }

    ngOnInit(): void {
        this.user = this.authService.getUserLogged() || {} as User;
        this.titleService.setTitle(`Perfil - ${this.user.name} ${this.user.lastName}`);
        this.getData();
    }

    ngOnDestroy(): void {
        this.titleService.setTitle(this.globalVariablesService.title);
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
    
        const listingsObservable = this.listingService.getByUser(this.user.id);
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

    getAllRating(listing: Listing) {
		if(!listing.reviews) {
			return 0;
		}

		const sum = listing.reviews.reduce((acc, review) => acc + review.review, 0);
		const result =  sum / listing.reviews.length;
		return result
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
}
