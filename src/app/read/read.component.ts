import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { Blog, BlogRes } from '../interface/BlogRes';
import { catchError, map, Observable, of, Subscription } from 'rxjs';
import { RequestService } from '../services/request.service';
import { CommonModule } from '@angular/common';
import { TopnavComponent } from '../components/topnav/topnav.component';
import { TranslatetagService } from '../services/translatetag.service';
import { BlogDisplay } from '../interface/BlogDisplay';
import { ContentextractService } from '../services/contentextract.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormdataService } from '../services/formdata.service';
import { CommentRes } from '../interface/CommentRes';
import { Comment } from '../interface/CommentRes';
import { AuthService } from '../services/auth.service';
import { PORT } from '../environment/environment';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-read',
  standalone: true,
  imports: [QuillModule, CommonModule, MatMenuModule, TopnavComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './read.component.html',
  styleUrl: './read.component.css'
})

export class ReadComponent {
 constructor(
  private route: ActivatedRoute,
  private Request: RequestService,
  private translateService: TranslatetagService,
  private htmlContent: ContentextractService,
  private router: Router,
  private FormDataService: FormdataService,
  private AuthService: AuthService
) {}

blogDisplay: BlogDisplay[] = []
blogData!: Blog
$blogSub!: Subscription
readMoreSub!: Subscription
tagsArr: number[] = []

PORT = PORT
commentDisplay: Comment[] = []
commentArr: Comment[] = []
// $comment!: Observable<CommentRes>

commentForm = new FormGroup({
  blogID: new FormControl(0, [Validators.required]),
  commentContent: new FormControl('', [Validators.required])
})

 ngOnInit() {
  this.route.params.subscribe(params => {
    this.Request.fetchData<CommentRes>(`comment/${params['id']}`).subscribe({
      next: res=> {
        res.data.map(x => this.commentDisplay.push(x))
      },
      error: err => {
        console.error(err)
        alert(err)
      }
    })
    this.$blogSub = this.Request.fetchData<BlogRes>(`blog/${params['id']}`).subscribe({
      next: res => {
        this.blogData = res.data[0]
        this.tagsArr = res.data[0].tags.split(",").map(x => parseInt(x))
        this.commentForm.patchValue({
          blogID: res.data[0].blogID
        })
      },
      error: err => console.error(err)
    })

    this.readMoreSub = this.Request.fetchData<BlogRes>(`blog?q=read`).subscribe({
      next: res => {
        res.data.map(x => {

          if(x.blogID == params['id']) return
          const {textContent, firstImageSrc} =  this.htmlContent.extractContent(x.blogContent)
          const data: BlogDisplay = {
            sumContent: textContent!,
            author: x.authorName,
            tagID: x.tagID,
            blogTitle: x.blogTitle,
            imgSRC: firstImageSrc!,
            blogCreated: x.blogCreatedDate,
            blogID: x.blogID,
            public: x.public,
            tags: x.tags ? x.tags.split(',').map(x => parseInt(x)) : [0]
          }
          this.blogDisplay.push(data)
        })
      },
      error: err => console.error(err)
    })

  })
 }

 userAuth() {
  return this.AuthService.isAuth()
}

 ngOnDestroy() {
  this.$blogSub.unsubscribe()
 }

 translate(id: number) {
  return this.translateService.getTagNameById(id)
}

readBlog(id: number) {
  this.router.navigate(['read/', id]).then(() => {
    window.location.reload();
  });
}

toLogin(){
  this.AuthService.setRedirectUrl(this.router.url)
  this.router.navigate(['login'])
}
onSubmit() {

  if(!this.commentForm.valid) return

  console.log(this.commentForm.value)
  const Formdata = this.FormDataService.formDatanalize(this.commentForm)
  this.Request.postData<CommentRes>(Formdata, 'comment').subscribe({
    next: res => {
      this.commentArr.push(res.data[0])
      console.log(res)
    },
    error: err => {
      console.error(err)
      alert("Something went wrong!")
    }
  })
}

deleteComment(id: number, display: boolean) {
this.Request.deleteData(`comment/${id}`).subscribe({
  next: res => {
    console.log(res)
    if(display) {
      this.commentDisplay =  this.commentDisplay.filter(x => x.commentID != id)
    } else {
      this.commentArr =  this.commentArr.filter(x => x.commentID != id)
    }
  },
  error: err => {
    console.error(err)
    alert(err)
  }
})
}


}
