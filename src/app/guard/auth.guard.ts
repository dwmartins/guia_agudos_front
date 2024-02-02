import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AlertService } from '../services/componsents/alert.service';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const alertService = inject(AlertService);

    if(authService.getUserLogged()) {
        return true;
    }

    alertService.showAlert('info', 'Faça login na sua conta para acessar esta área.');
    router.navigate(['/app/login']);
    return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const alertService = inject(AlertService);

    if(authService.checkAdmin()) {
        return true;
    }
    
    alertService.showAlert('info', 'Restrito apenas para administradores.');
    router.navigate(['/app']);
    return false;
};
