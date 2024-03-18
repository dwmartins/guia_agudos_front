import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';
import { DateService } from '../../../services/helpers/date.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AlertService } from '../../../services/components/alert.service';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-user-edit',
    standalone: true,
    imports: [CommonModule, FooterComponent, ReactiveFormsModule, HttpClientModule],
    templateUrl: './user-edit.component.html',
    styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit {
    authService     = inject(AuthService);
    dateService     = inject(DateService);
    alertService    = inject(AlertService);
    userService     = inject(UserService);
    formBuilder     = inject(FormBuilder);

    icon_password: string = 'fa-eye';
    showPassword: string = 'password';
    icon_NewPassword: string = 'fa-eye';
    showNewPassword: string = 'password';

    formEdit: FormGroup;

    user!: User;

    imgDefaultUser: string = '../../../../assets/img/no-image-user.jpg';

    constructor() {
        this.formEdit = this.formBuilder.group({
            name: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            aboutMe: [''],
            address: [''],
            complement: [''],
            country: [''],
            state: [''],
            city: [''],
            cep: [''],
            phone: ['']
        })
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
    
    viePassword(input: string) {
        if(input === "password") {
            this.showPassword = (this.showPassword === "text") ? "password" : (this.showPassword === "password") ? "text" : this.showPassword;
            this.icon_password = (this.icon_password === "fa-eye") ? "fa-eye-slash" : (this.icon_password === "fa-eye-slash") ? "fa-eye" : this.icon_password;
        } else {
            this.showNewPassword = (this.showNewPassword === "text") ? "password" : (this.showNewPassword === "password") ? "text" : this.showNewPassword;
            this.icon_NewPassword = (this.icon_NewPassword === "fa-eye") ? "fa-eye-slash" : (this.icon_NewPassword === "fa-eye-slash") ? "fa-eye" : this.icon_NewPassword; 
        }
    }
}
