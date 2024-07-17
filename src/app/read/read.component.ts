import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { Blog, BlogRes } from '../interface/BlogRes';
import { Observable, Subscription } from 'rxjs';
import { RequestService } from '../services/request.service';
import { CommonModule } from '@angular/common';
import { TopnavComponent } from '../components/topnav/topnav.component';
import { TranslatetagService } from '../services/translatetag.service';

@Component({
  selector: 'app-read',
  standalone: true,
  imports: [QuillModule, CommonModule, TopnavComponent],
  templateUrl: './read.component.html',
  styleUrl: './read.component.css'
})
export class ReadComponent {
 constructor(
  private route: ActivatedRoute,
  private Request: RequestService,
  private translateService: TranslatetagService
) {}

blogData!: Blog
$blogSub!: Subscription
 ngOnInit() {
  this.route.params.subscribe(params => {
    this.$blogSub = this.Request.fetchData<BlogRes>(`blog/${params['id']}`).subscribe({
      next: res => {
        this.blogData = res.data[0]
        console.log(this.blogData)
      },
      error: err => console.error(err)
    })
  })
 }

 ngOnDestroy() {
  this.$blogSub.unsubscribe()
 }

 translate(id: number) {
  return this.translateService.getTagNameById(id)
}

}
