import { Component, NgZone } from '@angular/core';
import { NavController, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { PostPage } from '../post/post';
import { PostServices } from '../../providers/post-services';
import { UserServices } from '../../providers/user-services';
import { CommentsPage } from '../comments/comments';


@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html',
  providers: [PostServices, UserServices]
})
export class Page1 {

  private userPostsLists = [];
  private userProfileLists: any;
  private userId: any;
  private zone: NgZone;

  constructor(public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController,
    public postsService: PostServices,
    public userServices: UserServices) {
    this.userProfileLists = userServices.userProfile;
    this.userId = userServices.fireAuth.currentUser;
    this.ListPosts();
  }

  goToPost() {
    this.navCtrl.push(PostPage);
  }

  goToComments(key: any) {
    this.navCtrl.push(CommentsPage, key);
  }

  /*
   listPosts() {
     var that = this;
     this.postsService.listPostService().then(snapshot => {
       //empty this array first to avoid duplication of content when value changes in the database
       //so every time there is a change in the database, empty the array, fetch fresh data from db
       //this is because we are fetching data with on('value') inside listPostService()
       that.userPostsLists.length = 0;
       snapshot.forEach(function (childSnapshot) {
         var data = childSnapshot.val();
         data['key'] = childSnapshot.key;
         that.postKey = childSnapshot.key;
         that.userPostsLists.push(data);
       });
       console.log(snapshot + " list");
     });
   } */

  ListPosts() {
    this.zone = new NgZone({});
    this.postsService.postsNode.orderByChild("activity").on('value', snapshot => {
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

}
