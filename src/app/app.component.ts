import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'aureblog';
  loggedIn : boolean = false;

  constructor(private authService : AuthService) {}

  ngOnInit() {
    this.authService.checkLoggedIn()
  }
}
