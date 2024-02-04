import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { AlertsComponent } from '../../../shared/components/alerts/alerts.component';
import { Footer2Component } from '../../components/footer-2/footer-2.component';
import { AlertService } from '../../../services/componsents/alert.service';

@Component({
   selector: 'app-register',
   standalone: true,
   imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule, AlertsComponent, Footer2Component],
   templateUrl: './register.component.html',
   styleUrl: './register.component.css'
})
export class RegisterComponent {
   formBuilder    = inject(FormBuilder);
   router         = inject(Router);
   userService    = inject(UserService);
   modalRegister  = inject(NgbModal);
   alertService   = inject(AlertService);

   @ViewChild('register', { static: true }) register!: ElementRef;

   registerData: { photo_url: string | null } = { photo_url: null };

   icon_password: string = 'bi bi-eye';
   showPassword: string = 'password';

   formRegister: FormGroup
   user: Partial<User> = {};

   alert: any[] = [];

   loadSpinner: boolean = false;

   userPhoto!: File;
   previewPhoto!: string | null | undefined;

   constructor() {
      this.formRegister = this.formBuilder.group({
         name: ['', [Validators.required]],
         lastName: ['', [Validators.required]],
         email: ['', [Validators.required, Validators.email]],
         password: ['', [Validators.required]],
      })
   }
   submitForm() {
      if (this.formRegister.valid) {
         this.loadSpinner = true;
         this.userService.newUser(this.formRegister.value, this.userPhoto).subscribe((response) => {
            this.loadSpinner = false;

            if ('alert' in response) {
               this.alertService.showAlert('info', response.alert);
               return;
            }

            this.modalRegister.open(this.register, { centered: true });

         }, (error) => {
            this.loadSpinner = false;
            this.alertService.showAlert('info', 'Falha ao criar a sua conta.');
            console.error('ERROR: ', error);
         })
      } else {
         this.formRegister.markAllAsTouched();
      }
   }

   viePassword() {
      this.showPassword = (this.showPassword === "text") ? "password" : (this.showPassword === "password") ? "text" : this.showPassword
      this.icon_password = (this.icon_password === "bi bi-eye") ? "bi bi-eye-slash" : (this.icon_password === "bi bi-eye-slash") ? "bi bi-eye" : this.icon_password;
   }

   previewImage(event: Event): void {
      const fileInput = event.target as HTMLInputElement;
      const file = fileInput.files?.[0];

      if (file) {
         if (file.size > 5 * 1024 * 1024) {
            this.alertService.showAlert('info', 'A imagem de perfil deve ter no máximo 5MB.');
            this.previewPhoto = null;
            return;
         }

         const validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];

         if(validExtensions.includes(file.type)) {
            const reader = new FileReader();

            reader.onload = () => {
               this.previewPhoto = reader.result?.toString();
               this.userPhoto = file;
            };

            reader.readAsDataURL(file);
         } else {
            this.alertService.showAlert('info', 'O formato da imagem deve ser (png, jpg, jpeg)');
         }

      } else {
         this.previewPhoto = null;
      }
   }

   redirectToLogin() {
      this.modalRegister.dismissAll(this.register);
      this.router.navigate(['/app/login']);
   }
}