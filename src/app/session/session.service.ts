import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PoseSessionLog } from '../pose/pose-session.model';

const BACKEND_URL = environment.apiUrl + '/session/';
@Injectable({ providedIn: 'root' })
export class SessionService {
  sessionLogs: PoseSessionLog[];
  constructor(private http: HttpClient) { }
  getSessionLogs(): any {
    return this.http.get<{ message: string, poseSessionLogs: PoseSessionLog[] }>(BACKEND_URL + localStorage.getItem('userId')).subscribe(
      (response) => {
        console.log(response.poseSessionLogs);
        this.sessionLogs = response.poseSessionLogs;
      }
    );
  }
}
