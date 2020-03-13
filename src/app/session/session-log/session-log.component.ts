import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { SessionLog } from 'src/app/session/session.model';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/session/';

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
  sessionLogs: SessionLog[];
  private authListenerSubs: Subscription;
  constructor(private authService: AuthService, private http: HttpClient) { }
  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated;
    });
    this.name = this.authService.getUserName();
    this.http.get<{ message: string, result: SessionLog[] }>(BACKEND_URL + localStorage.getItem('userId')).subscribe(
      (response) => {
        this.sessionLogs = response.result;
        return this.sessionLogs;
      }
    );
  }

  getHelp() {
    window.open(
      'https://dotslash-poseitive.vizfolio.co/',
      '_blank'
    );
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
