import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill'
import {MatSidenavModule} from '@angular/material/sidenav';
import { TopnavComponent } from '../components/topnav/topnav.component';
import { Observable } from 'rxjs';
import { TagRes } from '../interface/TagRes';
import { RequestService } from '../services/request.service';
import { CommonModule } from '@angular/common';
import { Blog, BlogRes } from '../interface/BlogRes';
import { ContentextractService } from '../services/contentextract.service';
import { Router } from '@angular/router';

interface BlogDisplay {
  sumContent: string
  blogTitle: string
  author: string
  tagID: number
  imgSRC: string
  blogCreated: Date
  blogID: number
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [QuillModule, FormsModule, MatSidenavModule, TopnavComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(
    private Request: RequestService,
    private htmlContent: ContentextractService
  ) {

  }
  // events: string[] = [];
  opened: boolean = true;
  blogDisplay: BlogDisplay[] = []

  router = inject(Router);

  ngOnInit() {
    this.$blogSub.subscribe(res => {
      res.data.map(x => {
        const {textContent, firstImageSrc} =  this.htmlContent.extractContent(x.blogContent)
        const data: BlogDisplay = {
          sumContent: textContent!,
          author: x.authorName,
          tagID: x.tagID,
          blogTitle: x.blogTitle,
          imgSRC: firstImageSrc!,
          blogCreated: x.blogCreatedDate,
          blogID: x.author_blogID
        }
        this.blogDisplay.push(data)
      })
    })
  }

  readBlog(id: number) {
    this.router.navigate(['read/', id])
  }

  $tagSub: Observable<TagRes> = this.Request.fetchData<TagRes>("tag")
  $blogSub: Observable<BlogRes> = this.Request.fetchData<BlogRes>("blog")
}
