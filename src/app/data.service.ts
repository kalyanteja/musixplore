import { environment } from './../environments/environment';
import { Injectable, EventEmitter } from '@angular/core';
import { rand } from '@jsweb/randkey'
import PouchDB from 'pouchdb';

const COUCHDB_CONN = environment.COUCHDB_CONNECTION;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private db: any;
  private isInstantiated: boolean;
  private listener: EventEmitter<any> = new EventEmitter();

  public constructor() {

    if (!this.isInstantiated) {
      this.db = new PouchDB('tracks');
      this.isInstantiated = true;
    }

    this.db.changes({
      since: 'now',
      live: true
    }).on('change', this.fetch);
  }

  public fetch() {
    return this.db.allDocs({include_docs: true, descending: true});
  }

  public delete(docId: string, docRev: string){
    this.db.remove(docId, docRev);
  }

  public get(id: string) {
    return this.db.get(id);
  }

  public findByName(name: string){
    // The _id field is the primary index. This query finds
    // all documents with _id greater than or equal to "dk"
    this.db.find({
      selector: {name: {$eq: name}},
      sort: ['_id']
    });
  }

  public put(document: any) {
    const docId = rand(16);
    document._id = docId;
    //console.log(this.findByName(document.name));
    return this.get(docId).then(result => {
        document._rev = result._rev;
        console.log("in error zero");
        return this.db.put(document);
    }, error => {
        console.log("in error one" + error.status);
        if (error.status == '404') {
          console.log('works!!');
            return this.db.put(document);
        } else {
          console.log("in error two");
            return new Promise((resolve, reject) => {
              console.log("in error 4");
                reject(error);
            });
        }
    });
  }

  public sync() {
    const remoteCouch = new PouchDB(COUCHDB_CONN);
    var opts = {live: true};
    this.db.replicate.to(remoteCouch, opts, this.syncError);
    this.db.replicate.from(remoteCouch, opts, this.syncError);
  }

  private syncError() {
    console.log('error in syncing....123');
  }

  public getChangeListener() {
      return this.listener;
  }
}