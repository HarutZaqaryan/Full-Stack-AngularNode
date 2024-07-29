import { Injectable } from '@angular/core';
import { IPosts } from '../Models/IPosts';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor() { }

  public posts:IPosts[] = [];
  private postUpdated = new Subject<IPosts[]>() 

  getPosts():IPosts[] {
    return [...this.posts]
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable()
  }

  addPost(post:IPosts):void {
    this.posts.push(post)
    this.postUpdated.next([...this.posts])
  }

}
