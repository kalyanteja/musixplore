import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  username: string;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.username = this.authService.currentUser;
  }
}
