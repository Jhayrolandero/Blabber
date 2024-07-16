import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { RegisterFormComponent } from './register-form/register-form.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule, RegisterFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(public dialog: MatDialog){}


  openDialog() {
    this.dialog.open(RegisterFormComponent)
  }
}
