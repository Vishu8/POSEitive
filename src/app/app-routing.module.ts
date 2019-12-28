import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/signup/signup.component';
import { PoseEstimationComponent } from './pose/pose-estimation/pose-estimation.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { PoseSessionComponent } from './pose/pose-session/pose-session.component';


const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/signup', component: SignUpComponent },
  { path: 'pose-estimation', component: PoseEstimationComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'pose-session', component: PoseSessionComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
