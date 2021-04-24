import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { TripListComponent } from './trip-list/trip-list.component';
import { DevListComponent } from './dev/dev-list/dev-list.component';
import { PostListComponent } from './posts/posts/post-list/post-list.component';
import { WelcomeComponent } from './welcome/welcome.component';
import {
  AuthGuardService as AuthGuard
} from './auth-guard.service';


const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'trip', component: TripListComponent },
  { path: 'movie', component: PostListComponent },
  { path: 'dev', component: DevListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
