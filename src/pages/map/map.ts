import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Map page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare let google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  public lngLat: any;

  @ViewChild('map') mapElement;
  map: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) { 
    this.lngLat = this.navParams.get('item');
    console.log(this.lngLat);
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.initMap(this.lngLat);
  }

  initMap(location) {
    let latLng = new google.maps.LatLng(location.lat, location.lng);
    // var myLatLng = {lat: -25.363, lng: 131.044};

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: 'Hello World!'
    });
  }
}
