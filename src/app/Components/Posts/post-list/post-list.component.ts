import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { IPosts } from '../../../Models/IPosts';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../Services/post.service';
import { Subscription, Subject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    RouterModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent implements OnInit, OnDestroy {
  public posts: IPosts[] = [];
  private postSub!: Subscription;
  public loading: boolean = false;

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

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }
}
