import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoseEstimationComponent } from './pose-estimation/pose-estimation.component';
import { LoginComponent } from './auth/login/login.component';
import {
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatProgressBarModule
} from '@angular/material';
import { SignUpComponent } from './auth/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    PoseEstimationComponent,
    LoginComponent,
    SignUpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoadingBarRouterModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
