import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PostCreateComponent } from './Components/Posts/post-create/post-create.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './Components/header/header.component';
import { PostListComponent } from './Components/Posts/post-list/post-list.component';
import { IPosts } from './Models/IPosts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HeaderComponent,
    PostCreateComponent,
    PostListComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public storedPosts: IPosts[] = [];

  onPostAdded(post:IPosts) {
    this.storedPosts.push(post)
  }
}
