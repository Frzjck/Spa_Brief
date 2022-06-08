import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  userName: any;
  userNameSub: Subscription;
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.authService.getUser();
    }

    this.userNameSub = this.authService.userNameSub.subscribe(
      (username) => (this.userName = username)
    );
  }
  ngOnDestroy(): void {
    this.userNameSub.unsubscribe;
  }
}
