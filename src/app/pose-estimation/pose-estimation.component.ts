import { Component, OnInit, OnDestroy } from '@angular/core';
import * as posenet from '@tensorflow-models/posenet';
import { from, defer, animationFrameScheduler, timer } from 'rxjs';
import { concatMap, tap, observeOn, takeUntil, repeat } from 'rxjs/operators';
import { SubSink } from 'subsink';

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

  ngOnInit() {
    this.webcam_init();
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
        this.isLoaded = true;
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
      console.log(prediction.keypoints);
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
}
