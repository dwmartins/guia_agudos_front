import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageValidationService } from '../../../services/helpers/image-validation.service';
import { Title } from '@angular/platform-browser';
import { ConstantsService } from '../../../services/helpers/constants.service';

@Component({
    selector: 'app-user-edit',
    standalone: true,
    imports: [CommonModule, FooterComponent, ReactiveFormsModule, HttpClientModule, SpinnerLoadingComponent],
    templateUrl: './user-edit.component.html',
    styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit, OnDestroy {
    titleService		= inject(Title);
    constants           = inject(ConstantsService);
    modal 			    = inject(NgbModal);
    authService         = inject(AuthService);
    dateService         = inject(DateService);
    alertService        = inject(AlertService);
    userService         = inject(UserService);
    formBuilder         = inject(FormBuilder);
    validErrorsService  = inject(ValidErrorsService);
    imageService        = inject(ImageValidationService);

    @ViewChild('modalChangePhotoUser', {static: true}) modalChangePhotoUser!: ElementRef;
    @ViewChild('modalDeleteAccount', {static: true}) modalDeleteAccount!: ElementRef;

    icon_password: string = 'fa-eye';
    showPassword: string = 'password';
    icon_NewPassword: string = 'fa-eye';
    showNewPassword: string = 'password';

    formEdit: FormGroup;
    formNewPassword: FormGroup;

    spinnerNewPassword: boolean = false;
    spinnerEdit: boolean = false;
    spinnerChangePhotoUser: boolean = false;
    spinnerDeleteAccount: boolean = false;

    user!: User;

    previewNewPhotoUser: string | null | undefined;
    newPhotoUser!: File;

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
            photo: [''],
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
        this.titleService.setTitle("Editar perfil");
        this.getUserLogged()
    }

    ngOnDestroy(): void {
        this.titleService.setTitle(this.constants.siteTitle);
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
                photo: this.user.photo,
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
                this.authService.updateUserLogged(response);
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

    previewPhotoUser(event: Event) {
        const fileInput = event.target as HTMLInputElement;
        const file = fileInput.files?.[0];

        if(file) {
            if(this.imageService.validImage(file)){
                this.newPhotoUser = file;
                const reader = new FileReader();

                reader.onload = () => {
                    this.previewNewPhotoUser = reader.result?.toString();
                };
                reader.readAsDataURL(file);
            }

            this.modal.open(this.modalChangePhotoUser, {centered: true});
        }
	}

    changePhotoUser() {
        this.spinnerChangePhotoUser = true;
        this.userService.updatePhoto(this.newPhotoUser).subscribe((response) => {
            this.modal.dismissAll(this.modalChangePhotoUser);
            this.spinnerChangePhotoUser = false;
            this.alertService.showAlert('success', 'Foto de perfil atualizada com sucesso.');

            
            this.authService.updateUserLogged(response);
            this.getUserLogged();
        }, (error) => {
            this.modal.dismissAll(this.modalChangePhotoUser);
            this.spinnerChangePhotoUser = false;
            this.validErrorsService.validError(error, "Falha ao atualizar sua foto de perfil.");
        })
    }

    openModalDeleteAccount() {
		this.modal.open(this.modalDeleteAccount, {centered: true});
	}

    deleteAccount() {
        this.spinnerDeleteAccount = true;
        this.userService.deleteUser(this.user.id).subscribe((response) => {
            this.spinnerDeleteAccount = false;
            this.alertService.showAlert('success', 'Conta excluída com sucesso.');
            this.modal.dismissAll(this.modalDeleteAccount);
            this.authService.logout();
        }, (error) => {
            this.spinnerDeleteAccount = false;
            this.validErrorsService.validError(error, "Falha ao excluir a conta");
        })
    }
}
