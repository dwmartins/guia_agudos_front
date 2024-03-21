import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const validParams: CanActivateFn = async (route, state) => {
    const router = inject(Router);
    
    const params = route.params['id'];

    if(!isNaN(params)){
        return true;
    }
    
    router.navigate(['/']);
    return false;

};