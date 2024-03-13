import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DateService {

    constructor() { }

    getDateAsString(date: string) {
        const data = new Date(date);
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = data.toLocaleDateString('pt-BR', options);
        return formattedDate;
    }
}
