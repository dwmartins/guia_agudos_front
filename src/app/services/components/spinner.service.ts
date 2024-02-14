import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinnerSubject = new Subject<{ show: boolean, text: string }>();
  spinnerState$ = this.spinnerSubject.asObservable();
  
  constructor() { }

  show(text: string = '') {
    this.spinnerSubject.next({ show: true, text });
  }

  hide() {
    this.spinnerSubject.next({ show: false, text: '' });
  }
}
