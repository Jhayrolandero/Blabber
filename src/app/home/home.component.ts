import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill'
import {MatSidenavModule} from '@angular/material/sidenav';
import { TopnavComponent } from '../components/topnav/topnav.component';
import { Observable, Subscription } from 'rxjs';
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
  ) {
  }

  page = 1
  morePage = true
  // Tag
  $tagSub: Observable<TagRes> = this.Request.fetchData<TagRes>("tag")

  // Home
  $blogSub: Observable<BlogRes> = this.Request.fetchData<BlogRes>(`blog?p=${this.page}`)

  // Read
  $read: Observable<BlogRes> = this.Request.fetchData<BlogRes>("blog?q=read")
  readSub!: Subscription
  blogSearch!: Subscription
  opened: boolean = true;
  blogDisplay: BlogDisplay[] = []
  origDisplay: BlogDisplay[] = []
  featureDisplay: BlogDisplay[] = []
  latestDisplay: BlogDisplay[] = []
  readDisplay: BlogDisplay[] = []
  tags: number[] = []

  search = new FormGroup({
    searchWord: new FormControl('')
  })

  searchRes: BlogDisplay[] = []
  origSearch: BlogDisplay[] = []
  searchWord: string = ''
  currTag = "All"
  router = inject(Router);

  ngOnInit() {
    this.$blogSub.subscribe(res => this.formatDisplay(res, false, false))
  }

  readMore() {
    this.Request.fetchData<BlogRes>(`blog?p=${++this.page}`).subscribe({
      next: res => {

        if(res.data.length <= 0) {
          this.morePage = false
          return
        }
        res.data.map(x => {
          if(x.public) {
            const data = this.formatBlog(x);

            this.blogDisplay.push(data)
            this.origDisplay.push(data)
          }
        })

        if(this.tags.length > 0) {
          this.blogDisplay = this.origDisplay.filter(x => x.tags.some(y => this.tags.includes(y)) )
        }

      }
    })
  }

  formatBlog(blog: Blog): BlogDisplay {

    const {textContent, firstImageSrc} =  this.htmlContent.extractContent(blog.blogContent)
    return {
      sumContent: textContent!,
      author: blog.authorName,
      tagID: blog.tagID,
      blogTitle: blog.blogTitle,
      imgSRC: firstImageSrc!,
      blogCreated: blog.blogCreatedDate,
      blogID: blog.blogID,
      tags: blog.tags ? blog.tags.split(',').map(x => parseInt(x)) : [0]
    }
  }

  formatDisplay(res: BlogRes, readMore: boolean, search: boolean) {

    if(readMore) {
      this.readDisplay = []
    } else if (search){
      this.searchRes = []
      this.origSearch = []
    } else {
      this.blogDisplay = []
      this.origDisplay = []
      this.featureDisplay = []
    }

    res.data.map(x => {
      if(x.public) {

        const data = this.formatBlog(x);

        if(!readMore) {
          this.blogDisplay.push(data)
          this.origDisplay.push(data)
        }

        if(readMore) {
          this.readDisplay.push(data)
        }

        if(search) {
          this.searchRes.push(data)
          this.origSearch.push(data)
        }
      }

    })
    if(!readMore) {
      this.latestDisplay = this.blogDisplay.sort((a, b) => new Date(b.blogCreated).getTime() - new Date(a.blogCreated).getTime());
      this.featureDisplay = this.getFeatureDisplay(this.blogDisplay, 2)!
    }
  }
  searchFilter() {

    const keyword = this.search.get('searchWord')?.value
    this.readSub = this.$read.subscribe(res => this.formatDisplay(res, true, false))
    this.blogSearch = this.Request.fetchData<BlogRes>(`blog?s=${keyword}`).subscribe(res => {
      this.formatDisplay(res, false, true)
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
    if (source.length <= 0) {
        console.error("Source array does not have enough items.");
        return;
    }

    const data: BlogDisplay[] = []
    let item = count
    if(count > source.length) {
      item = source.length
    }

    for (let i = 0; i < item; i++) {
        // Select a random index
        const randomIndex = Math.floor(Math.random() * source.length);
        data.push(source.splice(randomIndex, 1)[0])
    }
    return data;
  }

  filterBlog(currTag: number) {
    // currTag  = parseInt(selectElement.value)
    if(!this.tags.includes(currTag)) {
      this.tags.push(currTag)
    } else {
      const idx = this.tags.findIndex(x => x == currTag)

      if(idx === -1) return

      this.tags.splice(idx, 1)
    }

    if(this.searchWord) {
      if(this.tags.length > 0) {
        this.searchRes = this.origSearch.filter(x => x.tags.some(y => this.tags.includes(y)) )
      } else {
        this.searchRes = [...this.origSearch]
      }
    } else {
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

  filterBlogEvent(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const currTag  = parseInt(selectElement.value)
    this.filterBlog(currTag);
  }
}
