import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss',
})
export class PostCreateComponent implements OnInit {
  public enteredTitle = '';
  public enteredContent = '';
  public mode: string = 'create';
  public post: any;
  public loading: boolean = false;
  private postID: string;

  form: FormGroup;

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
    });

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
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
          });
        });
      } else {
        this.mode = 'create';
        this.postID = '';
      }
    });
  }

  public onAddPost() {
    if (this.form.invalid) {
      return;
    }
    const post = {
      id: this.postID ? this.postID : null,
      title: this.form.value.title,
      content: this.form.value.content,
    };

    if (this.mode === 'create') {
      this.postService.addPost(post);
    } else {
      this.postService.updatePost(this.postID, post);
    }
    this.form.reset();
    this.form.get('title')?.setErrors(null);
    this.form.get('content')?.setErrors(null);
  }
}
