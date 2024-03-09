import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RedirectService } from '../../../services/helpers/redirect.service';
import { UserService } from '../../../services/user.service';
import { HeaderService } from '../../../services/components/header.service';
import { User } from '../../../models/user';
import { Redirect } from '../../../models/Redirect';
import { AlertsComponent } from '../../../shared/components/alerts/alerts.component';
import { Footer2Component } from '../../components/footer-2/footer-2.component';
import { AlertService } from '../../../services/components/alert.service';
import { AuthService } from '../../../services/auth.service';

@Component({
   selector: 'app-login',
   standalone: true,
   imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule, AlertsComponent, Footer2Component],
   templateUrl: './login.component.html',
   styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
   route             = inject(ActivatedRoute);
   router            = inject(Router);
   redirectService   = inject(RedirectService);
   alertService      = inject(AlertService);
   authService       = inject(AuthService);
   userService       = inject(UserService);
   headerService     = inject(HeaderService);
   formBuilder       = inject(FormBuilder);

   formLogin: FormGroup;
   user: Partial<User> = {};

   icon_password: string = 'bi bi-eye';
   showPassword: string = 'password';

   alert: any[] = [];

   loadSpinner: boolean = false;

   redirect: Partial<Redirect> = {};

   constructor() {
      this.formLogin = this.formBuilder.group({
         email: ['', [Validators.required, Validators.email]],
         password: ['', [Validators.required]]
      });
   }

   ngOnInit(): void {
      this.checkUserLogged();
      this.goToTheTopWindow();
      this.getRedirect();
   }

   submitForm() {
      if(this.formLogin.valid) {
         this.loadSpinner = true;
         this.userService.login(this.formLogin.value).subscribe((response) => {
            this.loadSpinner = false;
            if('alert' in response) {
               this.alertService.showAlert('info', response.alert);
               return;
            }

            this.user = response;
            this.authService.setUserLogged(response);
            this.headerService.update(true);
            this.alertService.showAlert('success', 'Login realizado com sucesso.');

            setTimeout(() => {
               if(Object.keys(this.redirect).length) {
                  this.router.navigate([this.redirect.redirectTo]);
                  return;
               }

               this.router.navigate(['/app']);
               return;
            }, 1000);

         }, (error) => {
            this.loadSpinner = false
            this.alertService.showAlert('error', 'Falha ao realizar o login');
            console.error('ERROR: ', error);
         })
      } else {
         this.formLogin.markAllAsTouched();
      }
   }

   viePassword() {
      this.showPassword = (this.showPassword === "text") ? "password" : (this.showPassword === "password") ? "text" : this.showPassword
      this.icon_password = (this.icon_password === "bi bi-eye") ? "bi bi-eye-slash" : (this.icon_password === "bi bi-eye-slash") ? "bi bi-eye" : this.icon_password;
   }

   checkUserLogged() {
      if(this.authService.getUserLogged()) {
         this.router.navigate(['/app']);
      }
   }

   getRedirect() {
      this.redirect = this.redirectService.getData();
   }

   goToTheTopWindow() {
		window.scrollTo(0, 0);
	}
}
