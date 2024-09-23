import { Routes } from '@angular/router';
import { PostListComponent } from './Components/Posts/post-list/post-list.component';
import { PostCreateComponent } from './Components/Posts/post-create/post-create.component';
import { LoginComponent } from './Components/auth/login/login.component';
import { SignupComponent } from './Components/auth/signup/signup.component';
import { authGuard } from './Components/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: PostListComponent,
  },
  {
    path: 'create',
    component: PostCreateComponent,
    canActivate: [authGuard],
  },
  {
    path: 'edit/:postID',
    component: PostCreateComponent,
    canActivate: [authGuard],
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
