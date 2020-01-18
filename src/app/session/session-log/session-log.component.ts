import { SessionService } from './../session.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { PoseSessionLog } from 'src/app/pose/pose-session.model';

@Component({
  selector: 'app-session-log',
  templateUrl: './session-log.component.html',
  styleUrls: ['./session-log.component.css']
})
export class SessionLogComponent implements OnInit, OnDestroy {
  isActive = true;
  userIsAuthenticated = false;
  name: string;
  countPosture: number;
  startTime: string;
  endTime: string;
  sessionDuration: string;
  sessionLogs: PoseSessionLog[];
  private authListenerSubs: Subscription;
  constructor(private authService: AuthService, private sessionService: SessionService) { }
  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated;
    });
    this.name = this.authService.getUserName();
    this.sessionLogs = this.sessionService.getSessionLogs();
    console.log(this.sessionLogs);
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
