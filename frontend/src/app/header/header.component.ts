import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../auth/auth.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  subscription: Subscription;
  user: User;
  loggedIn: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.user;
    this.loggedIn = this.authService.loggedIn;
    this.subscription = this.authService.authChanged.subscribe(data => {
      this.user = data.user;
      this.loggedIn = data.loggedIn;
    })
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  

}
