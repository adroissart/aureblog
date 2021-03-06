import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userDataSource = new BehaviorSubject('{}');
  currentUserData = this.userDataSource.asObservable();
  private errorMessageSource = new BehaviorSubject('');
  currentErrorMessage = this.errorMessageSource.asObservable();

  constructor(private http: HttpClient) {

  }

  public isAuthenticated(): boolean {
    console.log('AuthService::isAuthenticated: check authenticated ' + this.userDataSource.getValue());
    if (this.userDataSource.getValue() && JSON.parse(this.userDataSource.getValue()).hasOwnProperty('username')) {
      console.log('AuthService::isAuthenticated: is authenticated');
      return true;
    }
    return false;
  }

  public checkLoggedIn() {
    console.log('AuthService::checkLoggedIn: start');
    this.http.get<NiceUser>('/api/checkauth').toPromise()
      .catch((error: any) => this.handleError(error))
      .then((user: NiceUser) => this.afterCheckAuth(user));
  }

  private afterCheckAuth(user: NiceUser) {
    console.log('AuthService::afterCheckAuth: response received ' + user);
    this.setUserInfo(JSON.stringify(user));
  }

  public setUserInfo(username: string) {
    console.log('AuthService::setUserInfo');
    this.userDataSource.next(username);
  }

  public validate(email: string, password: string) {
    return this.http.post<NiceUser>('/api/login', { username: email, password }).toPromise()
      .catch(error => this.handleLoginError(error));
  }

  public logout() {
    this.userDataSource.next('{}');
    return this.http.get('api/logout').toPromise();
  }

  private handleError(error: any) {
    const errMsg = 'error';
    if (error.status === 401) {
      console.log('AuthService::handleError: no authentication');
      this.userDataSource.next('{}');
    }
    // return errMsg
    throw (new Error('You shall not pass'));
  }

  private handleLoginError(error: any) {
    console.log(error.error);
    this.errorMessageSource.next(error.error);
    const emptyUser: NiceUser = { username: '', admin: false };
    return emptyUser;
  }
}
