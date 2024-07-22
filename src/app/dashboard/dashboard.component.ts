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
  MatDialog
} from '@angular/material/dialog';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  imports: [TopnavComponent, CommonModule, ProfileFormComponent, ReactiveFormsModule, FormsModule],
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
  origDisplay: BlogDisplay[] = []
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
        this.origDisplay.push(data)
      })
      this.blogDisplay = this.origDisplay
    })
  }


  filterForm = new FormGroup({
    word: new FormControl('')
  })
  filterSearch(event: Event) {

    event.preventDefault();
    
    this.blogDisplay = [...this.origDisplay]
    
    const word = this.filterForm.get('word')?.value
    
    if (!word) {
      console.log("2")
      this.blogDisplay = [...this.origDisplay]
    } else {
      console.log("1")
      this.blogDisplay = this.blogDisplay.filter(x => x.sumContent.toLowerCase().includes(word.toLowerCase()) || x.blogTitle.toLowerCase().includes(word.toLowerCase()))
    }
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
