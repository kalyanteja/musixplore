import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LastfmService } from '../lastfm.service';
import { DataService } from '../data.service';
import { map } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-trend',
  templateUrl: './trend.page.html',
  styleUrls: ['./trend.page.scss'],
})
export class TrendPage implements OnInit {
  tracks: Array<any>;
  musicData: any;
  page: number = 1;
  searchTag: string;
  constructor(
   private authService: AuthService,
   private router: Router,
   private lastFmService: LastfmService,
   private dataService: DataService,
   private zone: NgZone,
   private toastCtrl: ToastController) { }

  ngOnInit() {
    //unmock auth
    // if(!this.authService.currentUser){
    //   this.router.navigate(['/login']);
    // }

    this.dataService.sync();

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
    this.dataService.put(track);
    this.presentToast(`Added ${track.name} to your playlist.`);
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'top',
      color: 'medium'
    });
    toast.present();
  }

  goToUrl(url){
    window.open(url);
  }

  loadMoreMusicTrends(scrollEvent){
    this.page++;
    this.lastFmService.getTopTrendingMusic(this.page, this.searchTag)
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

  getTopMusicByTag(event){
    this.page = 1;
    this.searchTag = event.target.value;
    this.lastFmService.getTopTrendingMusic(this.page, this.searchTag)
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
}
