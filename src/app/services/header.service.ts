import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor() { }

  private updateHeader = new BehaviorSubject<boolean>(true);
  updateHeader$ = this.updateHeader.asObservable();

  update(value: boolean) {
    this.updateHeader.next(value);
  }
}
