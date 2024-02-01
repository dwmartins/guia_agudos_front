import { Routes } from '@angular/router';
import { HomeComponent } from './app-public/views/home/home.component';
import { LoginComponent } from './app-public/views/login/login.component';
import { RegisterComponent } from './app-public/views/register/register.component';
import { ForgotPasswordComponent } from './app-public/views/forgot-password/forgot-password.component';
import { ListingsComponent } from './app-public/views/listings/listings.component';
import { ListingCategoryAllComponent } from './app-public/views/listing-category-all/listing-category-all.component';
import { ListingNewComponent } from './app-public/views/listing-new/listing-new.component';
import { ListingInfoComponent } from './app-public/views/listing-info/listing-info.component';
import { PlansComponent } from './app-public/views/plans/plans.component';
import { AppPublicComponent } from './app-public/app-public.component';
import { AppAdminComponent } from './app-admin/app-admin.component';
import { DashboardComponent } from './app-admin/views/dashboard/dashboard.component';

export const routes: Routes = [
    // Rotas do site publicas!!
    {path: 'app', component: AppPublicComponent,
        children: [
            {path: '', component: HomeComponent},
            {path: 'login', component: LoginComponent},
            {path: 'nova-conta', component: RegisterComponent},
            {path: 'recuperacao-senha', component: ForgotPasswordComponent},
            {path: 'anuncios', component: ListingsComponent},
            {path: 'anuncios/categorias', component: ListingCategoryAllComponent},
            {path: 'anuncios/novo', component: ListingNewComponent},
            {path: 'anuncios/:id', component: ListingInfoComponent},
            {path: 'planos', component: PlansComponent},
        ]
    },
    // Rotas apenas para admin
    {path: 'admin', component: AppAdminComponent,
        children: [
            {path: '', component: DashboardComponent}
        ]
    },
    // Rotas default
    {path: '', redirectTo: 'app', pathMatch: 'full'},
    {path: '**', redirectTo: 'app'}
];
