import { Injectable } from '@angular/core';
import { PoseData } from './pose-data.model';
import { HttpClient } from '@angular/common/http';
import { Router, RoutesRecognized } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/pose/';
@Injectable({ providedIn: 'root' })
export class PoseService {
  constructor(private http: HttpClient, private router: Router) { }
  getUserId(id: string) {
    return id;
  }

  addPose(
    userId: string,
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
      userId,
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
      this.router.navigate(['/']);
      console.log(response.message);
    });
  }
}
