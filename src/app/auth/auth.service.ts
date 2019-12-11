import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthData } from './auth-data.model';

const BACKEND_URL = environment.apiUrl + '/user/';
@Injectable({ providedIn: 'root' })
export class AuthService {
  userId: string;

  constructor(private http: HttpClient, private router: Router) { }

  createUser(fullname: string, email: string, password: string) {
    const authData: AuthData = { fullname, email, password };
    return this.http.post<{ message: string, userId: string }>(BACKEND_URL + '/signup', authData).subscribe((response) => {
      this.userId = response.userId;
      this.router.navigate(['/pose-estimation']);
      console.log(response.message);
    });
  }

  sendUserId() {
    return this.userId;
  }
}
