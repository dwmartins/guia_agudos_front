import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AlertService } from '../services/componsents/alert.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = async (route, state) => {
    const router = inject(Router);
    const alertService = inject(AlertService);
    const authService = inject(AuthService);
    const userService = inject(UserService);

    const validToken = await authService.logged().toPromise();
    if(validToken) {
        return true;
    }

    router.navigate(['/app']);
    return false
};

export const adminGuard: CanActivateFn = async (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const alertService = inject(AlertService);

    const validUser = await authService.checkAdmin().toPromise();
    if(validUser) {
        return true;
    }

    router.navigate(['/app']);
    return false;
};
