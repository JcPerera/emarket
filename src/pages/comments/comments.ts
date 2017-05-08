import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { PostServices } from '../../providers/post-services';
import { UserServices } from '../../providers/user-services';

import { ProfilePage } from "../profile/profile";
import { UsersPage } from "../users/users";


/*
  Generated class for the Comments page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html'
})
export class CommentsPage {

  private postReplyLists = []
  private postBody: any;
  private userId: any;
  private postId: any;
  private userPhotoUrl: any;
  private userDisplayName: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public postsService: PostServices, public userServices: UserServices, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private viewCtrl: ViewController, ) {
    this.userId = userServices.fireAuth.currentUser;

    this.userServices.viewUser(this.userId.uid).then(snapshot => {
      this.userPhotoUrl = snapshot.val().photo || "img/profile.png";
      this.userDisplayName = snapshot.val().username || "No Name";
    })

    this.postId = this.navParams.get('key');
    this.listComments(this.postId);
  }

  listComments(postKey: any) {
    var that = this;
    this.postsService.listPostReplies(postKey).then(snapshot => {
      //empty this array first to avoid duplication of content when value changes in the database
      //so every time there is a change in the database, empty the array, fetch fresh data from db
      that.postReplyLists.length = 0;
      snapshot.forEach(function (childSnapshot) {
        var data = childSnapshot.val();
        data['key'] = childSnapshot.key;
        that.postReplyLists.push(data);
      });
    });
  }

  addNewComment() {
    //add preloader
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: 'Adding your Comment..'
    });
    loading.present();
    //call the service
    this.postsService.createCommentService(this.userId.uid, this.postBody, this.userDisplayName, this.userPhotoUrl, this.postId).then(() => {

      //clear the fields
      this.postBody = "";

      this.listComments(this.postId);
      //add toast
      loading.dismiss().then(() => {
        //show pop up
        let alert = this.alertCtrl.create({
          title: 'Done!',
          subTitle: 'Comment successfully Added',
          buttons: ['OK']
        });
        alert.present();
      })
    }, error => {
      //show pop up
      loading.dismiss().then(() => {
        let alert = this.alertCtrl.create({
          title: 'Error adding new Comment',
          subTitle: error.message,
          buttons: ['OK']
        });
        alert.present();
      })
    });
  }

  goToUser(post){
    if(post.uid==this.userId.uid){
      this.navCtrl.push(ProfilePage);
    }
    else{
      this.navCtrl.push(UsersPage,{
        item: post
      })
    }
  }
}
