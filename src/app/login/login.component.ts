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
  isHidden : boolean;

  constructor(private authService : AuthService, private router : Router) { }

  ngOnInit() {
    this.isHidden=true;
    this.authService.isLoggedIn().then((response) => {
      if (response === "authenticated!") {
        console.log("i show you");
        this.isHidden=false;
      } else {
        console.log("i am not showing you");
        this.isHidden=true;
      }
    }).catch((error) => {
      if (error.status === 401) {
        this.isHidden=false;
      }
      console.log("ca merde"+error.status)
    });
  }

  login(){
    this.authService.validate(this.userEmail, this.userPassword)
    .then((response) => {
      this.authService.setUserInfo({'user' : response['user']});
      this.isHidden=true;
      this.router.navigate(['home'])
      .then(() => {
        console.log("i am reloading")
        window.location.reload();
      });

    })
    
  }

  logout(){
    this.authService.logout().then((response) => {
      this.authService.setUserInfo(null);
      this.isHidden=false;
      this.router.navigate(['home'])
      .then(() => {
        console.log("i am reloading after logout")
        window.location.reload();
      })
    });

  }
}
