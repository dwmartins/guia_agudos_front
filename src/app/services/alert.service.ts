import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  private alerts = new Subject<any>();
  alerts$ = this.alerts.asObservable();

  showAlert(type: string, msg: string) {
    this.alerts.next({ type, msg });
  }
}
