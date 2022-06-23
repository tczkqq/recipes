import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from '../auth.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
subscription: Subscription;
  user: User;
  loggedIn: boolean;
  error: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.subscription = this.authService.authChanged.subscribe(data => {
      this.user = data.user;
      this.loggedIn = data.loggedIn;
      this.error = data.error;
    })
  }
  
  onSubmit(form: NgForm) {
    this.authService.register(form.form.value)
  }
}
