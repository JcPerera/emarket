import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public userServices: UserServices, public postsService: PostServices) {
    var myUserId = userServices.fireAuth.currentUser.uid;
    this.displayUser(myUserId);
    this.listPosts(myUserId);
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

  /*listPosts(theUserId) {
    var that = this;
    this.postsService.listCurrentUsersPosts(theUserId).then(snapshot => {
      //empty this array first to avoid duplication of content when value changes in the database
      //so every time there is a change in the database, empty the array, fetch fresh data from db
      //this is because we are fetching data with on('value') inside listPostService()
      that.userPostsLists.length = 0;
      snapshot.forEach(function (childSnapshot) {
        var data = childSnapshot.val();
        data['key'] = childSnapshot.key;
        that.userPostsLists.push(data);
      });
    });
  }*/

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
    this.postsService.delete(myUserId, postid);
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
    this.postsService.ratingNode.child(theUserId).on('value', snapshot => {
      this.zone.run(() => {
        this.ratingComments.length = 0;
        snapshot.forEach(childSnapshot => {
          let data = childSnapshot.val();
          data['key'] = childSnapshot.key;
          this.userPostsLists.push(data);
        });
      });
    });
  }

}
