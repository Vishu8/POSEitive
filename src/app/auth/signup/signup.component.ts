import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit {
  isActive = true;

  constructor(public authService: AuthService, public loader: LoadingBarService) { }

  ngOnInit(): void { }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.loader.start();
    this.authService.createUser(form.value.fullname, form.value.email, form.value.password);
    this.loader.complete();
  }
}
