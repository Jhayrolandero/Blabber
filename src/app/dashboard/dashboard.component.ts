import { Component, inject } from '@angular/core';
import { TopnavComponent } from '../components/topnav/topnav.component';
import { BlogRes } from '../interface/BlogRes';
import { Observable } from 'rxjs';
import { RequestService } from '../services/request.service';
import { ContentextractService } from '../services/contentextract.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatetagService } from '../services/translatetag.service';
import { ProfileRes } from '../interface/ProfileRes';
import { PORT } from '../environment/environment';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ProfileFormComponent } from './profile-form/profile-form.component';

interface BlogDisplay {
  sumContent: string
  blogTitle: string
  author: string
  tagID: number
  imgSRC: string
  blogCreated: Date
  blogID: number
  public: boolean
  tags: number[]
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TopnavComponent, CommonModule, ProfileFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})



export class DashboardComponent {

  constructor(
    private Request: RequestService,
    private htmlContent: ContentextractService,
    private translateService: TranslatetagService
  ) {}

  readonly dialog = inject(MatDialog);

  PORT = PORT
  router = inject(Router)
  blogDisplay: BlogDisplay[] = []
  $blogSub: Observable<BlogRes> = this.Request.fetchData<BlogRes>("blog?q=author")
  $author: Observable<ProfileRes> = this.Request.fetchData<ProfileRes>("profile")

  openDialog(): void {
    this.dialog.open(ProfileFormComponent);
  }

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
          blogID: x.blogID,
          public: x.public,
          tags: x.tags ? x.tags.split(',').map(x => parseInt(x)) : [0]
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

  translate(id: number) {
    return this.translateService.getTagNameById(id)
  }
}
