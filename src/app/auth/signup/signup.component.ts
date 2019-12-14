import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
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

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.loader.start();
    this.authService.createUser(form.value.fullname, form.value.email, form.value.password);
    this.loader.complete();
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
