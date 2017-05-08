import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserServices } from "../../providers/user-services";

import { DeliveryFormPage } from "../delivery-form/delivery-form";

/*
  Generated class for the Delivery page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-delivery',
  templateUrl: 'delivery.html'
})
export class DeliveryPage {
  public usersLists = [];

  constructor(public navCtrl: NavController, 
  public navParams: NavParams, 
  public userServices: UserServices) {
    this.loadUsers();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeliveryPage');
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
        this.usersLists.push(data);

      });
    })
  }

  deliveryForm(user) {
    this.navCtrl.push(DeliveryFormPage, {
      item: user
    });
  }

  add(va : any){
    console.log(va);
  }

}
