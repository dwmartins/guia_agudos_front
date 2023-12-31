import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { RegisterComponent } from './views/register/register.component';
import { ListingCategoryAllComponent } from './views/listing-category-all/listing-category-all.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'nova-conta', component: RegisterComponent},
    {path: 'recuperacao-senha', component: ForgotPasswordComponent},
    {path: 'anuncios/categorias', component: ListingCategoryAllComponent}
];
