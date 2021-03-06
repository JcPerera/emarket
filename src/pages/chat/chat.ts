import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserServices } from "../../providers/user-services";
import { ChatServices } from "../../providers/chat-services";

/*
  Generated class for the Chat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {

  private sender: any;
  private currentUserId: any;
  private zone: NgZone;
  private chatList = [];
  private userPhotoUrl: any;
  private userDisplayName: any;
  private msg: any;
  private user: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userServices: UserServices,
    public chatServices: ChatServices) {
    this.sender = this.navParams.get('item');
    if (this.sender.uid) {
      this.user = this.sender.uid;
    }
    else {
      this.user = this.sender.key;
    }   

    this.currentUserId = this.userServices.fireAuth.currentUser.uid;
    this.ListChat();

    console.log(this.user);
    console.log(this.currentUserId);
  }

  ListChat() {
    this.zone = new NgZone({});
    this.chatServices.chatNode.child(this.currentUserId).child(this.user).off();
    this.chatServices.chatNode.child(this.currentUserId).child(this.user).on('value', snapshot => {
      this.zone.run(() => {
        this.chatList.length = 0;
        snapshot.forEach(childSnapshot => {
          let data = childSnapshot.val();
          let res = childSnapshot.val().sender;
          if (res == this.currentUserId) {
            this.userServices.viewUser(res).then(snapshot => {
              this.userPhotoUrl = snapshot.val().photo;
              this.userDisplayName = snapshot.val().username;
              data['photoURL'] = this.userPhotoUrl;
              data['displayName'] = this.userDisplayName;
              data['key'] = childSnapshot.key;
              this.chatList.push(data);
            })
          }
          else {
            this.userServices.viewUser(this.user).then(snapshot => {
              this.userPhotoUrl = snapshot.val().photo;
              this.userDisplayName = snapshot.val().username;
              data['photoURL'] = this.userPhotoUrl;
              data['displayName'] = this.userDisplayName;
              data['key'] = childSnapshot.key;
              this.chatList.push(data);

            })
          }
        });
      });
    });
  }

  updateHistory() {
    this.userServices.viewUser(this.user).then((snapshot) => {
      this.chatServices.historyNode.child(this.currentUserId).child(this.user).set({
        name: snapshot.val().username,
        photo: snapshot.val().photo,
        time: "time"
      })
    });

    this.userServices.viewUser(this.currentUserId).then((snapshot) => {
      this.chatServices.historyNode.child(this.user).child(this.currentUserId).set({
        name: snapshot.val().username,
        photo: snapshot.val().photo,
        time: "time"
      })
    });

  }

  uploadChat() {
    this.zone = new NgZone({});
     this.zone.run(() => {
    var chatRoom = this.chatServices.chatNode.child(this.currentUserId).child(this.user).push();
    var date = new Date().toString();
    var activity: number;
    activity = new Date().getTime().valueOf();
    activity = 0 - activity;
    chatRoom.set({
      message: this.msg,
      sender: this.currentUserId,
      time: date,
      activity: activity
    });

    var chatRoom2 = this.chatServices.chatNode.child(this.user).child(this.currentUserId).push();
    chatRoom2.set({
      message: this.msg,
      sender: this.currentUserId,
      time: date,
      activity: activity
    });
    this.msg = "";
    this.updateHistory();
     });
  }

}
