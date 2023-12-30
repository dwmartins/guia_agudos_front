import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-alerts',
	standalone: true,
	imports: [NgbToastModule, CommonModule],
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
export class AlertsComponent implements OnInit, AfterViewInit {
	@Input() type: string = '';
	@Input() icon: string = '';
	@Input() description: string = '';
	icon_color: string = '';

	@ViewChild('alerts') alerts!: ElementRef;

	ngOnInit(): void {
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

	ngAfterViewInit(): void {
		this.alerts.nativeElement.style.display = 'flex';

		setTimeout(() => {
			this.alerts.nativeElement.classList.add('slideOut');
			setTimeout(() => {
				this.alerts.nativeElement.style.display = 'none';
				this.alerts.nativeElement.classList.remove('slideOut');
			}, 300);
		}, 4000);
	}
}
