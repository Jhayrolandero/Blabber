import { Component, inject } from '@angular/core';
import { TopnavComponent } from '../components/topnav/topnav.component';
import { QuillModule } from 'ngx-quill';
import { ReactiveFormsModule, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { FormdataService } from '../services/formdata.service';
import { RequestService } from '../services/request.service';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TagRes } from '../interface/TagRes';
import { Tag } from '../interface/TagRes';
import { Router } from '@angular/router';
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
    tagID: new FormControl(1, [Validators.required]),
    public: new FormControl(0, [Validators.required])
  })

  $tagSub: Observable<TagRes> = this.Request.fetchData<TagRes>("tag")
  text = ""
  router = inject(Router)

  modules = {
    imageDropAndPaste: {
      handler: () => console.log('test')
    },
    blotFormatter: {
      overlay: {
        style: {
          border: '1px solid white',
        }
      }
    },
    syntax: true,
    toolbar: [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean'],                                         // remove formatting button

    ['link', 'image', 'video']
  ]
      }

  ngOnInit() {
  }

  selectTag(event : Event) {
    const selectElement = event.target as HTMLSelectElement;
    console.log(selectElement.value);
    this.blogForm.patchValue({
      tagID: +selectElement.value
    })
  }

  onPublic(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    console.log(inputElement.checked);
    this.blogForm.patchValue({
      public: inputElement.checked ? 1 : 0
    })
  }
  onSubmit() {
    this.blogForm.patchValue({
      blogContent:this.text
    })

    if(!this.blogForm.valid) return

    console.log(this.blogForm.value)
    const formData = this.FormData.formDatanalize(this.blogForm)

    this.Request.postData<any>(formData, "blog").subscribe({
      next: res => {
        console.log(res)
        this.router.navigate(['dashboard'])
      },
      error: err => {
        alert(err)
        this.router.navigate(['dashboard'])
      }
    })

  }
}
