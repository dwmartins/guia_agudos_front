import { Injectable, inject } from '@angular/core';
import { User } from '../models/user';
import { HeaderService } from './components/header.service';
import { UserService } from './user.service';
import { AlertService } from './components/alert.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	headerService 	= inject(HeaderService);
	userService 	= inject(UserService);
	alertService 	= inject(AlertService);
	router			= inject(Router);

	userData!: User;

	constructor() { 
		this.getUserLogged();
	}

	getUserLogged(){
		const user = localStorage.getItem('userData');
		if(user) {
			this.userData = JSON.parse(user) as User;

			return this.userData;
		}

		return null;
	}

	setUserLogged(userData: User) {
		const user = JSON.stringify(userData);
		localStorage.setItem('userData', user);
	}

	logout() {
		localStorage.removeItem('userData');
		this.headerService.update(true);
		this.router.navigate(['/']);
	}

	checkAdmin() : Observable<boolean>{
		return new Observable<boolean>((observer) => {

			if(!this.userData) {
				this.alertService.showAlert('info', 'Realize o login para acessar esta área.');
				observer.next(false);
				observer.complete();
			}

			this.userService.validToken(this.userData).subscribe(
				(response) => {
					if (response.success) {
						if(response.userType === "admin") {
							observer.next(true);
							observer.complete();
							return;
						}

						this.alertService.showAlert('info', 'Restrito apenas para administradores.');
						observer.next(false);
						observer.complete();
						
					} else {
						observer.next(false);
						observer.complete();
					}
				},
				(error) => {
					if (error.status === 401) {
						if (error.error.expiredToken) {
							this.alertService.showAlert('info', 'Sua seção expirou, realize o login novamente.');
							this.logout();
						} else if (error.error.invalidToken) {
							this.alertService.showAlert('info', 'Realize o login para acessar esta área.');
							this.logout();
						} else {
							this.alertService.showAlert('error', 'Oops, houve um erro, tente novamente.');
						}
					}
					observer.next(false);
					observer.complete();
				}
			);
		});
	}

	logged() : Observable<boolean>{
		return new Observable<boolean>((observer) => {

			if(!this.userData) {
				this.alertService.showAlert('info', 'Realize o login para acessar esta área.');
				observer.next(false);
				observer.complete();
			}
			
			this.userService.validToken(this.userData).subscribe(
				(response) => {
					if (response.success) {
						observer.next(true);
						observer.complete();
					} else {
						observer.next(false);
						observer.complete();
					}
				},
				(error) => {
					if (error.status === 401) {
						if (error.error.expiredToken) {
							this.alertService.showAlert('info', 'Sua seção expirou, realize o login novamente.');
							this.logout();
						} else if (error.error.invalidToken) {
							this.alertService.showAlert('info', 'Realize o login para acessar esta área.');
							this.logout()
						} else {
							this.alertService.showAlert('error', 'Oops, houve um erro, tente novamente.');
						}
					}
					observer.next(false);
					observer.complete();
				}
			);
		});
	}
}
