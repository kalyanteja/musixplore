import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LastfmService } from '../lastfm.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-trend',
  templateUrl: './trend.page.html',
  styleUrls: ['./trend.page.scss'],
})
export class TrendPage implements OnInit {
  musicData: any;
  constructor(private authService: AuthService, private router: Router, private lastFmService: LastfmService) { }

  ngOnInit() {
    if(!this.authService.currentUser){
      this.router.navigate(['/login']);
    }

    this.lastFmService.getTopTrendingMusic()
    .pipe(map(response => (<any>response).tracks))
    .subscribe(data => {
      // added image url property in readable format
      data.track.forEach(track => {
        track.image.forEach(element => {
          element.urlText = element['#text'];
        });
      });
      this.musicData = data;
    });
  }

  goToMusicItem(track){
    this.lastFmService.currentTrack = track;
    this.router.navigate(['/music']);
  }

}
