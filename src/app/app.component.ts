import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PostCreateComponent } from './Components/Posts/post-create/post-create.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './Components/header/header.component';
import { PostListComponent } from './Components/Posts/post-list/post-list.component';
import { AuthService } from './Services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HeaderComponent,
    PostCreateComponent,
    PostListComponent,
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.autoAuthUser()
  }
}
