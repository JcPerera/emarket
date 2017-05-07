import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the DeliveryForm page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare var google;

@Component({
  selector: 'page-delivery-form',
  templateUrl: 'delivery-form.html'
})
export class DeliveryFormPage {
  public userId: any;
  @ViewChild('map') mapElement;
  map: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.userId=this.navParams.get('item');
    console.log(this.userId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeliveryFormPage');
    this.initMap();
  }

  run(){
    console.log(this.userId);
  }

  initMap(){
    let latLng = new google.maps.LatLng(-34.9290, 138.6010);
   // var myLatLng = {lat: -25.363, lng: 131.044};

    let mapOptions ={
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
