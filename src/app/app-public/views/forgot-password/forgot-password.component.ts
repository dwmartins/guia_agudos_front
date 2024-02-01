import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsComponent } from '../../../components/alerts/alerts.component';
import { Footer2Component } from '../../../components/footer-2/footer-2.component';
import { UserService } from '../../../services/user.service';

@Component({
   selector: 'app-forgot-password',
   standalone: true,
   imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule, AlertsComponent, Footer2Component],
   templateUrl: './forgot-password.component.html',
   styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
   @ViewChild('success', { static: true }) success!: ElementRef;
   
   modalForgotPassword = inject(NgbModal);
   formBuilder = inject(FormBuilder);
   router = inject(Router);
   userService = inject(UserService);

   formForgotPassword: FormGroup;

   alert: any[] = [];

   loadSpinner: boolean = false;

   constructor() {
      this.formForgotPassword = this.formBuilder.group({
         email: ['', [Validators.required, Validators.email]]
      })
   }

   submitForm() {
      if(this.formForgotPassword.valid) {
         this.loadSpinner = true;
         this.userService.sendNewPassword(this.formForgotPassword.value).subscribe((response) => {
            this.loadSpinner = false;
            if('alert' in response) {
               this.alerts('alert', response.alert);
               return;
            }

            this.modalForgotPassword.open(this.success, { centered: true });
         }, (error) => {
            this.loadSpinner = false;
            this.alerts('error', 'Falha ao buscar o e-mail');
            console.error('ERROR: ', error);
         })
      } else {
         this.formForgotPassword.markAllAsTouched();
      }
   }

   alerts(type: string, description: string | any) {
      this.alert.push({
         type: type,
         description: description
      })
   }

   redirectToLogin() {
      this.modalForgotPassword.dismissAll(this.success);
      this.router.navigate(['/login']);
   }
}
