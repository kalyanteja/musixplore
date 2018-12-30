import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trend',
  templateUrl: './trend.page.html',
  styleUrls: ['./trend.page.scss'],
})
export class TrendPage implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if(!this.authService.currentUser){
      this.router.navigate(['/login']);
    }
  }

}
