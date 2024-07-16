import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'blog_site';
  // tags = [
  //   {
  //     id: 1,
  //     title: "Food"
  //   },
  //   {
  //     id: 2,
  //     title: "Fashion"
  //   },
  //   {
  //     id: 3,
  //     title:
  //   }
  //   "Fashion", "Music", "Technology", "Health", "Travel", "Other", "Science"]
}
