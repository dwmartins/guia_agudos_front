import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
   selector: 'app-login',
   standalone: true,
   imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
   templateUrl: './login.component.html',
   styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

   formLogin: FormGroup;
   user: Partial<User> = {};

   icon_password: string = 'bi bi-eye';
   showPassword: string = 'password';

   constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private userService: UserService
   ) {
      this.formLogin = this.formBuilder.group({
         email: ['', [Validators.required, Validators.email]],
         password: ['', [Validators.required]]
      });
   }

   ngOnInit(): void {
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
         this.userService.login(this.formLogin.value).subscribe((response) => {
            if('alert' in response) {
               console.log(response.alert)
               return;
            }

            this.user = response;
            this.setLocalStorage();
            // this.router.navigate(['/']);
         }, (error) => {
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
}
