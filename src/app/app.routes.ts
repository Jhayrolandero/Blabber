import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: "login", loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)},
  {path: "home", loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)},
  {path: "blog", loadComponent: () => import('./blog/blog.component').then(m => m.BlogComponent), canActivate: [authGuard]},
  {path: "read/:id", loadComponent: () => import('./read/read.component').then(m => m.ReadComponent)},
  {path: "edit/:id", loadComponent: () => import('./edit/edit.component').then(m => m.EditComponent), canActivate: [authGuard]},
  {path: "dashboard", loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard]}
];
