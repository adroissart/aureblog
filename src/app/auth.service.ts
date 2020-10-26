import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient) { }

  public isAuthenticated() : Boolean {
    console.log("check authenticated")
    let userData = localStorage.getItem('userInfo')
    if(userData && JSON.parse(userData)){
      console.log("is authenticated")
      return true;
    }
    return false;
  }

  public isLoggedIn() {
    return this.http.get('/test').toPromise();
  }

  public setUserInfo(user){
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  public validate(email, password) {
    return this.http.post('/api/login', {'username' : email, 'password' : password}).toPromise()
  }

  public logout() {
    return this.http.get('api/logout').toPromise();
  }
}