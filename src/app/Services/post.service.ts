import { Injectable } from '@angular/core';
import { IPosts } from '../Models/IPosts';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  public posts: IPosts[] = [];
  private postUpdated = new Subject<{ posts: IPosts[]; postCount: number }>();
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post: any) => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                image: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts,
        });
      });

    return this.posts;
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(`http://localhost:3000/api/posts/` + id);
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(_post: IPosts): void {
    const postData = new FormData();
    postData.append('title', _post.title);
    postData.append('content', _post.content);
    postData.append('image', _post.image!, _post.title);

    this.http
      .post<{ message: string; post: any }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((res) => {});
  }

  updatePost(id: string, post: IPosts) {
    let postData;

    if (typeof post.image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('image', post.image, post.title);
    } else {
      postData = {
        id: post.id,
        title: post.title,
        content: post.title,
        imagePath: post.image,
        creator: '',
      };
    }
    this.http
      .put(`http://localhost:3000/api/posts/` + id, postData)
      .subscribe((res: any) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    return this.http.delete(`http://localhost:3000/api/posts/` + id);
  }
}
