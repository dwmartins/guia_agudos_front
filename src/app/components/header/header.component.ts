import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../models/user';
import { HeaderService } from '../../services/header.service';

@Component({
   selector: 'app-header',
   standalone: true,
   imports: [CommonModule, RouterModule],
   templateUrl: './header.component.html',
   styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
   @ViewChild('navbar', {static: true}) navbar!: ElementRef;

   user: Partial<User> = {};
   userLogged: boolean = false;

   constructor(private router: Router, private headerService: HeaderService) {}

   ngOnInit(): void {
      this.checkUserLogged();
   }

   checkUserLogged() {
      this.headerService.updateHeader$.subscribe((show) => {
         this.setUserData();
      })
   }

   setUserData() {
      const user = localStorage.getItem('userData');
      if (user) {
         this.user = JSON.parse(user) as User;
         this.userLogged = true;
      }
   }

   logout() {
      localStorage.removeItem('userData');
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
