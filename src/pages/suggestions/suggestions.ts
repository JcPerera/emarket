import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PostServices } from '../../providers/post-services';
import { MapPage } from '../map/map';

/*
  Generated class for the Suggestions page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare var google;
@Component({
  selector: 'page-suggestions',
  templateUrl: 'suggestions.html'
})
export class SuggestionsPage {

  public companyPost = [];
  public post: any;
  @ViewChild('map') mapElement;
  map: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public postServices: PostServices) {
    this.post = this.navParams.get('item');
    this.getSuggestions();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeliveryFormPage');
  }

  getSuggestions() {
    this.postServices.suggestionNode.once('value').then((snapshot) => {
      var data;
      snapshot.forEach(childSnapshot => {
        var key = childSnapshot.key;
        var cat = childSnapshot.val().catogeries;
        var name = childSnapshot.val().cname;
        cat.forEach(result => {
          if (result.subCat == this.post.subCategory) {
            this.postServices.suggestionNode.child(key).once('value').then((result) => {
              var company = result.val();
              this.companyPost.push(company);
            })
          }
        })
      })
    })
  }

  goToMap(post) {
    this.navCtrl.push(MapPage, {
      item: post
    });
  }

}
