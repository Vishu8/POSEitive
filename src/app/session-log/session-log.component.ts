import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

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
  private authListenerSubs: Subscription;
  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    this.startTime = '11:30';
    this.endTime = '12:30';
    this.sessionDuration = '30 mins';
    this.countPosture = 12;
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated;
    });
    this.name = this.authService.getUserName();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
