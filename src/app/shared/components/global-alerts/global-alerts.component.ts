import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { AlertService } from '../../../services/componsents/alert.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertsComponent } from '../alerts/alerts.component';

@Component({
    selector: 'app-global-alerts',
    standalone: true,
    imports: [NgbTooltipModule, AlertsComponent],
    templateUrl: './global-alerts.component.html',
})
export class GlobalAlertsComponent implements OnInit{
    alertService = inject(AlertService);
    
    @ViewChild('infoTpl') infoTpl!: TemplateRef<any>;
    @ViewChild('successTpl') successTpl!: TemplateRef<any>;
    @ViewChild('dangerTpl') dangerTpl!: TemplateRef<any>;
    
    alertMsg: string = 'dddd';
    alert: { type: string; message: string } | null = null;

    ngOnInit(): void {
        this.alertService.alert$.subscribe((alert) => {
            this.showAlert(alert.type, alert.msg);
        });
    }

    showAlert(type: string, msg: string) {
        this.alertMsg = msg;

        switch (type) {
			case 'info':
				this.showInfo();
				break;
			case 'success':
				this.showSuccess();
				break;
			case 'error':
				this.showDanger();
				break;
		}
    }

    showInfo() {
        const template = this.infoTpl;
        this.alertService.show({ template, classname: 'bg-warning text-light', delay: 3500 });
    }

    showSuccess() {
        const template = this.successTpl;
        this.alertService.show({ template, classname: 'bg-success text-light', delay: 3500 });
    }

    showDanger() {
        const template = this.dangerTpl;
        this.alertService.show({ template, classname: 'bg-danger text-light', delay: 3500 });
    }

    ngOnDestroy(): void {
        this.alertService.clear();
    }
}
