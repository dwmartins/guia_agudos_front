import { Routes } from '@angular/router';
import { HomeComponent } from './app-public/views/home/home.component';
import { LoginComponent } from './app-public/views/login/login.component';
import { RegisterComponent } from './app-public/views/register/register.component';
import { ForgotPasswordComponent } from './app-public/views/forgot-password/forgot-password.component';
import { ListingsComponent } from './app-public/views/listings/listings.component';
import { ListingCategoryAllComponent } from './app-public/views/listing-category-all/listing-category-all.component';
import { ListingNewComponent } from './app-public/views/listing-new/listing-new.component';
import { ListingInfoComponent } from './app-public/views/listing-info/listing-info.component';
import { PlansComponent } from './app-public/views/listing-plans/plans.component';
import { AppPublicComponent } from './app-public/app-public.component';
import { AppAdminComponent } from './app-admin/app-admin.component';
import { DashboardComponent } from './app-admin/views/dashboard/dashboard.component';
import { adminGuard, authGuard } from './guard/auth.guard';
import { UserProfileComponent } from './app-public/views/user-profile/user-profile.component';
import { UserEditComponent } from './app-public/views/user-edit/user-edit.component';
import { ListingEditComponent } from './app-public/views/listing-edit/listing-edit.component';
import { validParams } from './guard/validUrl.guard';

export const routes: Routes = [
    // Rotas do site publicas!! **Usar canActivate: [authGuard] em rotas que precis de auth**
    {path: '', component: AppPublicComponent,
        children: [
            {path: '', component: HomeComponent},
            {path: 'login', component: LoginComponent},
            {path: 'nova-conta', component: RegisterComponent},
            {path: 'recuperacao-senha', component: ForgotPasswordComponent},
            {path: 'anuncios', component: ListingsComponent},
            {path: 'anuncios/categorias', component: ListingCategoryAllComponent},
            {path: 'anuncio/novo/:planId', component: ListingNewComponent, canActivate: [authGuard]},
            {path: 'anuncio/editar/:id', component: ListingEditComponent, canActivate: [authGuard]},
            {path: 'anuncio/:id', component: ListingInfoComponent, canActivate: [validParams]},
            {path: 'planos', component: PlansComponent},
            {path: 'perfil', component: UserProfileComponent, canActivate: [authGuard]},
            {path: 'perfil/editar', component: UserEditComponent, canActivate: [authGuard]}
        ]
    },
    // Rotas apenas para admin
    {path: 'admin', component: AppAdminComponent , canActivate: [adminGuard],
        children: [
            {path: '', component: DashboardComponent}
        ]
    },
    // Rotas default
    {path: '', redirectTo: '', pathMatch: 'full'},
    {path: '**', redirectTo: ''}
];
