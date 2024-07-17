import { Component, inject } from '@angular/core';
import { TopnavComponent } from '../components/topnav/topnav.component';
import { BlogRes } from '../interface/BlogRes';
import { Observable } from 'rxjs';
import { RequestService } from '../services/request.service';
import { ContentextractService } from '../services/contentextract.service';
import { CommonModule } from '@angular/common';
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
  selector: 'app-dashboard',
  standalone: true,
  imports: [TopnavComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})



export class DashboardComponent {

  constructor(
    private Request: RequestService,
    private htmlContent: ContentextractService
  ) {}

  router = inject(Router)
  blogDisplay: BlogDisplay[] = []
  $blogSub: Observable<BlogRes> = this.Request.fetchData<BlogRes>("blog?q=author")
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
    this.router.navigate(['edit/', id])
  }

  createBlog() {
    this.router.navigate(['blog'])
  }

}
