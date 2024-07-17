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
  featureDisplay: BlogDisplay[] = []
  router = inject(Router);

  ngOnInit() {
    this.$blogSub.subscribe(res => {
      res.data.map(x => {
        if(x.public) {
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
        }

      })
      this.getFeatureDisplay(this.blogDisplay, this.featureDisplay, 2)
    })
  }

  readBlog(id: number) {
    this.router.navigate(['read/', id])
  }

  getFeatureDisplay(source: BlogDisplay[], destination: BlogDisplay[], count: number) {
    if (source.length < count) {
        console.error("Source array does not have enough items.");
        return;
    }

    for (let i = 0; i < count; i++) {
        // Select a random index
        const randomIndex = Math.floor(Math.random() * source.length);
        destination.push(source.splice(randomIndex, 1)[0]);
    }
}

  $tagSub: Observable<TagRes> = this.Request.fetchData<TagRes>("tag")
  $blogSub: Observable<BlogRes> = this.Request.fetchData<BlogRes>("blog")
}
