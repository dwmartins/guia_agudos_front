import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-spinner-loading',
    standalone: true,
    imports: [],
    template: `
        <div class="d-flex align-items-center gap-2">
            <div class="spinner-border custom_spinner_btn" [class]="color" role="status"></div>

            @if (text) {
                <span [class]="color">{{ text }}</span>
            }
        </div>
    `,
    styleUrl: './spinner-loading.component.css'
})
export class SpinnerLoadingComponent {
    @Input() color: string = "text-primary";
    @Input() text: string = "";
}
