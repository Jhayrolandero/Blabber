import { Component } from '@angular/core';
import { TopnavComponent } from '../components/topnav/topnav.component';
import { QuillModule } from 'ngx-quill';
import { ReactiveFormsModule, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { FormdataService } from '../services/formdata.service';
import { RequestService } from '../services/request.service';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TagRes } from '../interface/TagRes';
import { Tag } from '../interface/TagRes';
@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, TopnavComponent, QuillModule, FormsModule, ReactiveFormsModule],
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
    blogContent: new FormControl(''),
    tagID: new FormControl(0, [Validators.required])
  })

  $tagSub: Observable<TagRes> = this.Request.fetchData<TagRes>("tag")
  text = ""

  ngOnInit() {
  }

  selectTag(event : Event) {
    const selectElement = event.target as HTMLSelectElement;
    console.log(selectElement.value);
    this.blogForm.patchValue({
      tagID: +selectElement.value
    })
  }
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
