import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertService } from '../components/alert.service';

@Injectable({
    providedIn: 'root'
})
export class ValidErrorsService {
    authService = inject(AuthService);
    alertService = inject(AlertService);

    constructor() { }

    validError(error: any, msg: string = '') {
        if (error.status === 401) {
            if (error.error.expiredToken) {
                this.alertService.showAlert('info', 'Sua seção expirou, realize o login novamente.');
                this.authService.logout();

            } else if (error.error.invalidToken) {
                this.alertService.showAlert('info', 'Realize o login para acessar esta área.');
                this.authService.logout();
                
            }
        }

        if(error.status === 400) {
            this.alertService.showAlert('error', error.error.alert);
        }

        if(error.status === 500) {
            this.alertService.showAlert('error', msg);
        }
    }
}
