import { Component, NgZone } from '@angular/core';
import { NavController, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { PostPage } from '../post/post';
import { PostServices } from '../../providers/post-services';
import { UserServices } from '../../providers/user-services';
import { CommentsPage } from '../comments/comments';
import { UsersPage } from "../users/users";
import { ProfilePage } from "../profile/profile";
import { SuggestionsPage } from '../suggestions/suggestions';


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

getItems(ev: any) {
    // Reset items back to all of the items
    this.ListPosts();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.userPostsLists = this.userPostsLists.filter((item) => {
        return ((item.title.toLowerCase().indexOf(val.toLowerCase()) > -1)||(item.subCategory.toLowerCase().indexOf(val.toLowerCase()) > -1));
      })
    }
  }

 
  goToPost() {
    this.navCtrl.push(PostPage);
  }

  goToComments(key: any) {
    this.navCtrl.push(CommentsPage, key);
  }

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

  goToUsers(post) {
    if (post.uid == this.userId.uid) {
      this.navCtrl.push(ProfilePage)
    } else {
      this.navCtrl.push(UsersPage, {
        item: post
      });
    }
  }

  goToSuggestions(post){
    this.navCtrl.push(SuggestionsPage,{
      item: post
    });
  }

}
