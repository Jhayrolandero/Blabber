import { Component, inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { RegisterFormComponent } from './register-form/register-form.component';
import { FormdataService } from '../services/formdata.service';
import { RequestService } from '../services/request.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface JWTRes {
  token: string;
  message: string;
  status: number
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule, RegisterFormComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    public dialog: MatDialog,
    private FormDataService: FormdataService,
    private RequestService: RequestService,
    private AuthService: AuthService
  ){}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })

  router = inject(Router);

  home() {
    this.router.navigate(['home'])
  }

  submitForm() {
    console.log(this.loginForm.valid)

    const formData = this.FormDataService.formDatanalize(this.loginForm);

    this.RequestService.postData<JWTRes>(formData, "login").subscribe({
      next: res => {
        if(res.status == 200) {
          let expireDate = new Date();
          expireDate.setTime(expireDate.getTime() + (1440 * 60 * 1000));
          document.cookie = `token=${res.token}; ${expireDate}; path=/`

          this.router.navigate([this.AuthService.getRedirectUrl()])
          this.AuthService.setRedirectUrl('home')
        } else {
          alert(res.message)
        }
      },
      error: err => {

        if(err.status == 401) {
          alert("Invalid Credentials")
        }
      }
    })
    console.log(formData)
  }

  openDialog() {
    this.dialog.open(RegisterFormComponent)
  }
}
