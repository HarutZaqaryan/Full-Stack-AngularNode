import { Routes } from '@angular/router';
import { authGuard } from './Components/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./Components/Posts/post-list/post-list.component').then(
        (m) => m.PostListComponent
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./Components/Posts/post-create/post-create.component').then(
        (m) => m.PostCreateComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'edit/:postID',
    loadComponent: () =>
      import('./Components/Posts/post-create/post-create.component').then(
        (m) => m.PostCreateComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./Components/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./Components/auth/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },
];
