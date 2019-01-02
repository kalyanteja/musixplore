import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  private selectedItem: any;
  public addedTracks: Array<{ title: string; note: string; icon: string }> = [];
  
  constructor(private dataService: DataService) {
    this.dataService.fetch().then(result => {
      for (let i = 0; i < result.rows.length; i++) {
        const doc = result.rows[i].doc;
        this.addedTracks.push({
          title: doc.name,
          note: `by ${doc.artist.name}`,
          icon: doc.image[0].urlText
        });
      }
    }, error => {
      console.error(error);
    });
  }

  ngOnInit() {
  }
}
