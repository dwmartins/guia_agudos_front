import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PlansService } from '../../../services/plans.service';
import { RedirectService } from '../../../services/redirect.service';
import { BannerPrice } from '../../../models/BannerPrice';
import { User } from '../../../models/user';
import { Redirect } from '../../../models/Redirect';
import { Footer2Component } from '../../components/footer-2/footer-2.component';
import { AlertService } from '../../../services/componsents/alert.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-plans',
    standalone: true,
    imports: [CommonModule, Footer2Component, RouterModule],
    templateUrl: './plans.component.html',
    styleUrl: './plans.component.css'
})
export class PlansComponent implements OnInit {
    route 			= inject(ActivatedRoute);
	router 			= inject(Router);
    plansService    = inject(PlansService);
    redirectService = inject(RedirectService);
    alertService    = inject(AlertService);
    authService     = inject(AuthService);

    banners: BannerPrice[] = [];
    user: Partial<User> = {};

    ngOnInit(): void {
        this.getBanners();
        this.goToTheTopWindow();
    }

    createListing() {
        if(!this.authService.getUserLogged()) {
            this.alertService.showAlert('info', 'Você precisa estar logado para criar um anúncio');

            const sharedData: Redirect = {
                redirectTo: '/app/planos',
                redirectMsg: ''
            }

            this.redirectService.setData(sharedData);
            this.router.navigate(['/app/login']);
            return;
        }

        this.router.navigate(['/app/anunciantes/novo']);
    }

    getBanners() {
        this.plansService.banners("Y").subscribe((response) => {
            this.banners = response;
        }, (error) => {
            console.error('ERROR: ', error);
        })
    }

    goToTheTopWindow() {
		window.scrollTo(0, 0);
	}
}
