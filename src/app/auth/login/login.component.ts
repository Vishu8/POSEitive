import { Component, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router, RoutesRecognized } from '@angular/router';
import { pairwise, filter } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isActive = true;
  constructor(public loader: LoadingBarService, public router: Router) { }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        if (events[0].urlAfterRedirects === '/pose-estimation') {
          window.location.assign('/');
        }
        console.log('previous url', events[0].urlAfterRedirects);
        console.log('current url', events[1].urlAfterRedirects);
      });
  }
}
