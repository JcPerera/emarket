import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { UserServices } from '../../providers/user-services';
import { Preloader } from '../../providers/preloader';
import { Camera } from 'ionic-native';


/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [UserServices]
})
export class RegisterPage {
  public emailField: any;
  public passwordField: any;
  public rePasswordField: any;
  public displayName: any;
  public fname: any;
  public lname: any;
  public address: any;
  public cameraImage: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userServices: UserServices,
    public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public preloader: Preloader) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  // Register New Users Function 
  signUserUp() {
    this.userServices.signUpUser(this.emailField, this.passwordField, this.displayName, this.fname, this.lname, this.address, this.cameraImage);
    this.navCtrl.pop();
  }

  showForgotPassword() {
    let prompt = this.alertCtrl.create({
      title: 'Enter Your Email',
      message: "A new password will be sent to your E-Mail",
      inputs: [
        {
          name: 'recoverEmail',
          placeholder: 'you@example.com'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: data => {
            let loader = this.loadCtrl.create({
              content: "Reseting your Password...",
              dismissOnPageChange: true,
            });
            loader.present();
            console.log('Submit clicked');
            this.userServices.forgotPasswordUser(data.recoverEmail).then(() => {
              loader.dismiss().then(() => {
                let alert = this.alertCtrl.create({
                  title: 'Check Your Email',
                  subTitle: 'Password reset Sucessful',
                  buttons: ['OK']
                });
                alert.present();
              })
            }, error => {
              loader.dismiss().then(() => {
                let alert = this.alertCtrl.create({
                  title: 'Error resetting Password',
                  subTitle: error.message,
                  buttons: ['OK']
                });
                alert.present();
              })
            });
          }
        }
      ]
    });
    prompt.present();
  }

  checkEmpty() {
    if (this.emailField && this.passwordField && this.rePasswordField && this.displayName && this.fname && this.lname && this.address && this.cameraImage) {
      if (this.passwordField.toString().length >= 6) {
        if (this.passwordField == this.rePasswordField) {
           this.signUserUp();
        }
        else {
          this.preloader.displayAlert('Error', 'Passwords does not Match');
        }
      }
      else {
        this.preloader.displayAlert('Error', 'Password needs to be atleast 6 Characters');
      }
    }
    else {
      this.preloader.displayAlert('Error', 'One or More Fields are Empty');
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
    });
  }



}
