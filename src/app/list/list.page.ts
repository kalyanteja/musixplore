import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  private selectedItem: any;
  public addedTracks: Array<{ title: string; note: string; icon: string; docId: string; docRev: string; }> = [];
  
  constructor(private dataService: DataService,
    private toastCtrl: ToastController) {

    this.dataService.fetch().then(result => {
      for (let i = 0; i < result.rows.length; i++) {
        const doc = result.rows[i].doc;
        this.addedTracks.push({
          title: doc.name,
          note: `by ${doc.artist.name}`,
          icon: doc.image[0].urlText,
          docId: doc._id,
          docRev: doc._rev
        });
      }
    }, error => {
      console.error(error);
    });
  }

  ngOnInit() {
  }

  deleteTrack(trackItem){
    this.dataService.delete(trackItem.docId, trackItem.docRev);
    this.addedTracks = this.addedTracks.filter(t => t.docId !== trackItem.docId);
    this.presentToast(`${trackItem.title} removed off your playlist.`)
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'top',
      color: "medium"
    });
    toast.present();
  }
}
