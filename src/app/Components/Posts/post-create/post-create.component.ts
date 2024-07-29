import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { IPosts } from '../../../Models/IPosts';
import { PostService } from '../../../Services/post.service';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatCardModule, MatButtonModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss',
})
export class PostCreateComponent {
  public enteredTitle = '';
  public enteredContent = '';

  constructor(public postService:PostService){}


  public onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const post = {
      id:null,
      title: form.value.titleForm,
      content: form.value.contentForm,
    };

    this.postService.addPost(post)
    form.resetForm()
  }
}
