import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { IPosts } from '../../../Models/IPosts';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../Services/post.service';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule,MatExpansionModule,MatButtonModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent implements OnInit,OnDestroy {
  // public posts: IPosts[] = [
  //   {
  //     id: 1,
  //     title: 'First post',
  //     content: 'This is the actual content of the First post',
  //   },
  //   {
  //     id: 2,
  //     title: 'Second post',
  //     content: 'This is the actual content of the Second post',
  //   },
  //   {
  //     id: 3,
  //     title: 'Third post',
  //     content: 'This is the actual content of the Third post',
  //   },
  // ];

  public posts:IPosts[] = [];
  private postSub!:Subscription;

  constructor(public postService:PostService){}


  ngOnInit(): void {
      this.posts = this.postService.getPosts();
     this.postSub = this.postService.getPostUpdateListener().subscribe((posts:IPosts[]) => {
        this.posts = posts;
      })
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe()
  }

}
