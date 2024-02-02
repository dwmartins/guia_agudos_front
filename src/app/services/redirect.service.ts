import { Injectable } from '@angular/core';
import { Redirect } from '../models/Redirect';

@Injectable({
    providedIn: 'root'
})
export class RedirectService {
    redirect: Partial<Redirect> = {};

    constructor() { }

    setData(redirect: Redirect) {
        this.redirect = redirect;
    }

    getData() {
        const data = { ...this.redirect };
        this.clearData();
        return data;
    }

    clearData() {
        this.redirect = {};
    }
}
