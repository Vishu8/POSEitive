import { Injectable } from '@angular/core';
import { PoseData } from './pose-data.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PoseSession } from './pose-session.model';

const BACKEND_URL = environment.apiUrl + '/pose';
const SESSION_URL = environment.apiUrl + '/pose/session';
@Injectable({ providedIn: 'root' })
export class PoseService {
  poseData: PoseData;
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

  addSession(wrongCount: number) {
    const todayDate = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    const sessionStart = '0:0:0';
    const sessionData: PoseSession = {
      userId: localStorage.getItem('userId'),
      date: todayDate,
      startTime: time,
      sessionTime: sessionStart,
      wrongCount
    };
    this.http.post<{ message: string }>(SESSION_URL, sessionData).subscribe((responseData) => {
      console.log(responseData.message);
    });
    setTimeout(() => {
      this.getSessionDetails(time);
    }, 500);
  }

  updateCurrentTime(time) {
    const UPDATE_URL = environment.apiUrl + '/pose/update/' + sessionStorage.getItem('sessionId') + '/' + time;
    return this.http.get<{ message: string }>(UPDATE_URL).subscribe(
      (responseMessage) => {
        console.log(responseMessage.message);
      }
    );
  }
  updateWrongPosture(wrongCount: number) {
    const UPDATE_WRONG_POSTURE_URL = environment.apiUrl + '/pose/session/update/' + sessionStorage.getItem('sessionId') + '/' + wrongCount;
    return this.http.get<{ message: string }>(UPDATE_WRONG_POSTURE_URL).subscribe(
      (responseWrongMessage) => {
        console.log(responseWrongMessage.message);
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

  getUserCoordinates() {
    const GET_USER_URL = environment.apiUrl + '/pose/get-user-coordinates/' + localStorage.getItem('userId');
    this.http.get<{ result: PoseData, message: string }>(GET_USER_URL).subscribe(
      (responseUser) => {
        this.poseData = responseUser.result;
        console.log(responseUser.message);
      }
    );
    return this.poseData;
  }
}
