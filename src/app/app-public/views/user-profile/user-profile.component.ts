import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule, RouterModule, FooterComponent],
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{
    authService             = inject(AuthService);
    dateService             = inject(DateService);
    listingService          = inject(ListingService);
    validErrorsService  	= inject(ValidErrorsService);
    alertService 			= inject(AlertService);
    globalVariablesService  = inject(GlobalVariablesService);
    route 					= inject(ActivatedRoute);
	router 					= inject(Router);
    spinnerService          = inject(SpinnerService);

    user!: User;
    listings: Listing[] = [];

    imgDefaultLogo: string = '../../../../assets/img/logoDefault.png';

    ngOnInit(): void {
        this.user = this.authService.getUserLogged() || {} as User;
        this.getListings();
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

    getListings() {
        this.spinnerService.show("Buscando dados do seu perfil, aguarde...");
        this.listingService.getByUser(this.user.id).subscribe((response) => {
            this.spinnerService.hide();
            this.listings = response;
        }, (error) => {
            this.validErrorsService.validError(error, "Falha ao buscar seus anúncios.");
            this.spinnerService.hide();
        })
    }
}
