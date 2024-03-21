import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const validParams: CanActivateFn = async (route, state) => {
    const router = inject(Router);
    
    console.log(route.params['id'])
    const params = route.params['id'];
    console.log(!isNaN(params))

    if(!isNaN(params)){
        return true;
    }
    
    router.navigate(['/']);
    return false;

};