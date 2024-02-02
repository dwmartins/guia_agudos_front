import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../models/user';
import { HeaderService } from '../../../services/componsents/header.service';
import { AuthService } from '../../../services/auth.service';

@Component({
   selector: 'app-header',
   standalone: true,
   imports: [CommonModule, RouterModule],
   templateUrl: './header.component.html',
   styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
   authService = inject(AuthService);
   headerService   = inject(HeaderService);
   router          = inject(Router);

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
         }
      });
   }

   logout() {
      this.authService.logout();
      this.userLogged = false;
      this.router.navigate(['/']);
   }

   closeNavbar(): void {
      const navbar = this.navbar.nativeElement;

      if(navbar.classList.contains('show')) {
         navbar.classList.remove('show');
      }
   }

}
