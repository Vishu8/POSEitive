import { Injectable } from '@angular/core';
import { PoseData } from './pose-data.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PoseSession } from './pose-session.model';

const BACKEND_URL = environment.apiUrl + '/pose';
const SESSION_URL = environment.apiUrl + '/pose/session';
@Injectable({ providedIn: 'root' })
export class PoseService {
  constructor(private http: HttpClient) { }

  addPose(
    nosexValue: number,
    noseyValue: number,
    leftEyexValue: number,
    leftEyeyValue: number,
    rightEyexValue: number,
    rightEyeyValue: number,
    leftShoulderxValue: number,
    leftShoulderyValue: number,
    rightShoulderxValue: number,
    rightShoulderyValue: number,
  ) {
    const poseData: PoseData = {
      userId: sessionStorage.getItem('userId'),
      nosexValue,
      noseyValue,
      leftEyexValue,
      leftEyeyValue,
      rightEyexValue,
      rightEyeyValue,
      leftShoulderxValue,
      leftShoulderyValue,
      rightShoulderxValue,
      rightShoulderyValue,
    };
    return this.http.post<{ message: string }>(BACKEND_URL, poseData).subscribe((response) => {
      window.location.assign('/');
      sessionStorage.removeItem('userId');
      console.log(response.message);
    });
  }

  addSession() {
    const todayDate = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    const sessionStart = '0:0:0';
    const sessionData: PoseSession = {
      userId: localStorage.getItem('userId'),
      date: todayDate,
      startTime: time,
      sessionTime: sessionStart
    };
    this.http.post<{ message: string }>(SESSION_URL, sessionData).subscribe((responseData) => {
      console.log(responseData.message);
    });
    this.getSessionDetails(time);
  }

  updateCurrentTime(time) {
    const UPDATE_URL = environment.apiUrl + '/pose/update/' + sessionStorage.getItem('sessionId') + '/' + time;
    return this.http.get<{ message: string }>(UPDATE_URL).subscribe(
      (responseMessage) => {
        console.log(responseMessage.message);
      }
    );
  }

  getSessionDetails(time) {
    const GET_SESSION_URL = environment.apiUrl + '/pose/get-session-details/' + localStorage.getItem('userId') + '/' + time;
    return this.http.get<{ id: string, message: string }>(GET_SESSION_URL).subscribe(
      (responseBody) => {
        sessionStorage.setItem('sessionId', responseBody.id);
        console.log(responseBody.message);
      }
    );
  }
}
