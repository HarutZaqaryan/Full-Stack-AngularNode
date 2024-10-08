import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
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
import { Subscription } from 'rxjs';
import { AuthService } from '../../../Services/auth.service';
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
    HttpClientModule,
  ],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss',
})
export class PostCreateComponent implements OnInit, OnDestroy {
  public enteredTitle = '';
  public enteredContent = '';
  public mode: string = 'create';
  public post: any;
  public loading: boolean = false;
  public imagePreview: any;
  public imageLoading: boolean = false;
  private postID: string;
  private authStatusSub: Subscription;

  @ViewChild('filePicker') filePicker: ElementRef;

  form: FormGroup;

  constructor(
    public postService: PostService,
    public route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.authStatusListener.subscribe(
      (authStatus) => {
        this.loading = false;
      }
    );

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
            creator: postData.creator,
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
      this.snackBar.open('Post successfully created', '', {
        duration: 1000,
      });
    } else {
      this.postService.updatePost(this.postID, post);
      this.snackBar.open('Post successfully updated', '', {
        duration: 1000,
      });
    }
    this.form.reset();
    this.form.get('title')?.setErrors(null);
    this.form.get('content')?.setErrors(null);
    this.imagePreview = '';
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
