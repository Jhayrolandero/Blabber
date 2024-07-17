import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-topnav',
  standalone: true,
  imports: [MatMenuModule],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.css'
})
export class TopnavComponent {

  constructor(private AuthService: AuthService) {}
  router = inject(Router)

  home() {
    this.router.navigate(['home'])
  }

  dashboard() {
    this.router.navigate(['dashboard'])
  }

  logout() {
    this.AuthService.flushToken()
    this.router.navigate(['/'])
  }
}
