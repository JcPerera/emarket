import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { UserServices } from '../../providers/user-services';
import { Preloader } from '../../providers/preloader';
/*
  Generated class for the DeliveryForm page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare let map;
declare let google;

@Component({
  selector: 'page-delivery-form',
  templateUrl: 'delivery-form.html'
})

export class DeliveryFormPage {
  public userId: any;
  public currentUser: any;
  public sname: any;
  public bname: any;
  public stel: any;
  public btel: any;
  //public location:any;
  public weigh: any;
  public fee: any;
  public Vehicle_type: any;
  public user: any;

  todo: String;
  homeMap = { from: '', to: '' };

  @ViewChild('map') mapElement;
  map: any;
  directionsService: any;
  directionsDisplay: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userServices: UserServices,
    public geolocation: Geolocation,
    public preloader: Preloader) {
    this.userId = this.navParams.get('item');
    this.bname = this.userId.username;
    this.setUsers();
    //this.getGeolocation();
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {

    let latLng = new google.maps.LatLng(6.9271, 79.8612);

    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: true
    });

    let mapOptions = {
      center: latLng,
      zoom: 13,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.directionsDisplay.setMap(this.map);

    //this.calcDisplayRoute(this.directionsService,this.directionsDisplay);
  }

  calcDisplayRoute(directionService, directionDisplay) {
    console.log("calcDisplay");
    directionService.route({
      origin: this.homeMap.from,
      destination: this.homeMap.to,
      travelMode: 'DRIVING'
    }, function (response, status) {
        console.log(status);
        console.log(response);
      if (status == 'OK') {
        directionDisplay.setDirections(response);
      } else {
        console.log(status);
      }

    });
  }

  setUsers() {
    var userid = this.userServices.fireAuth.currentUser.uid;
    this.userServices.viewUser(userid).then((result)=>{
      this.sname = result.val().username;
    })
  }

  homeMapSearchBtn() {
    this.calcDisplayRoute(this.directionsService, this.directionsDisplay);
  }

  getGeolocation() {
    this.geolocation.getCurrentPosition().then((position) => {
      console.log(position.coords.latitude + " " + position.coords.longitude);
    }
    );
  }


  sendData() {
    this.preloader.displayAlert('Delivery', 'Your Deliver is ready!')
    var data = {
      ssname: this.sname,
      stelephone: this.stel,
      bsname: this.bname,
      btelephone: this.btel,
      //location: this.location,
      weigh: this.weigh,
      fee: this.fee,
      vehicle: this.Vehicle_type
    }

    firebase.database().ref('/data').push(data);
  }

}


