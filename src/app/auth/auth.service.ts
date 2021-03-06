import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthData, UserData } from './auth-data.model';
import { Subject } from 'rxjs';

const BACKEND_URL = environment.apiUrl + '/user/';
const BACKEND_URL_POSE = environment.apiUrl + '/pose/';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private userId: string;
  private username: string;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }
  getUserId() {
    return this.userId;
  }
  getUserName() {
    return this.username;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(fullname: string, email: string, password: string) {
    const authData: AuthData = { fullname, email, password };
    return this.http.post<{ message: string, userId: string }>(BACKEND_URL + 'signup', authData).subscribe((response) => {
      sessionStorage.setItem('userId', response.userId);
      this.router.navigate(['/pose-estimation']);
      console.log(response.message);
    }, (error) => {
      this.authStatusListener.next(false);
      console.log(error);
    });
  }

  login(email: string, password: string) {
    const userData: UserData = { email, password };
    return this.http.post<{ message: string, token: string, userId: string, username: string }>(BACKEND_URL + 'login', userData)
    .subscribe((response) => {
      this.token = response.token;
      if (this.token) {
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.username = response.username;
        this.authStatusListener.next(true);
        this.saveAuthData(this.token, this.userId, this.username);
        sessionStorage.setItem('userId', this.userId);
        this.http.get<{ message: string, status: number }>(BACKEND_URL_POSE + this.userId).subscribe((responseCheck) => {
          if (responseCheck.status === 201) {
            this.router.navigate(['/home']);
          }
        }, (error) => {
          console.log(error);
        });
      }
      console.log(response.message);
    }, (error) => {
      this.authStatusListener.next(false);
      console.log(error);
    });
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.username = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/']);
    console.log('Logged Out!');
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    this.isAuthenticated = true;
    this.token = authInformation.token;
    this.userId = authInformation.userId;
    this.username = authInformation.username;
    this.authStatusListener.next(true);
    this.router.navigate(['/home']);
  }
  private saveAuthData(token: string, userId: string, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    if (!token) {
      return;
    }
    return {
      token,
      userId,
      username
    };
  }
}
