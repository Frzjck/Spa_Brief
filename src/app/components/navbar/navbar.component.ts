import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  userName: any;
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    // this.userName = getAuth().currentUser?.displayName || undefined;
    // console.log(getAuth().currentUser);
    this.userName = this.authService.getUser();
  }
}
