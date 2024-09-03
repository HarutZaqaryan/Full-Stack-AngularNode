import { Injectable } from '@angular/core';
import { IPosts } from '../Models/IPosts';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}

  public posts: IPosts[] = [];
  private postUpdated = new Subject<IPosts[]>();

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post: any) => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
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
    return this.http.get<{_id:string,title:string,content:string}>(`http://localhost:3000/api/posts/` + id)
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(post: IPosts): void {
    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((res) => {
        const id = res.postId;
        post.id = id;
        this.posts.push(post);
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
