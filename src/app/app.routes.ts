import { Routes } from '@angular/router';
import { PostListComponent } from './Components/Posts/post-list/post-list.component';
import { PostCreateComponent } from './Components/Posts/post-create/post-create.component';
import { LoginComponent } from './Components/auth/login/login.component';
import { SignupComponent } from './Components/auth/signup/signup.component';

export const routes: Routes = [
  {
    path: '',
    component: PostListComponent,
  },
  {
    path: 'create',
    component: PostCreateComponent,
  },
  {
    path: 'edit/:postID',
    component: PostCreateComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
];
