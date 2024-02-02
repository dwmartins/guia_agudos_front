import { Injectable, inject } from '@angular/core';
import { User } from '../models/user';
import { HeaderService } from './header.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	headerService = inject(HeaderService);
	userData: Partial<User> = {};

	constructor() { }

	getUserLogged() {
		const user = localStorage.getItem('userData');
		if(user) {
			this.userData = JSON.parse(user) as User;
			return this.userData;
		}

		return false;
	}

	getUserType() {
		const user = localStorage.getItem('userData');
		if(user) {
			this.userData = JSON.parse(user) as User;
			return this.userData.user_type;
		}

		return false;
	}

	setUserLogged(userData: User) {
		const user = JSON.stringify(userData);
		localStorage.setItem('userData', user);
	}

	logout() {
		localStorage.removeItem('userData');
		this.headerService.update(true);
	}

	checkAdmin() {
		const user = localStorage.getItem('userData');
		if(user) {
			this.userData = JSON.parse(user) as User;

			if(this.userData.user_type === 'admin') {
				return true;
			}
		}

		return false;
	}
}
