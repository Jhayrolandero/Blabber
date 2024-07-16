import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './services/auth.guard';
import { BlogComponent } from './blog/blog.component';
export const routes: Routes = [
  // {path: "login", loadChildren: () => import('./login/login.component').then(m => m.LoginComponent)}
  {path: "login", component: LoginComponent},
  {path: "home", component: HomeComponent, canActivate: [authGuard]},
  {path: "blog", component: BlogComponent, canActivate: [authGuard]}
];
