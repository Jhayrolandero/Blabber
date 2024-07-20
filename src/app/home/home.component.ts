import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill'
import {MatSidenavModule} from '@angular/material/sidenav';
import { TopnavComponent } from '../components/topnav/topnav.component';
import { identity, Observable, Subscription } from 'rxjs';
import { TagRes } from '../interface/TagRes';
import { RequestService } from '../services/request.service';
import { CommonModule } from '@angular/common';
import { Blog, BlogRes } from '../interface/BlogRes';
import { ContentextractService } from '../services/contentextract.service';
import { Router } from '@angular/router';
import { TranslatetagService } from '../services/translatetag.service';

interface BlogDisplay {
  sumContent: string
  blogTitle: string
  author: string
  tagID: number
  imgSRC: string
  blogCreated: Date
  blogID: number
  tags: number[]
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [QuillModule, FormsModule, MatSidenavModule, TopnavComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(
    private Request: RequestService,
    private htmlContent: ContentextractService,
    private TagConvert: TranslatetagService
  ) {}

  $tagSub: Observable<TagRes> = this.Request.fetchData<TagRes>("tag")
  $blogSub: Observable<BlogRes> = this.Request.fetchData<BlogRes>("blog")
  blogSearch!: Subscription
  opened: boolean = true;
  blogDisplay: BlogDisplay[] = []
  origDisplay: BlogDisplay[] = []
  featureDisplay: BlogDisplay[] = []
  latestDisplay: BlogDisplay[] = []
  tags: number[] = []

  search = new FormGroup({
    searchWord: new FormControl('')
  })

  searchWord: string = ''
  currTag = "All"
  router = inject(Router);

  ngOnInit() {
    this.$blogSub.subscribe(res => this.formatDisplay(res))
  }

  // ngOnDestroy() {
  //   this.blogSearch.unsubscribe()
  // }

  formatDisplay(res: BlogRes) {
    this.blogDisplay = []
    this.origDisplay = []
    this.featureDisplay = []
    res.data.map(x => {
      if(x.public) {

        if(x.tags !== null) {
          console.log(x.tags.split(',').map(x => parseInt(x)))
        }
        console.log(typeof x.tags)
        const {textContent, firstImageSrc} =  this.htmlContent.extractContent(x.blogContent)
        const data: BlogDisplay = {
          sumContent: textContent!,
          author: x.authorName,
          tagID: x.tagID,
          blogTitle: x.blogTitle,
          imgSRC: firstImageSrc!,
          blogCreated: x.blogCreatedDate,
          blogID: x.author_blogID,
          tags: x.tags ? x.tags.split(',').map(x => parseInt(x)) : [0]
        }
        this.blogDisplay.push(data)
        this.origDisplay.push(data)
      }

    })
    this.latestDisplay = this.blogDisplay.sort((a, b) => new Date(b.blogCreated).getTime() - new Date(a.blogCreated).getTime());
    this.featureDisplay = this.getFeatureDisplay(this.blogDisplay, 2)!
  }
  searchFilter() {

    const keyword = this.search.get('searchWord')?.value
    // console.log(keyword)
    this.blogSearch = this.Request.fetchData<BlogRes>(`blog?s=${keyword}`).subscribe(res => {
      this.formatDisplay(res)
      this.searchWord = keyword!
    })
  }

  readBlog(id: number) {
    this.router.navigate(['read/', id])
  }

  translateTag(id: number) {
    return this.TagConvert.getTagNameById(id)
  }

  getFeatureDisplay(source: BlogDisplay[], count: number) {
    console.log(source.length)
    if (source.length <= 0) {
        console.error("Source array does not have enough items.");
        return;
    }

    const data: BlogDisplay[] = []
    console.log(source)
    for (let i = 0; i < count; i++) {
        // Select a random index
        const randomIndex = Math.floor(Math.random() * source.length);
        data.push(source.splice(randomIndex, 1)[0])
    }
    return data;
  }

  filterBlog(event: Event) {

    const selectElement = event.target as HTMLSelectElement;

    const currTag  = parseInt(selectElement.value)
    if(!this.tags.includes(currTag)) {
      this.tags.push(currTag)
    } else {
      const idx = this.tags.findIndex(x => x == currTag)

      if(idx === -1) return

      this.tags.splice(idx, 1)
    }

    if(this.tags.length > 0) {
      this.blogDisplay = this.origDisplay.filter(x => x.tags.some(y => this.tags.includes(y)) );
      this.featureDisplay = this.getFeatureDisplay(this.blogDisplay, 2)!;
      this.latestDisplay = this.origDisplay.filter(x => x.tags.some(y => this.tags.includes(y)));
    } else {
      this.blogDisplay = [...this.origDisplay];
      this.featureDisplay = this.getFeatureDisplay(this.blogDisplay, 2)!;
      this.latestDisplay = [...this.origDisplay];
    }
  }
}
