import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { AlertService } from '../../../services/alert.service';

@Component({
	selector: 'app-alerts',
	standalone: true,
	imports: [CommonModule],
	template: `
	<div class="alert_content" #alerts>
		<div class="alert" [ngClass]="{ 'alert-info': type === 'alert', 'alert-success': type === 'success', 'alert-error': type === 'error' }">
			<i [class]="icon"></i>
			<div class="description">{{ description }}</div>
		</div>
  	</div>
  `,
	styleUrl: './alerts.component.css'
})
export class AlertsComponent implements AfterViewInit {
	alertService 	= inject(AlertService);
	cdr 			= inject(ChangeDetectorRef);

	type: string | null | undefined = '';
	icon: string = '';
	description: string | null | undefined = '';
	icon_color: string = '';

	@ViewChild('alerts') alerts!: ElementRef;

	alert: { type: string; message: string } | null = null;

	ngAfterViewInit(): void {
		this.getStyles();
	}

	getStyles() {
		if(this.alert) {
			this.type = this.alert?.type;
			this.description = this.alert?.message;
	
			switch (this.type) {
				case 'alert':
					this.icon_color = '#535e26';
					this.icon = 'bi bi-exclamation-circle';
					break;
				case 'success':
					this.icon_color = '#307c41';
					this.icon = 'bi bi-check2-circle';
					break;
				case 'error':
					this.icon_color = '#ca1313';
					this.icon = 'bi bi-exclamation-triangle-fill';
					break;
			}
		}

		this.openAlert();
	}

	openAlert() {
		this.alertService.alerts$.subscribe((alert) => {
			this.type = alert.type;
			this.description = alert.msg;
			console.log(alert)
			console.log(this.type)
			console.log(this.description)
		})

		this.alerts.nativeElement.style.display = 'flex';

		setTimeout(() => {
			this.alerts.nativeElement.classList.add('slideOut');
			setTimeout(() => {
				this.alerts.nativeElement.style.display = 'none';
				this.alerts.nativeElement.classList.remove('slideOut');
				this.alert = null;
			}, 300);
		}, 4000);
	}
}
