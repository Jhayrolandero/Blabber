import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill'
import {MatSidenavModule} from '@angular/material/sidenav';
import { TopnavComponent } from '../components/topnav/topnav.component';
import { Observable } from 'rxjs';
import { TagRes } from '../interface/TagRes';
import { RequestService } from '../services/request.service';
import { CommonModule } from '@angular/common';
import { BlogRes } from '../interface/BlogRes';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [QuillModule, FormsModule, MatSidenavModule, TopnavComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private Request: RequestService) {}
  // events: string[] = [];
  opened: boolean = true;

  $tagSub: Observable<TagRes> = this.Request.fetchData<TagRes>("tag")
  $blogSub: Observable<BlogRes> = this.Request.fetchData<BlogRes>("blog")
}
