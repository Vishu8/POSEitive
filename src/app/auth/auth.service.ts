import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

const BACKEND_URL = environment.apiUrl + '/user/';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getAuthStatusListner() {
    return this.authStatusListener.asObservable();
  }
  createUser(fullname: string, email: string, password: string) {
    const authData: AuthData = { fullname, email, password };
    return this.http.post<{ message: string }>(BACKEND_URL + '/signup', authData).subscribe((response) => {
      this.router.navigate(['/pose-estimation']);
      console.log(response.message);
    }, (error) => {
      this.authStatusListener.next(false);
      console.log(error);
    });
  }
}
