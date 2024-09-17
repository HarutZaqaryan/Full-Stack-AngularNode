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
  private postSub!: Subscription;
  public loading: boolean = false;
  public totalPosts: number = 10;
  public postsPerPage: number = 3;
  public pageSizeOptions: number[] = [1, 5, 10];

  constructor(public postService: PostService) {}

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.postService.getPosts();
    this.loading = true;
    this.postSub = this.postService
      .getPostUpdateListener()
      .subscribe((posts: IPosts[]) => {
        this.posts = posts;
        this.loading = false;
        console.log(posts);
      });
  }

  deletePost(id: string | null) {
    this.postService.deletePost(id!);
  }

  onChangePage(pageDate: PageEvent) {
    console.log(pageDate);
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }
}
