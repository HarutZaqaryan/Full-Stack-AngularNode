import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { IPosts } from '../../../Models/IPosts';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../Services/post.service';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../../Services/auth.service';
@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent implements OnInit, OnDestroy {
  public posts: IPosts[] = [];
  public loading: boolean = false;
  public totalPosts: number = 0;
  public postsPerPage: number = 3;
  public currentPage: number = 1;
  public pageSizeOptions: number[] = [1, 5, 10];
  public userAuthenticated: boolean = false;
  public userId: string;
  private postSub!: Subscription;
  private authSub: Subscription;

  constructor(
    public postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getPosts();
    this.userAuthenticated = this.authService.getIsAuth();
    this.authSub = this.authService
      .getAuthStatus()
      .subscribe((isAuthenticated) => {
        this.userAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    this.userId = this.authService.getUserId();
  }

  getPosts() {
    this.loading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postSub = this.postService
      .getPostUpdateListener()
      .subscribe((postData: { posts: IPosts[]; postCount: number }) => {
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
        this.loading = false;
      });
  }

  deletePost(id: string | null) {
    this.postService.deletePost(id!).subscribe(
      () => {
        this.postService.getPosts(this.postsPerPage, this.currentPage);
      },
      (err) => {
        this.loading=false;
      }
    );
  }

  onChangePage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
    this.authSub.unsubscribe();
  }
}
