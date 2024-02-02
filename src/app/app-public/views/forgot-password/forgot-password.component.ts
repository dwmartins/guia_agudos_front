import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { AlertsComponent } from '../../../shared/components/alerts/alerts.component';
import { Footer2Component } from '../../components/footer-2/footer-2.component';
import { AlertService } from '../../../services/componsents/alert.service';

@Component({
   selector: 'app-forgot-password',
   standalone: true,
   imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule, AlertsComponent, Footer2Component],
   templateUrl: './forgot-password.component.html',
   styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
   modalForgotPassword  = inject(NgbModal);
   formBuilder          = inject(FormBuilder);
   router               = inject(Router);
   userService          = inject(UserService);
   alertService         = inject(AlertService);
   
   @ViewChild('success', { static: true }) success!: ElementRef;
   
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
               this.alertService.showAlert('info', response.alert);
               return;
            }

            this.modalForgotPassword.open(this.success, { centered: true });
         }, (error) => {
            this.loadSpinner = false;
            this.alertService.showAlert('error', 'Falha ao buscar o e-mail');
            console.error('ERROR: ', error);
         })
      } else {
         this.formForgotPassword.markAllAsTouched();
      }
   }

   redirectToLogin() {
      this.modalForgotPassword.dismissAll(this.success);
      this.router.navigate(['/app/login']);
   }
}
