import { Component, inject } from '@angular/core';
import { TopnavComponent } from '../components/topnav/topnav.component';
import { QuillModule } from 'ngx-quill';
import { ReactiveFormsModule, FormControl, FormGroup, FormsModule, Validators, FormBuilder, FormArray } from '@angular/forms';
import { FormdataService } from '../services/formdata.service';
import { RequestService } from '../services/request.service';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TagRes } from '../interface/TagRes';
import { Tag } from '../interface/TagRes';
import { Router } from '@angular/router';
import { TranslatetagService } from '../services/translatetag.service';
@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, TopnavComponent, QuillModule, FormsModule, ReactiveFormsModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {

  blogForm: FormGroup;
  blogFormData: FormData;
  tags: string[] = []
  showSelectTag: boolean = false
  constructor(
    private FormDataService: FormdataService,
    private Request: RequestService,
    private _fb: FormBuilder,
    private Translate: TranslatetagService
  ) {

    this.blogForm = this._fb.group({
      blogTitle: new FormControl('', [Validators.required]),
      blogContent: new FormControl(''),
      tagID: this._fb.array([], [Validators.required]),
      public: new FormControl(0, [Validators.required])
    })

    this.blogFormData = new FormData()
  }

  $tagSub: Observable<TagRes> = this.Request.fetchData<TagRes>("tag")
  text = ""
  router = inject(Router)

  selectTag(event: Event) {
    const formArray: FormArray = this.blogForm.get('tagID') as FormArray;
    const selectElement = event.target as HTMLSelectElement;

    if(this.tags.includes(selectElement.value)) {
      alert("Duplicate Tag!")
      return
    }
    formArray.push(new FormControl(selectElement.value))

    this.tags = formArray.value
    this.showSelectTag = false
    console.log(formArray.value)
  }

  removeTag(key: string) {
    const formArray: FormArray = this.blogForm.get('tagID') as FormArray;
    const idx = formArray.value.findIndex((x : string) => x === key)

    if(idx === -1) return

    formArray.removeAt(idx)
    this.tags = this.tags.filter(x => x !== key)
    console.log(formArray.value)
  }

  translate(id: string) {
    return this.Translate.getTagNameById(parseInt(id))
  }

  onSubmit() {
    if(!this.text) {
      alert('Content is required!')
      return
    }

    this.blogForm.patchValue({
      blogContent:this.text
    })

    console.log(this.blogForm.get('tagID')?.errors)

// console.log(this.blogForm.valid)
    if(!this.blogForm.valid) return
    const formArray: FormArray = this.blogForm.get('tagID') as FormArray;
    this.blogFormData = this.FormDataService.formDatanalize(this.blogForm);
    formArray.value.forEach((val: any) => {
      this.blogFormData.append("tagID[]", val)
    })

    this.Request.postData<any>(this.blogFormData, 'blog').subscribe({
      next: res => {
        alert("Published successfully!")
        this.router.navigate(['dashboard'])
      },
      error: err => {
        console.error(err)
        alert(err)
      }
    });
  }

  onPublic(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    console.log(inputElement.checked);
    this.blogForm.patchValue({
      public: inputElement.checked ? 1 : 0
    })
  }
}
