import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill'
import {MatSidenavModule} from '@angular/material/sidenav';
import { TopnavComponent } from '../components/topnav/topnav.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [QuillModule, FormsModule, MatSidenavModule, TopnavComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  // events: string[] = [];
  opened: boolean = true;
  htmlSTR = "<h1>World</h1><p>Hello</p>"
  text = ""


  onClick() {
    console.log(this.text)
  }
}
