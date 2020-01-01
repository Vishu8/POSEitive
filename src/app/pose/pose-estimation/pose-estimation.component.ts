import { Component, OnInit, OnDestroy } from '@angular/core';
import * as posenet from '@tensorflow-models/posenet';
import { from, defer, animationFrameScheduler, timer } from 'rxjs';
import { concatMap, tap, observeOn, takeUntil, repeat } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { PoseService } from '../pose.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';

declare var $: any;

enum Points { nose = 0, leftEye = 1, rightEye = 2, leftShoulder = 5, rightShoulder = 6 }
@Component({
  selector: 'app-pose',
  templateUrl: './pose-estimation.component.html',
  styleUrls: ['./pose-estimation.component.css']
})
export class PoseEstimationComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  color = 'red';
  video: HTMLVideoElement;
  isLoaded = false;
  time = 5;
  duration = 5;
  mySubscription: any;
  interval: any;
  isSaved: boolean;
  nosex = [];
  nosey = [];
  leftEyex = [];
  leftEyey = [];
  rightEyex = [];
  rightEyey = [];
  leftShoulderx = [];
  leftShouldery = [];
  rightShoulderx = [];
  rightShouldery = [];

  constructor(
    private poseService: PoseService,
    public loader: LoadingBarService,
    private router: Router
  ) { }

  mode(pointValues: any[]) {
    const mode = {};
    let max = 0;
    let count = 0;

    pointValues.forEach((e) => {
      if (mode[e]) {
        mode[e]++;
      } else {
        mode[e] = 1;
      }

      if (count < mode[e]) {
        max = e;
        count = mode[e];
      }
    });

    return max;
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.time > 0) {
        this.time--;
      } else {
        this.stopTimer();
        this.isSaved = true;
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.interval);
  }

  ngOnInit() {
    this.webcam_init();
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
        this.isLoaded = true;
        setTimeout(() => {
          this.isSaved = false;
          this.startTimer();
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
          setTimeout(() => {
            sessionStorage.removeItem('userId');
          }, this.duration * 60000);
        }, 5000);
      }).catch(() => {
        $('#myModal2').modal('show');
      });
    } else {
      $('#myModal').modal('show');
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
    if (this.time === 0) {
      this.video.pause();
    }
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
      this.time > 0
      && prediction.keypoints[Points.nose].score > 0.8
      && prediction.keypoints[Points.leftEye].score > 0.8
      && prediction.keypoints[Points.rightEye].score > 0.8
      && prediction.keypoints[Points.leftShoulder].score > 0.8
      && prediction.keypoints[Points.rightShoulder].score > 0.8
    ) {
      this.setValues(prediction);
      this.loader.start();
    }
    if (this.time === 0) {
      this.loader.stop();
      this.loader.complete();
      setTimeout(() => {
        canvas.style.display = 'none';
      }, 900);
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

  setValues(prediction: any) {
    this.nosex.push(prediction.keypoints[Points.nose].position.x);
    this.nosey.push(prediction.keypoints[Points.nose].position.y);
    this.leftEyex.push(prediction.keypoints[Points.leftEye].position.x);
    this.leftEyey.push(prediction.keypoints[Points.leftEye].position.y);
    this.rightEyex.push(prediction.keypoints[Points.rightEye].position.x);
    this.rightEyey.push(prediction.keypoints[Points.rightEye].position.y);
    this.leftShoulderx.push(prediction.keypoints[Points.leftShoulder].position.x);
    this.leftShouldery.push(prediction.keypoints[Points.leftShoulder].position.y);
    this.rightShoulderx.push(prediction.keypoints[Points.rightShoulder].position.x);
    this.rightShouldery.push(prediction.keypoints[Points.rightShoulder].position.y);
  }

  saveValues() {
    this.poseService.addPose(
      this.mode(this.nosex),
      this.mode(this.nosey),
      this.mode(this.leftEyex),
      this.mode(this.leftEyey),
      this.mode(this.rightEyex),
      this.mode(this.rightEyey),
      this.mode(this.leftShoulderx),
      this.mode(this.leftShouldery),
      this.mode(this.rightShoulderx),
      this.mode(this.rightShouldery)
    );
  }

  reload() {
    window.location.reload();
  }

  toHome() {
    this.router.navigate(['/']);
  }
}
