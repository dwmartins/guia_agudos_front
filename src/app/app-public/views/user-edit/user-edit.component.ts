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
import { ValidErrorsService } from '../../../services/helpers/valid-errors.service';
import { SpinnerLoadingComponent } from '../../../shared/components/spinner-loading/spinner-loading.component';

@Component({
    selector: 'app-user-edit',
    standalone: true,
    imports: [CommonModule, FooterComponent, ReactiveFormsModule, HttpClientModule, SpinnerLoadingComponent],
    templateUrl: './user-edit.component.html',
    styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit {
    authService         = inject(AuthService);
    dateService         = inject(DateService);
    alertService        = inject(AlertService);
    userService         = inject(UserService);
    formBuilder         = inject(FormBuilder);
    validErrorsService  = inject(ValidErrorsService);

    icon_password: string = 'fa-eye';
    showPassword: string = 'password';
    icon_NewPassword: string = 'fa-eye';
    showNewPassword: string = 'password';

    formEdit: FormGroup;
    formNewPassword: FormGroup;

    spinnerNewPassword: boolean = false;
    spinnerEdit: boolean = false;

    user!: User;

    imgDefaultUser: string = '../../../../assets/img/no-image-user.jpg';

    constructor() {
        this.formEdit = this.formBuilder.group({
            id: [],
            name: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            active: [''],
            token: [''],
            user_type: [''],
            photo_url: [''],
            aboutMe: [''],
            address: [''],
            complement: [''],
            country: [''],
            state: [''],
            city: [''],
            cep: [''],
            phone: ['']
        });

        this.formNewPassword = this.formBuilder.group({
            password: ['', Validators.required],
            newPassword: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.getUserLogged()
    }

    getUserLogged() {
        const user = this.authService.getUserLogged();
        if (user) {
            this.user = user;

            this.formEdit.patchValue({
                id: this.user.id,
                name: this.user.name,
                lastName: this.user.lastName,
                email: this.user.email,
                active: this.user.active,
                token: this.user.token,
                user_type: this.user.user_type,
                photo_url: this.user.photo_url,
                aboutMe: this.user.aboutMe,
                address: this.user.address,
                complement: this.user.complement,
                country: this.user.country,
                state: this.user.state,
                city: this.user.city,
                cep: this.user.cep,
                phone: this.user.phone
            });
        }
    }

    submitFormEdit() {
        if(this.formEdit.valid) {
            this.spinnerEdit = true;

            this.userService.updateUser(this.formEdit.value).subscribe((response) => {
                this.spinnerEdit = false;
                this.authService.updateUserLogged(this.formEdit.value);
                this.getUserLogged();
                this.alertService.showAlert("success", "Usuário atualizado com sucesso.");
            }, (error) => {
                this.spinnerEdit = false;
                this.validErrorsService.validError(error, "Falha ao atualizar o usuário.");
            });
        } else {
            this.formEdit.markAllAsTouched();
        }
    }

    submitFormNewPassword() {
        if(this.formNewPassword.valid) {
            this.spinnerNewPassword = true;
            this.userService.updatePassword(this.formNewPassword.value).subscribe((response) => {
                this.formNewPassword.reset();
                this.spinnerNewPassword = false;
                this.alertService.showAlert("success", response.success);
            }, (error) => {
                this.spinnerNewPassword = false;
                this.validErrorsService.validError(error, "Falha ao atualizar a senha.");
            });
        } else {
            this.formNewPassword.markAllAsTouched();
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
