import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PostService } from '../../../Services/post.service';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss',
})
export class PostCreateComponent implements OnInit {
  public enteredTitle = '';
  public enteredContent = '';
  public mode: string = 'create';
  private postID: string;
  public post: any;
  public loading: boolean = false;

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postID')) {
        this.mode = 'edit';
        this.postID = paramMap.get('postID')!;
        this.loading = true;
        this.postService.getPost(this.postID).subscribe((postData) => {
          this.loading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
          };
        });
      } else {
        this.mode = 'create';
        this.postID = '';
      }
    });
  }

  public onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const post = {
      id: this.postID ? this.postID : null,
      title: form.value.titleForm,
      content: form.value.contentForm,
    };

    if (this.mode === 'create') {
      this.postService.addPost(post);
    } else {
      this.postService.updatePost(this.postID, post);
    }
    form.resetForm();
  }
}
