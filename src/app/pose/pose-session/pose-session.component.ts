import { Component, OnInit, OnDestroy } from '@angular/core';
import * as posenet from '@tensorflow-models/posenet';
import { from, defer, animationFrameScheduler, timer, Subscription } from 'rxjs';
import { concatMap, tap, observeOn, takeUntil, repeat } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { AuthService } from 'src/app/auth/auth.service';
import { PoseService } from '../pose.service';
import { PoseData } from '../pose-data.model';

declare var $: any;

@Component({
  selector: 'app-pose-session',
  templateUrl: './pose-session.component.html',
  styleUrls: ['./pose-session.component.css']
})
export class PoseSessionComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  color = 'red';
  video: HTMLVideoElement;
  isLoaded = false;
  mySubscription: any;
  interval: any;
  hours: number;
  minutes: number;
  seconds: number;
  action: string;
  isRunning: boolean;
  userIsAuthenticated = false;
  name: string;
  userPoseData: PoseData;
  errorCount: number;
  status: string;
  private authListenerSubs: Subscription;
  constructor(
    private authService: AuthService,
    private poseService: PoseService
  ) { }

  invokeError(errorCase) {
    if (errorCase === true) {
      setTimeout(() => {
        this.errorCount++;
      }, 1000);
      if (this.errorCount === 50) {
        this.status = 'Wrong Posture';
        this.pr('Pause');
        $('#myModal').modal('show');
        $('#myAudio')[0].play();
        setTimeout(() => {
          $('#myModal').modal('hide');
          this.errorCount = 0;
          this.pr('Resume');
        }, 3000);
      }
    } else {
      this.errorCount = 0;
    }
  }

  incr() {
    if (this.hours === 2) {
      alert('You have been sitting for more than 2hrs. Take a little break and comeback to work.');
      setTimeout(() => {
        window.location.assign('/home');
      }, 600000);
      sessionStorage.removeItem('sessionId');
    }

    if (this.isRunning === true && this.hours !== 2) {
      this.seconds++;
      this.poseService.updateCurrentTime(this.hours + ':' + this.minutes + ':' + this.seconds);
    }

    if (this.seconds === 60) {
      this.minutes++;
      this.seconds = 0;
    }

    if (this.minutes === 60) {
      this.hours++;
      this.minutes = 0;
    }

    setTimeout(() => {
      this.incr();
    }, 1000);

  }
  pr(action) {
    if (action === 'Start') {
      this.poseService.addSession();
      this.incr();
      this.isRunning = true;
      this.action = 'Pause';
    }
    if (action === 'Pause') {
      this.isRunning = false;
      this.action = 'Resume';
    } else if (action === 'Resume') {
      this.isRunning = true;
      this.action = 'Pause';
    } else if (action === 'Stop') {
      this.isRunning = false;
      this.seconds = 0;
      this.minutes = 0;
      this.hours = 0;
      this.action = 'Start';
    }
  }

  ngOnInit() {
    this.errorCount = 0;
    this.status = 'Status';
    this.action = 'Start';
    this.isRunning = false;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated;
    });
    this.name = this.authService.getUserName();
    this.webcam_init();
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
        this.isLoaded = true;
        this.pr(this.action);
        console.log(new Date().toLocaleTimeString());
        const action$ = (model: posenet.PoseNet) =>
          defer(() => model.estimateSinglePose(this.video)).pipe(
            observeOn(animationFrameScheduler),
            tap((prediction: posenet.Pose) => this.renderPredictions(prediction)),
            takeUntil(timer(1000)),
            repeat()
          );
        this.subs.add(
          from(posenet.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: 257,
            quantBytes: 2
          })).pipe(
            concatMap(model => action$(model)),
          ).subscribe()
        );
      });
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  calDistance(position1: { x: number, y: number }, position2: { x: number, y: number }, ): number {
    return Math.floor(Math.sqrt((position1.x - position2.x) ** 2 + (position1.y - position2.y) ** 2));
  }
  toTuple({ y, x }) {
    return [y, x];
  }

  webcam_init() {
    this.video = document.getElementById('vid') as HTMLVideoElement;
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
        }
      })
      .then(stream => {
        this.video.srcObject = stream;
        this.video.onloadedmetadata = () => {
          this.video.play();
        };
      });
  }

  renderPredictions = (prediction: posenet.Pose) => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    canvas.width = 700;
    canvas.height = 500;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
    const minConfidence = 0.15;
    if (prediction.score >= minConfidence) {
      this.drawKeypoints(prediction.keypoints, minConfidence, ctx);
    }
    if (
      prediction.keypoints[0].score < 0.8 &&
      prediction.keypoints[1].score < 0.8 &&
      prediction.keypoints[2].score < 0.8 &&
      prediction.keypoints[5].score < 0.8 &&
      prediction.keypoints[6].score < 0.8
    ) {
      this.pr('Pause');
    } else {
      this.userPoseData = this.poseService.getUserCoordinates();
      setTimeout(() => {
        if (this.compare(prediction) === true) {
          this.status = 'Incorrect';
          this.invokeError(true);
        } else {
          this.status = 'Correct';
          this.invokeError(false);
        }
      }, 500);
      this.pr('Resume');
    }
  }

  drawPoint(ctx: CanvasRenderingContext2D, y: number, x: number, r: number, color: string) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  drawSegment([ay, ax]: any, [by, bx]: any, color: string, scale: number, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(ax * scale, ay * scale);
    ctx.lineTo(bx * scale, by * scale);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  drawKeypoints(keypoints: posenet.Keypoint[], minConfidence: number, ctx: CanvasRenderingContext2D, scale = 1) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];
      if (keypoint.score < minConfidence) {
        continue;
      }
      const { y, x } = keypoint.position;
      this.drawPoint(ctx, y * scale, x * scale, 3, this.color);
    }
  }

  stopSession() {
    window.location.assign('/home');
    sessionStorage.removeItem('sessionId');
  }

  compare(prediction) {
    const limit = 50;
    if (
      prediction.keypoints[0].position.x > this.userPoseData.nosexValue + limit ||
      prediction.keypoints[0].position.y > this.userPoseData.noseyValue + limit ||
      prediction.keypoints[1].position.x > this.userPoseData.leftEyexValue + limit ||
      prediction.keypoints[1].position.y > this.userPoseData.leftEyeyValue + limit ||
      prediction.keypoints[2].position.x > this.userPoseData.rightEyexValue + limit ||
      prediction.keypoints[2].position.y > this.userPoseData.rightEyeyValue + limit ||
      prediction.keypoints[5].position.x > this.userPoseData.leftShoulderxValue + limit ||
      prediction.keypoints[5].position.y > this.userPoseData.leftShoulderyValue + limit ||
      prediction.keypoints[6].position.x > this.userPoseData.rightShoulderxValue + limit ||
      prediction.keypoints[6].position.y > this.userPoseData.rightShoulderyValue + limit

    ) {
      return true;
    } else if (
      prediction.keypoints[0].position.x < this.userPoseData.nosexValue - limit ||
      prediction.keypoints[0].position.y < this.userPoseData.noseyValue - limit ||
      prediction.keypoints[1].position.x < this.userPoseData.leftEyexValue - limit ||
      prediction.keypoints[1].position.y < this.userPoseData.leftEyeyValue - limit ||
      prediction.keypoints[2].position.x < this.userPoseData.rightEyexValue - limit ||
      prediction.keypoints[2].position.y < this.userPoseData.rightEyeyValue - limit ||
      prediction.keypoints[5].position.x < this.userPoseData.leftShoulderxValue - limit ||
      prediction.keypoints[5].position.y < this.userPoseData.leftShoulderyValue - limit ||
      prediction.keypoints[6].position.x < this.userPoseData.rightShoulderxValue - limit ||
      prediction.keypoints[6].position.y < this.userPoseData.rightShoulderyValue - limit
    ) {
      return true;
    } else {
      return false;
    }
  }
}
