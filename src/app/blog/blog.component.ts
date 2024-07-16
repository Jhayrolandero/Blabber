import { Component } from '@angular/core';
import { TopnavComponent } from '../components/topnav/topnav.component';
import { QuillModule } from 'ngx-quill';
import { ReactiveFormsModule, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { FormdataService } from '../services/formdata.service';
import { RequestService } from '../services/request.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [TopnavComponent, QuillModule, FormsModule, ReactiveFormsModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {

  constructor(
    private FormData: FormdataService,
    private Request: RequestService
  ) {}
  blogForm = new FormGroup({
    blogTitle: new FormControl('', [Validators.required]),
    blogContent: new FormControl('')
  })

  text = ""

  onSubmit() {
    this.blogForm.patchValue({
      blogContent:this.text
    })

    console.log(this.blogForm.value)
    const formData = this.FormData.formDatanalize(this.blogForm)

    this.Request.postData<any>(formData, "blog").subscribe({
      next: res => {
        console.log(res)
      },
      error: err => console.error(err)
    })

  }
}
