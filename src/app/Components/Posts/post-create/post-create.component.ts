import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PostService } from '../../../Services/post.service';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
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

  constructor(public postService: PostService, public route: ActivatedRoute,private router:Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postID')) {
        this.mode = 'edit';
        this.postID = paramMap.get('postID')!;
        this.postService.getPost(this.postID).subscribe((postData) => {
          console.log('postdata',postData);
          
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
      this.router.navigate(['/'])
    }
    form.resetForm();
  }
}
