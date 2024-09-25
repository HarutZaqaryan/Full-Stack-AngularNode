import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAuthData } from '../Models/IAuthData';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  public authStatusListener = new Subject<boolean>();
  private isAuthenticated: boolean = false;
  private tokenTimer: any;
  private userId: string;

  constructor(private http: HttpClient, private router: Router) {}

  createUser(email: string, password: string) {
    const authData: IAuthData = {
      email,
      password,
    };
    this.http.post('http://localhost:3000/api/user/signup', authData).subscribe(
      (response) => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  loginUser(email: string, password: string) {
    const authData: IAuthData = {
      email,
      password,
    };
    this.http
      .post<{
        message: string;
        token: string;
        expiresIn: number;
        userId: string;
      }>('http://localhost:3000/api/user/login', authData)
      .subscribe(
        (response) => {
          const userId = response.userId;
          const token = response.token;
          this.token = token;
          if (token) {
            this.authStatusListener.next(true);
            this.router.navigate(['/']);
            this.isAuthenticated = true;
            this.userId = response.userId;

            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationDate, this.userId);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    const now = new Date();
    const expiresIn =
      authInformation?.expirationDate!.getTime()! - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation!.token!;
      this.userId = authInformation?.userId!;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = '';
    this.userId = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
  }

  getAuthStatus() {
    return this.authStatusListener.asObservable();
  }

  getToken(): string {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');

    if (!token && !expirationDate) {
      return;
    }

    return {
      userId,
      token,
      expirationDate: new Date(expirationDate!),
    };
  }
}
