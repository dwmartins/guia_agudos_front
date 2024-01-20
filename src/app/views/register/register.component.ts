import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../models/user';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AlertsComponent } from '../../components/alerts/alerts.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
   selector: 'app-register',
   standalone: true,
   imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule, AlertsComponent],
   templateUrl: './register.component.html',
   styleUrl: './register.component.css'
})
export class RegisterComponent {
   @ViewChild('register', { static: true }) register!: ElementRef;

   formBuilder = inject(FormBuilder);
   router = inject(Router);
   userService = inject(UserService);
   modalRegister = inject(NgbModal);

   registerData: { photo_url: string | null } = { photo_url: null };

   icon_password: string = 'bi bi-eye';
   showPassword: string = 'password';

   formRegister: FormGroup
   user: Partial<User> = {};

   alert: any[] = [];

   loadSpinner: boolean = false;
   userPhoto!: File;

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
               this.alerts('alert', response.alert);
               return;
            }

            this.modalRegister.open(this.register, { centered: true });

         }, (error) => {
            this.loadSpinner = false;
            this.alerts('error', 'Falha ao criar a sua conta.');
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
            this.alerts('alert', 'A imagem de perfil deve ter no máximo 5 MB.');
            this.registerData.photo_url = null;
            return;
         }

         const reader = new FileReader();

         reader.onload = () => {
            if (reader.result?.toString().startsWith('data:image/jpeg;base64,')) {
               this.registerData.photo_url = reader.result?.toString();
               this.formRegister.get('photo_url')?.setValue(reader.result?.toString());
               this.userPhoto = file;
            } else {
               this.alerts('alert', 'A imagem de perfil deve ser do tipo JPG');
               this.registerData.photo_url = null;
            }
         };

         reader.readAsDataURL(file);
      } else {
         this.registerData.photo_url = null;
      }
   }

   alerts(type: string, description: string | any) {
      this.alert.push({
         type: type,
         description: description
      })
   }

   redirectToLogin() {
      this.modalRegister.dismissAll(this.register);
      this.router.navigate(['/login']);
   }
}
