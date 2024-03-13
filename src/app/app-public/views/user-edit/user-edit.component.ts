import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';
import { DateService } from '../../../services/helpers/date.service';

@Component({
    selector: 'app-user-edit',
    standalone: true,
    imports: [CommonModule, FooterComponent],
    templateUrl: './user-edit.component.html',
    styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit {
    authService = inject(AuthService);
    dateService = inject(DateService);

    user!: User;

    imgDefaultUser: string = '../../../../assets/img/no-image-user.jpg';

    constructor() {

    }

    ngOnInit(): void {
        this.getUserLogged()
    }

    getUserLogged() {
        const user = this.authService.getUserLogged();
        if (user) {
            this.user = user;
        }
    }
}
