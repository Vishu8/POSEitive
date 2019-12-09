import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoseEstimationComponent } from './pose-estimation/pose-estimation.component';
import { LoginComponent } from './auth/login/login.component';
import { MatCardModule, MatInputModule, MatButtonModule, MatIconModule } from '@angular/material';
import { SignUpComponent } from './auth/signup/signup.component';

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
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
