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
declare let map;
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  public lngLat: any;

  @ViewChild('map') mapElement;
  map: any;
  directionsService: any;
  directionsDisplay: any;
  public destination1: any;
  public destination2: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation,
    private emailComposer: EmailComposer,
    public preloader: Preloader) {
    this.lngLat = this.navParams.get('item');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.initMap(this.lngLat);
  }

  initMap(location) {
    let latLng = new google.maps.LatLng(location.lat, location.lng);

    let mapOptions = {
      center: latLng,
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: 'Hello World!'
    });

    this.geolocation.getCurrentPosition().then((resp) => {
      //console.log(resp.coords.latitude);
      // console.log(resp.coords.longitude);
      this.destination1 = resp.coords.latitude;
      this.destination2 = resp.coords.longitude;



      new google.maps.Marker({
        position: new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude),
        map: this.map,
        title: 'Hello World!'
      });


      let watch = this.geolocation.watchPosition();
      watch.subscribe((data) => {
        // data can be a set of coordinates, or an error (if an error occurred).
        // data.coords.latitude
        // data.coords.longitude
      });


      var origin1 = new google.maps.LatLng(location.lat, location.lng);
      var destination = new google.maps.LatLng(this.destination1, this.destination2);

      var service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin1],
          destinations: [destination],
          travelMode: 'DRIVING',
        }, callback);

      function callback(response, status) {
        var info =response.rows[0].elements[0].distance.text;
        var info2 =response.rows[0].elements[0].duration.text;
        

        console.log(info+ "  "+ info2);
      }

    }).catch((error) => {
      console.log('Error getting location', error);
    });



  }





}
