import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserServices } from '../../providers/user-services';
import { PostServices } from '../../providers/post-services';
import { CommentsPage } from "../comments/comments";
import { ChatPage } from "../chat/chat";
import { DeliveryFormPage } from "../delivery-form/delivery-form";


/*
  Generated class for the Users page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-users',
  templateUrl: 'users.html'
})
export class UsersPage {
  private zone: NgZone;
  private userPostsLists = [];
  public userProfile: any;
  private rate = [];
  private ratingComments = [];
  private totalRate = 0;
  private avg = 0;
  private currentUser: any;
  private comment: any;
  private visible: boolean;
  private temp: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userServices: UserServices,
    public postsService: PostServices
  ) {
    this.currentUser = this.userServices.fireAuth.currentUser.uid;
    this.userProfile = this.navParams.get('item');
    this.temp = this.userProfile.uid;
    if (this.userProfile.uid) {
      console.log('1st ' + this.userProfile.uid)
      this.listPosts(this.userProfile.uid);
      this.listPosts(this.userProfile.uid);
      this.getAvg(this.userProfile.uid);
      this.listRatingComments(this.userProfile.uid);
    }
    else {
      this.visible = true;
      console.log('2nd ' + this.userProfile.key)
      this.listPosts(this.userProfile.key);
      this.listPosts(this.userProfile.key);
      this.getAvg(this.userProfile.key);
      this.listRatingComments(this.userProfile.key);
    }
  }


  listPosts(theUserId) {
    this.zone = new NgZone({});
    this.postsService.usersPostNode.child(theUserId).on('value', snapshot => {
      this.zone.run(() => {
        this.userPostsLists.length = 0;
        snapshot.forEach(childSnapshot => {
          let data = childSnapshot.val();
          data['key'] = childSnapshot.key;
          this.userPostsLists.push(data);
        });
      });
    });
  }

  goToComments(key: any) {
    this.navCtrl.push(CommentsPage, key);
  }

  listRatingComments(theUserId) {
    this.zone = new NgZone({});
    this.postsService.ratingCommentNode.child(theUserId).on('value', snapshot => {
      this.zone.run(() => {
        this.ratingComments.length = 0;
        snapshot.forEach(childSnapshot => {
          let data = childSnapshot.val();
          console.log(data);
          data['key'] = childSnapshot.key;
          this.userServices.viewUser(childSnapshot.key).then(snapshot => {
            data['name'] = snapshot.val().username || "No Name";
            data['photo'] = snapshot.val().photo || "img/profile.png";
            if (childSnapshot.val().comment) {
              this.ratingComments.push(data);
            }
            else {
            }
          })
        });
      });
    });
  }

  getAvg(theUserId) {
    this.zone = new NgZone({});
    this.zone.run(() => {
      this.postsService.ratingNode.child(theUserId).once('value').then((snapshot) => {
        snapshot.forEach(childSnapshot => {
          let rating = childSnapshot.val().rating;
          this.rate.push(rating);
        });
        var length = this.rate.length;
        for (var i = 0; i < length; i++) {
          var ratings = this.rate.pop();
          this.totalRate = this.totalRate + ratings;
        }
        this.avg = this.totalRate / length;
        console.log(this.avg);
      });

    });
  }

  onModelChange(evt: any) {
    if (this.userProfile.uid) {
      this.postsService.ratingNode.child(this.userProfile.uid).child(this.currentUser).set({
        rating: evt
      })
    }
    else {
      this.postsService.ratingNode.child(this.userProfile.key).child(this.currentUser).set({
        rating: evt
      })
    }
  }

  rateComment() {
    if (this.userProfile.uid) {
      this.postsService.ratingCommentNode.child(this.userProfile.uid).child(this.currentUser).set({
        comment: this.comment
      })
    }
    else {
      this.postsService.ratingCommentNode.child(this.userProfile.key).child(this.currentUser).set({
        comment: this.comment
      })
    }
    this.comment = "";
  }

  goToChat() {
    this.navCtrl.push(ChatPage, {
      item: this.userProfile
    });
  }

  goToDeliveryForm() {
    this.navCtrl.push(DeliveryFormPage, {
      item: this.userProfile
    });
  }
}
