import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { UserServices } from '../../providers/user-services';
import { PostServices } from '../../providers/post-services';

import { PostPage } from "../../pages/post/post";
import { CommentsPage } from "../../pages/comments/comments";
/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [UserServices]
})
export class ProfilePage {
  private userPhotoUrl: any;
  private userDisplayName: any;
  private userPostsLists = [];
  private ratingComments = [];
  private zone: NgZone;
  private rate = [];
  private totalRate = 0;
  private avg = 0;
  private user: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userServices: UserServices,
    public alertCtrl: AlertController,
    public postsService: PostServices) {
    this.user = 'profile';
    var myUserId = userServices.fireAuth.currentUser.uid;
    this.displayUser(myUserId);
    this.listPosts(myUserId);
    this.getAvg(myUserId);
    this.listRatingComments(myUserId);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  signOut() {
    this.userServices.logoutUser();
  }

  displayUser(theUserId) {
    var that = this;
    this.userServices.viewUser(theUserId).then(snapshot => {
      that.userPhotoUrl = snapshot.val();
      that.userPhotoUrl = snapshot.val().photo || "img/profile.png";
      that.userDisplayName = snapshot.val().username || "No Name";
    })
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

  deletePost(postid: any) {
    var myUserId = this.userServices.fireAuth.currentUser.uid;
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Are you sure you want to delete this post ?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.postsService.delete(myUserId, postid);
          }
        }
      ]
    });
    confirm.present();

  }

  goToComments(key: any) {
    this.navCtrl.push(CommentsPage, key);
  }

  editPost(post: any) {
    this.navCtrl.push(PostPage, {
      item: post
    });
  }

  onModelChange(evt: any) {
    console.log(evt);
  }

  listRatingComments(theUserId) {
    this.zone = new NgZone({});
    this.postsService.ratingCommentNode.child(theUserId).on('value', snapshot => {
      this.zone.run(() => {
        this.ratingComments.length = 0;
        snapshot.forEach(childSnapshot => {
          let data = childSnapshot.val();
          data['key'] = childSnapshot.key;
          this.userServices.viewUser(childSnapshot.key).then(snapshot => {
            data['name'] = snapshot.val().username || "No Name";
            data['photo'] = snapshot.val().photo || "img/profile.png";
            this.ratingComments.push(data);
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

}
