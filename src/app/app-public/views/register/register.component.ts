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
import { AlertService } from '../../../services/components/alert.service';
import { ValidErrorsService } from '../../../services/helpers/valid-errors.service';
import { ImageValidationService } from '../../../services/helpers/image-validation.service';
import { SpinnerLoadingComponent } from '../../../shared/components/spinner-loading/spinner-loading.component';

@Component({
   selector: 'app-register',
   standalone: true,
   imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule, AlertsComponent, Footer2Component, SpinnerLoadingComponent],
   templateUrl: './register.component.html',
   styleUrl: './register.component.css'
})
export class RegisterComponent {
   validErrorsService   = inject(ValidErrorsService);
   formBuilder          = inject(FormBuilder);
   router               = inject(Router);
   userService          = inject(UserService);
   modalRegister        = inject(NgbModal);
   alertService         = inject(AlertService);
   imageService         = inject(ImageValidationService);

   @ViewChild('register', { static: true }) register!: ElementRef;

   registerData: { photo_url: string | null } = { photo_url: null };

   icon_password: string = 'bi bi-eye';
   showPassword: string = 'password';

   formRegister: FormGroup
   user: Partial<User> = {};

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
            this.modalRegister.open(this.register, { centered: true });

         }, (error) => {
            this.validErrorsService.validError(error, "Falha ao realizar o login");
            this.loadSpinner = false;
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
         if(this.imageService.validImage(file)) {
            this.userPhoto = file;
            const reader = new FileReader();
            
            reader.onload = () => {
               this.previewPhoto = reader.result?.toString();
               this.userPhoto = file;
            };

            reader.readAsDataURL(file);
         }

      } else {
         this.previewPhoto = null;
      }
   }

   redirectToLogin() {
      this.modalRegister.dismissAll(this.register);
      this.router.navigate(['/login']);
   }
}
