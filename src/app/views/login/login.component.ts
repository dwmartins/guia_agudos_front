import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { AlertsComponent } from '../../components/alerts/alerts.component';
import { HeaderService } from '../../services/header.service';
import { Footer2Component } from '../../components/footer-2/footer-2.component';

@Component({
   selector: 'app-login',
   standalone: true,
   imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule, AlertsComponent, Footer2Component],
   templateUrl: './login.component.html',
   styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
   route = inject(ActivatedRoute);

   formLogin: FormGroup;
   user: Partial<User> = {};

   icon_password: string = 'bi bi-eye';
   showPassword: string = 'password';

   alert: any[] = [];

   loadSpinner: boolean = false;

   params: string | null = null;
   paramsMsg: string | null = null;

   constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private userService: UserService,
      private headerService: HeaderService
   ) {
      this.formLogin = this.formBuilder.group({
         email: ['', [Validators.required, Validators.email]],
         password: ['', [Validators.required]]
      });
   }

   ngOnInit(): void {
      this.goToTheTopWindow();
      this.getParams();

      const user = localStorage.getItem('userData');
      if(user) {
         this.user = JSON.parse(user) as User;
         if(this.user.token) {
            this.router.navigate(['/']);
         }
      }
   }

   submitForm() {
      if(this.formLogin.valid) {
         this.loadSpinner = true;
         this.userService.login(this.formLogin.value).subscribe((response) => {
            this.loadSpinner = false;
            if('alert' in response) {
               this.alerts('alert', response.alert);
               return;
            }

            this.user = response;
            this.setLocalStorage();
            this.alerts('success', 'Login realizado com sucesso.');

            if(this.params) {
               this.headerService.update(true);
               this.router.navigate([this.params]);
               return;
            }

            setTimeout(() => {
               this.headerService.update(true);
               this.router.navigate(['/']);
            }, 1500);
         }, (error) => {
            this.loadSpinner = false
            this.alerts('error', 'Falha ao realizar o login');
            console.error('ERROR: ', error);
         })
      } else {
         this.formLogin.markAllAsTouched();
      }
   }

   setLocalStorage() {
      const userData = JSON.stringify(this.user);
      localStorage.setItem('userData', userData);
   }

   viePassword() {
      this.showPassword = (this.showPassword === "text") ? "password" : (this.showPassword === "password") ? "text" : this.showPassword
      this.icon_password = (this.icon_password === "bi bi-eye") ? "bi bi-eye-slash" : (this.icon_password === "bi bi-eye-slash") ? "bi bi-eye" : this.icon_password;
   }

   getParams() {
      this.route.queryParamMap.subscribe((queryParams) => {
         this.params = queryParams.get('redirectTo') || null;
         this.paramsMsg = queryParams.get('redirectMsg');
      });

      if(this.params) {
         this.alerts('alert', this.paramsMsg);
      }
   }

   alerts(type: string, description: string | any) {
      this.alert.push({
         type: type,
         description: description
      })
   }

   goToTheTopWindow() {
		window.scrollTo(0, 0);
	}
}
