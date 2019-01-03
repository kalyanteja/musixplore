import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LastfmService } from '../lastfm.service';
import { DataService } from '../data.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-trend',
  templateUrl: './trend.page.html',
  styleUrls: ['./trend.page.scss'],
})
export class TrendPage implements OnInit {
  tracks: Array<any>;
  musicData: any;
  page: number = 1;
  constructor(
   private authService: AuthService,
   private router: Router,
   private lastFmService: LastfmService,
   private dataService: DataService,
   private zone: NgZone) { }

  ngOnInit() {
    //unmock auth
    // if(!this.authService.currentUser){
    //   this.router.navigate(['/login']);
    // }

    this.dataService.sync();
    this.dataService.getChangeListener().subscribe(data => {
      for (let i = 0; i < data.change.docs.length; i++) {
        this.zone.run(() => {
          this.tracks.push(data.change.docs[i]);
        });
      }
    });
    this.dataService.fetch().then(result => {
      this.tracks = [];
      for (let i = 0; i < result.rows.length; i++) {
        this.tracks.push(result.rows[i].doc);
      }
    }, error => {
      console.error(error);
    });

    this.lastFmService.getTopTrendingMusic(this.page)
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

  addToPlaylist(track){
    console.log(track);
    this.dataService.put(track);
  }

  goToUrl(url){
    window.open(url);
  }

  loadMoreMusicTrends(scrollEvent){
    this.page++;
    this.lastFmService.getTopTrendingMusic(this.page)
      .pipe(map(response => (<any>response).tracks))
      .subscribe(data => {
        // added image url property in readable format
        data.track.forEach(track => {
          track.image.forEach(element => {
            element.urlText = element['#text'];
          });
          this.musicData.track.push(track);
        });
      });
      //complete the infinite scroll event
    scrollEvent.target.complete();
  }
}
