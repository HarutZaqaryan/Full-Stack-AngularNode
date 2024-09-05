import { Injectable } from '@angular/core';
import { IPosts } from '../Models/IPosts';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  public posts: IPosts[] = [];
  private postUpdated = new Subject<IPosts[]>();
  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          console.log(
            'file: post.service.ts:20 -> PostService -> map -> postData:',
            postData
          );
          return postData.posts.map((post: any) => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              image: post.imagePath,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postUpdated.next([...this.posts]);
      });

    return this.posts;
  }

  getPost(id: string) {
    // return { ...this.posts.find((post) => post.id == id) };
    return this.http.get<{ _id: string; title: string; content: string }>(
      `http://localhost:3000/api/posts/` + id
    );
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
      .subscribe((res) => {
        console.log(
          'file: post.service.ts:61 -> PostService -> .subscribe -> res:',
          res
        );

        const createdPost: any = {
          id: res.post.id,
          title: _post.title,
          content: _post.content,
          image: res.post._doc.imagePath,
        };

        const id = res.post.id;
        createdPost.id = id;
        this.posts.push(createdPost);
        this.postUpdated.next([...this.posts]);
      });
  }

  updatePost(id: string, post: IPosts) {
    this.http
      .put(`http://localhost:3000/api/posts/` + id, post)
      .subscribe((res) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    this.http.delete(`http://localhost:3000/api/posts/` + id).subscribe(() => {
      const updatedPosts = this.posts.filter((post) => post.id !== id);
      this.posts = updatedPosts;
      this.postUpdated.next([...this.posts]);
    });
  }
}
