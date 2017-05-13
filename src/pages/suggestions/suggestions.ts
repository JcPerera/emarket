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

  getSuggestions() {
    this.postServices.suggestionNode.once('value').then((snapshot) => {
      snapshot.forEach(childSnapshot => {
        var key1 = childSnapshot.key;
        childSnapshot.forEach(child => {
          var key2 = child.key;
          var cat = child.val().catogeries;
          cat.forEach(result => {
            if (result.subCat == this.post.subCategory) {
              this.postServices.suggestionNode.child(key1).child(key2).once('value').then((result) => {
                var company = result.val();
                this.companyPost.push(company);
              });
            }
          });
        });
      })
    });
  }

  goToMap(post) {
    this.navCtrl.push(MapPage, {
      item: post
    });
  }

}
