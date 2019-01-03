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
  }

  public fetch() {
    return this.db.allDocs({include_docs: true});
  }

  public delete(docId: string, docRev: string){
    return this.db.remove(docId, docRev);
  }

  public get(id: string) {
    return this.db.get(id);
  }

  public put(document: any) {
    const docId = rand(16);
    document._id = docId;
    console.log('insert document ' + docId);

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
      console.log('syncing changes...')
      const remoteDatabase = new PouchDB(COUCHDB_CONN);
      this.db.sync(remoteDatabase, {
          live: true
      }).on('change', change => {
          console.log(change);
          this.listener.emit(change);
      }).on('error', error => {
          console.error(JSON.stringify(error));
      });
  }

  public getChangeListener() {
      return this.listener;
  }
}