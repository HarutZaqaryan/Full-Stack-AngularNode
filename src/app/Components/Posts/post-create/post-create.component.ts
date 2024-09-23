import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PostService } from '../../../Services/post.service';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { mimeType } from './mime-type.validator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
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
    MatProgressSpinnerModule,
    MatSnackBarModule,
    HttpClientModule
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
  public imagePreview: any;
  public imageLoading: boolean = false;

  @ViewChild('filePicker') filePicker: ElementRef;

  form: FormGroup;

  constructor(
    public postService: PostService,
    public route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: mimeType,
      }),
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
            image: postData.imagePath,
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.image,
          });
        });
      } else {
        this.mode = 'create';
        this.postID = '';
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    console.log(file);

    const reader = new FileReader();
    this.imageLoading = true;
    reader.onload = () => {
      this.imagePreview = reader.result;
      this.imageLoading = false;
    };
    reader.readAsDataURL(file!);
  }

  public onAddPost() {
    if (this.form.invalid) {
      return;
    }
    const post = {
      id: this.postID ? this.postID : null,
      title: this.form.value.title,
      content: this.form.value.content,
      image: this.form.value.image,
    };

    if (this.mode === 'create') {
      this.postService.addPost(post);
    } else {
      this.postService.updatePost(this.postID, post);
    }
    this.form.reset();
    this.form.get('title')?.setErrors(null);
    this.form.get('content')?.setErrors(null);
    this.imagePreview = '';

    this.snackBar.open('Post successfully created', '', {
      duration: 1000,
    });
  }
}
