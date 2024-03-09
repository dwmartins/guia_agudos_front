import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ListingPlansService } from '../../../services/listingPlans.service';
import { RedirectService } from '../../../services/helpers/redirect.service';
import { BannerPrice } from '../../../models/BannerPrice';
import { User } from '../../../models/user';
import { Redirect } from '../../../models/Redirect';
import { AlertService } from '../../../services/components/alert.service';
import { AuthService } from '../../../services/auth.service';
import { ListingPlans } from '../../../models/ListingPlans';
import { FooterComponent } from '../../components/footer/footer.component';
import { SpinnerService } from '../../../services/components/spinner.service';

@Component({
    selector: 'app-plans',
    standalone: true,
    imports: [CommonModule, FooterComponent, RouterModule],
    templateUrl: './plans.component.html',
    styleUrl: './plans.component.css'
})
export class PlansComponent implements OnInit {
    route 			= inject(ActivatedRoute);
	router 			= inject(Router);
    listingPlansService    = inject(ListingPlansService);
    redirectService = inject(RedirectService);
    alertService    = inject(AlertService);
    authService     = inject(AuthService);
    spinnerService  = inject(SpinnerService);

    banners: BannerPrice[] = [];
    listingPlans: ListingPlans[] = [];
    user: Partial<User> = {};

    ngOnInit(): void {
        this.goToTheTopWindow();
        this.getAllPlans();
    }

    createListing(planId: number) {
        if(!this.authService.getUserLogged()) {
            this.alertService.showAlert('info', 'Você precisa estar logado para criar um anúncio');

            const sharedData: Redirect = {
                redirectTo: '/planos',
                redirectMsg: ''
            }

            this.redirectService.setData(sharedData);
            this.router.navigate(['/login']);
            return;
        }

        this.router.navigate([`/anunciantes/novo/${planId}`]);
    }

    getAllPlans() {
        this.getBanners();
        this.getListingPlans();
    }

    getBanners() {
        this.listingPlansService.banners("Y").subscribe((response) => {
            this.banners = response;
        }, (error) => {
            console.error('ERROR: ', error);
        })
    }

    getListingPlans() {
        this.spinnerService.show('Buscando planos, aguarde...');
        this.listingPlansService.getPlans("Y").subscribe(response => {
            this.spinnerService.hide();
            this.listingPlans = response;
        }, error => {
            this.spinnerService.hide();
            console.error('ERROR: ', error);
            this.alertService.showAlert('error', 'Falha ao buscar os planos.');
        })
    }

    goToTheTopWindow() {
		window.scrollTo(0, 0);
	}
}
