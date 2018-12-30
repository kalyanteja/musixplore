import { Component, OnInit } from '@angular/core';
import { LastfmService } from '../lastfm.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-music',
  templateUrl: './music.page.html',
  styleUrls: ['./music.page.scss'],
})
export class MusicPage implements OnInit {
  currentTrack: any;
  constructor(private lastFmService: LastfmService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    if(!this.authService.currentUser){
      this.router.navigate(['/login']);
    }

    if (!this.lastFmService.currentTrack){
      this.router.navigate(['/trend']);
    }

    this.currentTrack = this.lastFmService.currentTrack;
  }

}
