import { Component } from '@angular/core';
import { MatDialogContent } from '@angular/material/dialog';
import { ReactiveFormsModule, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { FormdataService } from '../../services/formdata.service';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [MatDialogContent, ReactiveFormsModule, FormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {

  constructor(
    private FormDataService: FormdataService,
    private RequestService: RequestService
  ) {}

  registerForm = new FormGroup({
    authorName: new FormControl('',Validators.required),
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })

  submitForm() {
    console.log(this.registerForm.valid)

    const formData = this.FormDataService.formDatanalize(this.registerForm);

    this.RequestService.postData<any>(formData, "register").subscribe({
      next: res => console.log(res),
      error: err => console.error(err)
    })
    console.log(formData)
  }
}
