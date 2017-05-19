import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { PostServices } from "../../providers/post-services";
import { UserServices } from "../../providers/user-services";
import { Preloader } from "../../providers/preloader";

import { Camera } from 'ionic-native';


/*
  Generated class for the Post page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {
  private postBody: any;
  private userId: any;
  private category: any;
  private subCategory: any;
  private title: any;
  public cameraImage: String;
  public username: string;
  public profilePic: any;
  public subArray = ['TVs', 'Mobiles', 'Laptops', 'Speakers'];
  public catArray = ["Electronics", "Home appliances", "Clothes", "Others"];
  public post: any;
  public visible: Boolean;
  public flag = false;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public postsService: PostServices,
    public alertCtrl: AlertController,
    public userServices: UserServices,
    public preloader: Preloader) {
    this.userId = userServices.fireAuth.currentUser;
    this.visible = false;
    this.post = this.navParams.get('item')
    this.checkEditable(this.post);

  }


  updateSelectedValue(event: string): void {
    if (event == "Electronics") {
      this.subArray = ['TVs', 'Mobiles', 'Laptops', 'Speakers'];
    }
    else if (event == "Home appliances") {
      this.subArray = ['CupBoards', 'Beds', 'Tables', 'Mugs'];
    }
    else if (event == "Clothes") {
      this.subArray = ['Shirts', 'T Shirts', 'Frocks', 'Blouse', 'Bags', 'Footware'];
    }
    else if (event == "Others") {
      this.subArray = ['Books', 'Other'];
    }
  }

  selectImage(): Promise<any> {
    return new Promise(resolve => {
      let cameraOptions = {
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: Camera.DestinationType.DATA_URL,
        quality: 100,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: true
      };

      Camera.getPicture(cameraOptions)
        .then((data) => {
          this.cameraImage = "data:image/jpeg;base64," + data;
          resolve(this.cameraImage);
        });

      this.flag = true;
    });
  }

  checkValidNew() {
    if (this.category && this.subArray && this.title && this.cameraImage && this.postBody) {
      this.addNewPost();
    }
    else {
      this.preloader.displayAlert('Error', 'One or More Fields are Empty');
    }
  }

  checkValidEdit() {
    if (this.category && this.subArray && this.title && this.cameraImage && this.postBody) {
      this.editUserPost();
    }
    else {
      this.preloader.displayAlert('Error', 'One or More Fields are Empty');
    }
  }

  addNewPost() {
    var that = this;
    this.userServices.viewUser(this.userId.uid).then(snapshot => {
      that.profilePic = snapshot.val().photo || "img/profile.png";
      that.username = snapshot.val().username || "No Name";
      let confirm = this.alertCtrl.create({
        title: 'Add new Post',
        message: 'Are you Sure you want to add this Post ?',
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
              this.postsService.createPostService(that.userId.uid, that.postBody, that.username, that.profilePic, that.category, that.subCategory, that.title, that.cameraImage, that.flag);
            }
          }
        ]
      });
      confirm.present();
    })
  }

  editUserPost() {
    var that = this;
    this.userServices.viewUser(this.userId.uid).then(snapshot => {
      that.profilePic = snapshot.val().photo || "img/profile.png";
      that.username = snapshot.val().username || "No Name";
      let confirm = this.alertCtrl.create({
        title: 'Edit This Post',
        message: 'Are you sure you want to edit this post ?',
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
              this.postsService.editPostService(that.userId.uid, that.postBody, that.username, that.profilePic, that.category, that.subCategory, that.title, that.cameraImage, this.post.key, this.flag);
              console.log('Agree clicked');
            }
          }
        ]
      });
      confirm.present();
    })
  }


  checkEditable(id: any) {
    if (id) {
      this.category = id.category;
      this.subCategory = id.subCategory;
      this.postBody = id.body;
      this.title = id.title;
      this.cameraImage = id.postPhoto;
      this.visible = true;
    }
    else {
    }
  }

}
