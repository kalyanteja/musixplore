import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HomePage } from '../home/home.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string;
  password: string;
  loginFailed: boolean;
  constructor(private authService: AuthService, private menuController: MenuController, private router: Router) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.menuController.enable(false);
  }

  ionViewDidLeave() {
    this.menuController.enable(true);
  }

  Login(){
    try {
      if (this.username != null && this.password != null){
        const username = this.username.trim();
        const password = this.password.trim();
  
        const isAuthenticated = this.authService.authenticateUser(username, password);
        if (isAuthenticated){
          this.router.navigate(['/home']);
        } else{
          this.loginFailed = true;
        }
      }else{
        this.loginFailed = true;
      }
    } catch (error) {
      this.loginFailed = true;
    }
  }
}
