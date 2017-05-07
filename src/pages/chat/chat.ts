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


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userServices: UserServices,
    public chatServices: ChatServices) {
    this.sender = this.navParams.get('item');
    this.currentUserId = this.userServices.fireAuth.currentUser.uid;
    this.ListChat();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  ListChat() {
    this.zone = new NgZone({});
    this.chatServices.chatNode.child(this.currentUserId).child(this.sender.key).on('value', snapshot => {
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
            this.userServices.viewUser(this.sender.key).then(snapshot => {
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

  uploadChat() {
    var chatRoom = this.chatServices.chatNode.child(this.currentUserId).child(this.sender.key).push();
    var date = new Date().toString();
    var activity:number;
    activity = new Date().getTime().valueOf();  
    activity = 0 - activity;
    console.log(activity);
    chatRoom.set({
      message: this.msg,
      sender: this.currentUserId,
      time: date,
      activity: activity
    });

    var chatRoom2 = this.chatServices.chatNode.child(this.sender.key).child(this.currentUserId).push();
    chatRoom2.set({
      message: this.msg,
      sender: this.currentUserId,
      time: date,
      activity: activity
    });
    console.log(date);
    this.msg = "";
  }

}
