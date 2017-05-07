import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import firebase from 'firebase';


/*
  Generated class for the ChatServices provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ChatServices {

public chatNode: any;
  constructor(public http: Http) {
    this.chatNode = firebase.database().ref('chat');
    console.log('Hello ChatServices Provider');
  }

 
}
