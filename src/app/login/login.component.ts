import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userEmail : String;
  userPassword : String;
  isLoggedIn : boolean = false;
  userName : String = 'loading';

  constructor(private authService : AuthService, private router : Router) { }

  ngOnInit() {
      this.isLoggedIn = false
      this.userName = 'loading'
      this.authService.currentUserData.subscribe(message => this.updateLoginInfo(message))
  }

  updateLoginInfo(message: string) {
    this.userName=message
    this.isLoggedIn = (this.userName !== '')
    console.log("LoginComponent::updateLoginInfo: hello "+this.userName)
  }

  login(){
    this.authService.validate(this.userEmail.valueOf(), this.userPassword.valueOf())
    .then((response: NiceUser) => {
      this.authService.setUserInfo(response.username);
      this.router.navigate(['home'])
      .then(() => {
        console.log("LoginComponent::login: i am reloading")
      });
    })
    
  }

  logout(){
    this.authService.logout().then((response) => {
      this.router.navigate(['home'])
      .then(() => {
        console.log("LoginComponent::logout: i am reloading after logout")
        this.userEmail=""
        this.userPassword=""
      })
    });

  }
}
