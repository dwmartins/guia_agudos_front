import { Injectable, inject } from '@angular/core';
import { AlertService } from '../componsents/alert.service';

@Injectable({
    providedIn: 'root'
})
export class ImageValidationService {
    alertService = inject(AlertService);

    validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
    fileSize = 5 * 1024 * 1024; // 5MB

    constructor() { }

    validImage(image: File): boolean {
        if(image.size > this.fileSize) {
            this.alertService.showAlert('info', 'A imagem de perfil deve ter no máximo 5MB.');
            return false;
        }

        if(!this.validExtensions.includes(image.type)) {
            this.alertService.showAlert('info', 'O formato da imagem deve ser (png, jpg ou jpeg)');
            return false;
        }

        return true;
    }
}
