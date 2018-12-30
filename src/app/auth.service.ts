import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: string;
  constructor() { }

  authenticateUser(username, password){
    //mock user authentication
    if (username && password){
      //This is where you'd check db for valid user and password match logic
      // I'm always authenticating
      this.currentUser = username;
      return true;
    } else{
      throw "Please enter valid credentials!"
    }
  }
}
