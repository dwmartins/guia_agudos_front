import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { AlertService } from '../../../services/componsents/alert.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-alerts',
	standalone: true,
	imports: [CommonModule, NgbToastModule, NgTemplateOutlet],
	template: `
		@for (toast of alertService.toasts; track toast) {
			<ngb-toast
				[class]="toast.classname"
				[autohide]="true"
				[delay]="toast.delay || 5000"
				(hidden)="alertService.remove(toast)"
			>
				<ng-template [ngTemplateOutlet]="toast.template"></ng-template>
			</ngb-toast>
		}
	`,
	host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200'},
	styleUrl: './alerts.component.css'
})
export class AlertsComponent implements AfterViewInit, OnDestroy {
	alertService 	= inject(AlertService);
	cdr 			= inject(ChangeDetectorRef);

	type: string | null | undefined = '';
	icon: string = '';
	description: string | null | undefined = '';
	icon_color: string = '';

	@ViewChild('alerts') alerts!: ElementRef;

	alert: { type: string; message: string } | null = null;

	ngAfterViewInit(): void {
		// this.getStyles();
	}

	ngOnDestroy(): void {
		this.alertService.clear();
	}

	showStandard(template: TemplateRef<any>) {
		this.alertService.show({ template });
	}

	showSuccess(template: TemplateRef<any>) {
		this.alertService.show({ template, classname: 'bg-success text-light', delay: 10000 });
	}

	showDanger(template: TemplateRef<any>) {
		this.alertService.show({ template, classname: 'bg-danger text-light', delay: 15000 });
	}

	// getStyles() {
	// 	if(this.alert) {
	// 		this.type = this.alert?.type;
	// 		this.description = this.alert?.message;
	
	// 		switch (this.type) {
	// 			case 'alert':
	// 				this.icon_color = '#535e26';
	// 				this.icon = 'bi bi-exclamation-circle';
	// 				break;
	// 			case 'success':
	// 				this.icon_color = '#307c41';
	// 				this.icon = 'bi bi-check2-circle';
	// 				break;
	// 			case 'error':
	// 				this.icon_color = '#ca1313';
	// 				this.icon = 'bi bi-exclamation-triangle-fill';
	// 				break;
	// 		}
	// 	}

	// 	this.openAlert();
	// }

	// openAlert() {
	// 	this.alertService.alerts$.subscribe((alert) => {
	// 		this.type = alert.type;
	// 		this.description = alert.msg;
	// 		console.log(alert)
	// 		console.log(this.type)
	// 		console.log(this.description)
	// 	})

	// 	this.alerts.nativeElement.style.display = 'flex';

	// 	setTimeout(() => {
	// 		this.alerts.nativeElement.classList.add('slideOut');
	// 		setTimeout(() => {
	// 			this.alerts.nativeElement.style.display = 'none';
	// 			this.alerts.nativeElement.classList.remove('slideOut');
	// 			this.alert = null;
	// 		}, 300);
	// 	}, 4000);
	// }
}
