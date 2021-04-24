import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userEmail: string;
  userPassword: string;
  isLoggedIn = false;
  isAdmin = false;
  userName = 'loading';
  errorMessage: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
//    console.log('LoginComponent::ngOnInit: start');
    this.authService.currentUserData.subscribe(message => this.updateLoginInfo(message));
    this.authService.currentErrorMessage.subscribe(message => this.errorMessage = message);
    this.isLoggedIn = false;
    this.userName = 'loading';
  }

  isActive(myroute: string) {

  }

  updateLoginInfo(message: string) {
    const user: NiceUser = JSON.parse(message);
    this.userName = user.username;
    this.isAdmin = user.admin;
    this.isLoggedIn = user.username ? (this.userName !== '') : false;
    console.log('LoginComponent::updateLoginInfo: hello ' + this.userName);
  }

  login() {
    this.authService.validate(this.userEmail.valueOf(), this.userPassword.valueOf())
      .then((response: NiceUser) => {
        this.authService.setUserInfo(JSON.stringify(response));
        if (this.userName !== '') {
          this.errorMessage = '';
        }
        this.router.navigate([''])
          .then(() => {
            console.log('LoginComponent::login: i am reloading');
          });
      });

  }

  logout() {
    this.authService.logout().then((response) => {
      this.router.navigate([''])
        .then(() => {
          console.log('LoginComponent::logout: i am reloading after logout');
          this.userEmail = '';
          this.userPassword = '';
        });
    });

  }

  isRoute(inRoute: string): boolean {
    console.log('route is '+this.router.url);
    if (this.router.url === inRoute) {
      return true;
    }
    return false;
  }
}
