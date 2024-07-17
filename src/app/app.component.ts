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
//   tags = [
// {
//   tagID: 1,
//   tagName: "Education"
// },
// {
//   tagID: 2,
// tagName:'Fashion'
// },
// {
//   tagID:3,
// tagName: 'Education'
// },
// {4
// Fashion
// },
// {5
// Technology
// },
// {6
// Food
// },
// {7
// Sports
// },
// {8
// Meme
// },
// {9
// Travel
// },
// {10
// Movie
// },
// {11
// Fitness
// },
// {12
// Other
// }
//   ]
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
