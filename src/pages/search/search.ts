import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { UsersPage } from "../users/users";
import { UserServices } from "../../providers/user-services";

/*
  Generated class for the Search page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  public usersLists = [];
  public currentUser: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userServices: UserServices) {
    this.currentUser = this.userServices.fireAuth.currentUser.uid;
    this.loadUsers();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.loadUsers();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.usersLists = this.usersLists.filter((item) => {
        return (item.username.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  loadUsers() {
    this.userServices.userProfile.on('value', snapshot => {
      this.usersLists.length = 0;
      snapshot.forEach(childSnapshot => {
        let data = childSnapshot.val();
        data['key'] = childSnapshot.key;
        if (childSnapshot.key == this.currentUser) {

        }
        else {
          this.usersLists.push(data);
        }
      });
    })
  }

  goToUsers(user) {
    this.navCtrl.push(UsersPage, {
      item: user
    });
  }

  add(va: any) {
    console.log(va);
  }

}
