import { Injectable, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
	template: TemplateRef<any>;
	classname?: string;
	delay?: number;
}

@Injectable({
	providedIn: 'root'
})
export class AlertService {
	toasts: Toast[] = [];

	private alert = new Subject<any>();
	alert$ = this.alert.asObservable();

	constructor() { }

	showAlert(type: string, msg: any) {
		this.alert.next({ type, msg });
	}

	show(toast: Toast) {
		this.toasts.push(toast);
	}

	remove(toast: Toast) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
	}
}
