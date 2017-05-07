import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserServices } from "../../providers/user-services";

import { ChatPage } from "../chat/chat";


/*
  Generated class for the Recent page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-recent',
  templateUrl: 'recent.html'
})
export class RecentPage {
  public currentUserId: any;
  private zone: NgZone;
  private usersLists = [];
 

  constructor(public navCtrl: NavController, public navParams: NavParams, public userServices: UserServices) {
    this.loadUsers();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecentPage');
  }


  loadUsers() {
    this.zone = new NgZone({});
    this.userServices.userProfile.on('value', snapshot => {
      this.zone.run(() => {
        this.usersLists.length = 0;
        snapshot.forEach(childSnapshot => {
          let data = childSnapshot.val();
          data['key'] = childSnapshot.key;
          this.usersLists.push(data);
        });
      });
    })
  }

  goToChat(user: any) {
    this.navCtrl.push(ChatPage, {
      item: user
    });
  }

}
