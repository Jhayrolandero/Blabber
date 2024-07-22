import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { RequestService } from '../../services/request.service';
import { FormdataService } from '../../services/formdata.service';
interface Image {
  profilePath: string;
  src: string
}

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CommonModule
  ],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.css'
})
export class ProfileFormComponent {

  constructor(
    private Request: RequestService,
    private FormDataSer: FormdataService
  ) {}
  // Change this
  ORIGIN = 'BlabberAPI'
  profiles: Image[] = [
    {
    profilePath: `/${this.ORIGIN}/API/../Assets/profile/1.png`,
    src: "../../../assets/profile/1.png"
  },
  {
    profilePath: `/${this.ORIGIN}/API/../Assets/profile/2.png`,
    src: "../../../assets/profile/2.png"
  }
]

profileForm = new FormGroup({
  authorImg: new FormControl('')
})

readonly dialogRef = inject(MatDialogRef<ProfileFormComponent>);


  onNoClick(): void {
    this.dialogRef.close();
  }


edit(src: string) {

  this.profileForm.patchValue({
    authorImg: src
  })

  const formdata = this.FormDataSer.formDatanalize(this.profileForm)
  this.Request.postData(formdata, 'profile').subscribe({
    next: res => {
      console.log(res)
      this.dialogRef.close();
      window.location.reload()
    },
    error: err => {
      console.error(err)
      alert('Something went wrong!')
    }
  })
}
}
