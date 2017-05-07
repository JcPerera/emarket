import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { UserServices } from '../../providers/user-services';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [UserServices]
})
export class LoginPage {

  public emailField: any;
  public passwordField: any;
  public cUser: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userServices: UserServices,
    public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  // User login Function
  submitLogin() {
    let loader = this.loadCtrl.create({
      content: "Authenticating ...",
      dismissOnPageChange: true,
    });
    loader.present();
    this.userServices.loginUser(this.emailField, this.passwordField).then(authData => {
      // this.navCtrl.setRoot(Page1);
    }, error => {
      loader.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: error.message,
        buttons: ['OK']
      });
      alert.present();
    });

  }

  // Register New Users Function
  submitRegister() {
    this.navCtrl.push(RegisterPage);
  }


  fbLogIn() {
    let loader = this.loadCtrl.create({
      content: "Logging in using Facebook",
      dismissOnPageChange: true,
    });
    loader.present();
    this.userServices.signFacebookUser();
  }

}
