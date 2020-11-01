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
  userName : string = 'loading';
  errorMessage : string;

  constructor(private authService : AuthService, private router : Router) { }

  ngOnInit() {
    console.log("LoginComponent::ngOnInit: start")
      this.authService.currentUserData.subscribe(message => this.updateLoginInfo(message))
      this.authService.currentErrorMessage.subscribe(message => this.errorMessage = message)
      this.isLoggedIn = false
      this.userName = 'loading'
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
      if (this.userName != '') {
        this.errorMessage=''
      }
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
