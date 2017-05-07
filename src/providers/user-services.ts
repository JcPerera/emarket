import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import firebase from 'firebase';
import 'rxjs/add/operator/map';
import { Preloader } from "../providers/preloader";
import { Platform } from 'ionic-angular';
import { Facebook } from 'ionic-native';



/*
  Generated class for the UserServices provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserServices {

  public fireAuth: any;
  public userProfile: any;

  constructor(public http: Http,
    public preloader: Preloader,
    public platform: Platform) {
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('users');
    console.log('Hello UserServices Provider');
  }

  //
  viewUser(userId: any) {
    var userRef = this.userProfile.child(userId);
    return userRef.once('value');
  }

  // SignUp new users and log them in and create a new user profile in the database
  signUpUser(email: string, password: string, userName: string, fname: string, lname: string, address: string, cameraPhoto: any) {
    this.preloader.displayPreloader('Authenticating ...');
    this.fireAuth.createUserWithEmailAndPassword(email, password).then((newUserCreated) => {
      this.fireAuth.signInWithEmailAndPassword(email, password).then((authenticatedUser) => {
        this.uploadImage(cameraPhoto, authenticatedUser.uid).then((snapshot: any) => {
          var uploadedImage;
          uploadedImage = snapshot.downloadURL;
          this.userProfile.child(authenticatedUser.uid).set({
            email: email,
            username: userName,
            name: {
              first: fname,
              middle: lname
            },
            address: address,
            photo: uploadedImage
          }).then(() => {
          }, error => {
            this.preloader.hidePreloader();
            this.preloader.displayAlert('Error', error.message);
          });
        })
      });
    });
  }

  uploadImage(imageString: any, uid: any): Promise<any> {
    let image: string = 'profilePic.jpg',
      storageRef: any,
      parseUpload: any;

    return new Promise((resolve, reject) => {
      storageRef = firebase.storage().ref('users/' + uid + "/" + image);
      parseUpload = storageRef.putString(imageString, 'data_url');

      parseUpload.on('state_changed', (_snapshot) => {
        // We could log the progress here IF necessary
        // console.log('snapshot progess ' + _snapshot);
      },
        (_err) => {
          reject(_err);
        },
        (success) => {
          resolve(parseUpload.snapshot);
        });
    });
  }

  // login user
  loginUser(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  // logout users 
  logoutUser() {
    return this.fireAuth.signOut();
  }

  // send email to the user with reset password
  forgotPasswordUser(email: any) {
    return this.fireAuth.sendPasswordResetEmail(email);
  }


  signFacebookUser() {
    var provider = new firebase.auth.FacebookAuthProvider();
    var that = this;
    if (this.platform.is('cordova')) {
      console.log('cordova');
      Facebook.login(['email', 'public_profile']).then((res) => {
        const facebookCreds = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        console.log(facebookCreds);
        return firebase.auth().signInWithCredential(facebookCreds).then((result) => {
          console.log(result);
          var res = result.displayName.split(" ");;
          console.log(res);
          this.userProfile.child(result.uid).set({
            email: result.email,
            photo: result.photoURL,
            username: result.displayName,
            name: {
              first: res[0],
              middle: res[1],
            },
          });
        }).catch(function (error) {
          console.log(error);
        });
      })
    }
    else {
      return firebase.auth().signInWithPopup(provider).then(function (result) {
        if (result.user) {
          var user = result.user;
          var res = result.user.displayName.split(" ");
          console.log(res);
          that.userProfile.child(user.uid).set({
            email: user.email,
            photo: user.photoURL,
            username: user.displayName,
            name: {
              first: res[0],
              middle: res[1],
            },
          });
        }
      }).catch(function (error) {
        console.log(error);
      });
    }
  }

}
