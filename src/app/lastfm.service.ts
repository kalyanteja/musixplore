import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

const LASTFM_URL = environment.LASTFM_API_URL;
const LASTFM_KEY = environment.LASTFM_API_KEY;

@Injectable({
  providedIn: 'root'
})
export class LastfmService {
  currentTrack: any;
  constructor(private http: HttpClient) { }

  getTopTrendingMusic(){
    return this.http.get(`${LASTFM_URL}${LASTFM_KEY}`);
  }
}
