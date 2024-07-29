import { Injectable } from '@angular/core';
import { IPosts } from '../Models/IPosts';
import { Subject } from 'rxjs';
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
      .get<{ message: string; posts: IPosts[] }>(
        'http://localhost:3000/api/posts'
      )
      .subscribe((res) => {
        this.posts = res.posts;
        this.postUpdated.next([...this.posts]);
      });

    return this.posts;
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(post: IPosts): void {
    this.http
      .post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe((res) => {
        console.log(res.message);
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
      });
  }
}
