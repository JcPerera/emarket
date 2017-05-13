import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { EmailComposer } from '@ionic-native/email-composer';
import { Preloader } from "../../providers/preloader";

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
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation,
    private emailComposer: EmailComposer,
    public preloader: Preloader) {

    this.lngLat = this.navParams.get('item');
    this.getGeolocation();
    this.sendMail();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.initMap(this.lngLat);
  }

  initMap(location) {
    let latLng = new google.maps.LatLng(location.lat, location.lng);

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

  getGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp.coords.latitude);
      console.log(resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });
  }

  sendMail() {
    let email = {
      to: 'jcscorpio@ymail.com',
      cc: 'jcperera.online@gmail.com',
      bcc: [],
      attachments: [],
      subject: 'Cordova Check',
      body: 'How are you? Nice greetings from Leipzig',
      isHtml: true
    };
    this.emailComposer.isAvailable().then((available: boolean) => {
      if (available) {
        this.preloader.displayAlert('Ok', 'WOrking');
        this.emailComposer.open(email);
      }
      else{
        this.preloader.displayAlert('No', ' not WOrking');
      }
    });    
  }

}
