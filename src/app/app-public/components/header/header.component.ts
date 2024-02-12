import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../models/user';
import { HeaderService } from '../../../services/components/header.service';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/components/alert.service';

@Component({
   selector: 'app-header',
   standalone: true,
   imports: [CommonModule, RouterModule],
   templateUrl: './header.component.html',
   styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
   authService     = inject(AuthService);
   headerService   = inject(HeaderService);
   router          = inject(Router);
   alertService    = inject(AlertService);

   @ViewChild('navbar', {static: true}) navbar!: ElementRef;

   user: Partial<User> = {};
   userLogged: boolean = false;

   constructor() {}

   ngOnInit(): void {
      this.checkUserLogged();
   }

   checkUserLogged() {
      this.headerService.updateHeader$.subscribe((show) => {
         const user = this.authService.getUserLogged();
         
         if(user) {
            this.userLogged = true;
            this.user = user;
         } else {
            this.userLogged = false;
         }
      });
   }

   logout() {
      this.authService.logout();
      this.alertService.showAlert('success', 'Você saiu, volte sempre!');
      this.userLogged = false;
   }

   closeNavbar(): void {
      const navbar = this.navbar.nativeElement;

      if(navbar.classList.contains('show')) {
         navbar.classList.remove('show');
      }
   }

}
