import { Component, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Blog, BlogRes } from '../interface/BlogRes';
import { RequestService } from '../services/request.service';
import { ContentextractService } from '../services/contentextract.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { TopnavComponent } from '../components/topnav/topnav.component';
import { TagRes } from '../interface/TagRes';
import { FormdataService } from '../services/formdata.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, QuillModule, TopnavComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {
  constructor(
    private Request: RequestService,
    private route: ActivatedRoute,
    private FormData: FormdataService
  ) {}


  blogData!: Blog
  $blogSub!: Subscription
  blogContent!: string
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.$blogSub = this.Request.fetchData<BlogRes>(`blog/${params['id']}?q=fetchBlog`).subscribe({
        next: res => {
          console.log(res.data[0].blogContent)
          this.blogData = res.data[0]
          this.blogContent = res.data[0].blogContent

          this.blogForm.patchValue({
            blogTitle: res.data[0].blogTitle,
            blogContent: res.data[0].blogContent,
            tagID: res.data[0].tagID,
            public: res.data[0].public ? 1 : 0
          })
        },
        error: err => console.error(err)
      })
    })
  }

  blogForm = new FormGroup({
    blogTitle: new FormControl('', [Validators.required]),
    blogContent: new FormControl(''),
    tagID: new FormControl(0, [Validators.required]),
    public: new FormControl(0, [Validators.required])
  })

  $tagSub: Observable<TagRes> = this.Request.fetchData<TagRes>("tag")
  text = ""
  router = inject(Router)

  selectTag(event : Event) {
    console.log(event)
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
  onEdit() {
    this.blogForm.patchValue({
      blogContent: this.blogContent
    })

    this.Request.putData(`blog/${this.blogData.blogID}`, this.blogForm).subscribe({
      next: res => {
        console.log(res)
        alert("Saved!")
      },
      error: err => {
        console.error(err)
      alert("Error!")
      }
    })
  }

  onDelete(id: number) {
    this.Request.deleteData(`blog/${id}`).subscribe({
      next: res => {
        this.router.navigate(['dashboard'])
        console.log(res)
      },
      error: err => {
        alert(err)
        console.error(err)
      }
    })
  }

}
