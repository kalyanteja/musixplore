import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  username: string;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if(this.authService.currentUser){
      this.username = this.authService.currentUser;
    }else{
      this.router.navigate(['/login']);
    }
  }
}
