import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './services/auth.guard';
import { BlogComponent } from './blog/blog.component';
import { ReadComponent } from './read/read.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditComponent } from './edit/edit.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // {path: "login", loadChildren: () => import('./login/login.component').then(m => m.LoginComponent)}
  {path: "login", component: LoginComponent},
  {path: "home", component: HomeComponent, canActivate: [authGuard]},
  {path: "blog", component: BlogComponent, canActivate: [authGuard]},
  {path: "read/:id", component: ReadComponent, canActivate: [authGuard]},
  {path: "edit/:id", component: EditComponent, canActivate: [authGuard]},
  {path: "dashboard", component: DashboardComponent, canActivate: [authGuard]}
];
