import { Injectable } from '@angular/core';
import { CanActivate,Router } from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService : AuthService, private route : Router) { }

  canActivate(){
    console.log("checking auth guard");
    if(this.authService.isAuthenticated()){
      console.log("AuthGuard ok");
      return true;
    }
    this.route.navigate(['login']);
    return false;
  }
}