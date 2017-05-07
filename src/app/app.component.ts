import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Page1 } from '../pages/page1/page1';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { DeliveryPage } from "../pages/delivery/delivery";
import { RecentPage } from "../pages/recent/recent";


import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyADoR-z6B0drriOvWlxCmC2IuSIto25lYA",
  authDomain: "pdmionic-55b9f.firebaseapp.com",
  databaseURL: "https://pdmionic-55b9f.firebaseio.com",
  projectId: "pdmionic-55b9f",
  storageBucket: "pdmionic-55b9f.appspot.com",
  messagingSenderId: "459805504241"
};

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  zone: NgZone;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform) {
    firebase.initializeApp(config);
    this.zone = new NgZone({});
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: Page1 },
      { title: 'Profile', component: ProfilePage },
      { title: 'Delivery', component: DeliveryPage },
      { title: 'Chat', component: RecentPage }
      


    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      firebase.auth().onAuthStateChanged((user) => {
        this.zone.run(() => {
          if (!user) {
            this.rootPage = LoginPage;

          } else {
            this.rootPage = Page1;

          }
        });
      });
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
