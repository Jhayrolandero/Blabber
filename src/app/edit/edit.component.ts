import { Component, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Blog, BlogRes } from '../interface/BlogRes';
import { RequestService } from '../services/request.service';
import { ContentextractService } from '../services/contentextract.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { TopnavComponent } from '../components/topnav/topnav.component';
import { TagRes } from '../interface/TagRes';
import { FormdataService } from '../services/formdata.service';
import { TranslatetagService } from '../services/translatetag.service';

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
    private Translate: TranslatetagService,
    private FormData: FormdataService,
    private _fb: FormBuilder,
  ) {
    this.blogForm = this._fb.group({
      blogTitle: new FormControl('', [Validators.required]),
      blogContent: new FormControl(''),
      tagID: this._fb.array([], [Validators.required]),
      public: new FormControl(0, [Validators.required])
    })
  }

  blogForm: FormGroup
  blogData!: Blog
  $blogSub!: Subscription
  blogContent!: string
  tags: number[] = []
  showSelectTag: boolean = false

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.$blogSub = this.Request.fetchData<BlogRes>(`blog/${params['id']}?q=fetchBlog`).subscribe({
        next: res => {
          this.blogData = res.data[0]
          this.blogContent = res.data[0].blogContent

          this.blogForm.patchValue({
            blogTitle: res.data[0].blogTitle,
            blogContent: res.data[0].blogContent,
            public: res.data[0].public ? 1 : 0
          })

          const formArray: FormArray = this.blogForm.get('tagID') as FormArray;

          res.data[0].tags.split(',').forEach(tag => {
            if(tag == null) {
              this.tags.push(12)
            } else {
              this.tags.push(parseInt(tag))
            }
            formArray.push(new FormControl(parseInt(tag)));
          });

          console.log(this.tags)
          console.log(this.blogForm.get('tagID')?.value);
        },
        error: err => console.error(err)
      })
    })
  }

  translate(id: number) {
    return this.Translate.getTagNameById(id)
  }

  selectTag(event: Event) {
    const formArray: FormArray = this.blogForm.get('tagID') as FormArray;
    const selectElement = event.target as HTMLSelectElement;

    if(this.tags.includes(parseInt(selectElement.value))) {
      alert("Duplicate Tag!")
      return
    }

    if(parseInt(selectElement.value) > 12 && Number.isNaN(parseInt(selectElement.value))) {
      alert("Invalid Tag")
      return
    }
    formArray.push(new FormControl(parseInt(selectElement.value)))

    this.tags.push(parseInt(selectElement.value))
    this.showSelectTag = false
    console.log(this.tags)
    console.log(formArray.value)
  }

  removeTag(key: number) {
    const formArray: FormArray = this.blogForm.get('tagID') as FormArray;
    const idx = formArray.value.findIndex((x : number) => x == key)

    if(idx === -1) return

    formArray.removeAt(idx)
    this.tags = this.tags.filter(x => x != key)
    console.log(formArray.value)
  }


  // blogForm = new FormGroup({
  //   blogTitle: new FormControl('', [Validators.required]),
  //   blogContent: new FormControl(''),
  //   tagID: new FormControl(0, [Validators.required]),
  //   public: new FormControl(0, [Validators.required])
  // })

  $tagSub: Observable<TagRes> = this.Request.fetchData<TagRes>("tag")
  text = ""
  router = inject(Router)

  // selectTag(event : Event) {
  //   console.log(event)
  //   const selectElement = event.target as HTMLSelectElement;
  //   console.log(selectElement.value);
  //   this.blogForm.patchValue({
  //     tagID: +selectElement.value
  //   })
  // }

  onPublic(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    console.log(inputElement.checked);
    this.blogForm.patchValue({
      public: inputElement.checked ? 1 : 0
    })
  }
  onEdit() {

    if(!this.blogContent) {
      alert('Content is required!')
      return
    }

    this.blogForm.patchValue({
      blogContent: this.blogContent
    })

    if(!this.blogForm.valid) return
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
