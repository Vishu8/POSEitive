import { ErrorComponent } from './error/error.component';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog, private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';
        if (error.error.message) {
          errorMessage = error.error.message;
          this.dialog.open(ErrorComponent, { data: { message: errorMessage } });
        }
        if (error.error.message === 'Your Pose is not Recorded!') {
          setTimeout(() => {
            this.dialog.closeAll();
            this.router.navigate(['/pose-estimation']);
          }, 1000);
        }
        return throwError(error);
      })
    );
  }
}
