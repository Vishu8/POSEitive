import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isActive = true;
  private authStatusSub: Subscription;
  constructor(private authService: AuthService, public loader: LoadingBarService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      (authStatus) => {
        console.log(authStatus);
      }
    );
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.loader.start();
    this.authService.login(form.value.email, form.value.password);
    this.loader.complete();
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
