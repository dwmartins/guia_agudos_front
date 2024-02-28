import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { SpinnerService } from '../../../services/components/spinner.service';

@Component({
    selector: 'app-spinner',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div *ngIf="showSpinner" class="spinner-overlay">
            <div class="d-flex flex-column align-items-center">
                <div class="spinner-border text-primary custom_spinner mb-2" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="custom-dark fw-semibold fs-5">{{this.spinnerText}}</p>
            </div>
        </div>`,
    styleUrl: './spinner.component.css'
})
export class SpinnerComponent implements OnInit {
    spinnerService = inject(SpinnerService);

    showSpinner: boolean = false;
    spinnerText: string = '';

    ngOnInit(): void {
        this.spinnerService.spinnerState$.subscribe((state) => {
            this.showSpinner = state.show;
            this.spinnerText = state.text;
        });
    }

}
