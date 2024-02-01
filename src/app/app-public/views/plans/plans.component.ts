import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Footer2Component } from '../../../components/footer-2/footer-2.component';
import { PlansService } from '../../../services/plans.service';
import { RedirectService } from '../../../services/redirect.service';
import { BannerPrice } from '../../../models/BannerPrice';
import { User } from '../../../models/user';
import { Redirect } from '../../../models/Redirect';

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

    banners: BannerPrice[] = [];
    user: Partial<User> = {};

    ngOnInit(): void {
        this.getBanners();
        this.goToTheTopWindow();
    }

    createListing() {
        if(!this.getUserLogged()) {
            const sharedData: Redirect = {
                redirectTo: '/planos',
                redirectMsg: 'Você precisa estar logado para criar um anúncio'
            }

            this.redirectService.setData(sharedData);
            this.router.navigate(['/login']);
            return;
        }

        this.router.navigate(['/anuncios/novo']);
    }

    getUserLogged() {
		const user = localStorage.getItem('userData');

		if(user) {
			this.user = JSON.parse(user) as User;
			return true;
		}

		return false;
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
