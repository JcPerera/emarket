import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
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
  public zone: NgZone;
  //public location:any;
  public weigh: any;
  public fee: any;
  public Vehicle_type: any;
  public user: any;
  public distance: any;

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
    public alertCtrl: AlertController,
    public preloader: Preloader) {
    this.userId = this.navParams.get('item');
    console.log(this.userId);
    this.bname = this.userId.username;
    console.log(this.getRandomInt(50, 100));
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

  calcDisplayRoute(directionService, directionDisplay, weigh, type) {
    this.zone = new NgZone({});
    this.zone.run(() => {
      directionService.route({
        origin: this.homeMap.from,
        destination: this.homeMap.to,
        travelMode: 'DRIVING'
      }, callback);

      function callback(response, status) {
        console.log(response);
        if (status == 'OK') {
            var dist = response.routes[0].legs[0].distance.text;
          directionDisplay.setDirections(response);
          //dist = dist.toString().replace('km', '');
        } else {
          console.log(status);
        }
      };
    });
  }




  setUsers() {
    var userid = this.userServices.fireAuth.currentUser.uid;
    this.userServices.viewUser(userid).then((result) => {
      this.sname = result.val().username;
    })
  }

  homeMapSearchBtn() {
    this.zone = new NgZone({});
    this.zone.run(() => {
      this.calcDisplayRoute(this.directionsService, this.directionsDisplay, this.weigh, this.Vehicle_type);
      if (this.Vehicle_type == 'van') {
        if (this.weigh < 1) {
          this.fee = this.getRandomInt(500, 750);
        }
        else if (this.weigh >= 1 && this.weigh < 5) {
          this.fee = this.getRandomInt(750, 1000);
        }
        else if (this.weigh >= 5 && this.weigh < 10) {
          this.fee = this.getRandomInt(1000, 1250);
        }
        else if (this.weigh >= 10) {
          this.preloader.displayAlert('Sorry', 'Please try using a Different delivery method')
        }
      }
      else if (this.Vehicle_type == 'lorry') {
        if (this.weigh < 10) {
          this.fee = this.getRandomInt(2000, 2250);
        }
        else if (this.weigh >= 10 && this.weigh < 15) {
          this.fee = this.getRandomInt(2250, 2500);
        }
        else if (this.weigh >= 15 && this.weigh < 20) {
          this.fee = this.getRandomInt(2500, 2750);
        }
        else if (this.weigh >= 20) {
          this.preloader.displayAlert('Sorry', 'Please try using a Different delivery method')
        }
      }
      else if (this.Vehicle_type == 'truk') {
        if (this.weigh < 20) {
          this.fee = this.getRandomInt(3000, 3500);
        }
        else if (this.weigh >= 20 && this.weigh < 40) {
          this.fee = this.getRandomInt(3500, 4000);
        }
        else if (this.weigh >= 40 && this.weigh < 60) {
          this.fee = this.getRandomInt(4000, 5000);
        }
        else if (this.weigh >= 20) {
          this.preloader.displayAlert('Sorry', 'We cannot deliver your item due to its weight')
        }
      }

    });
  }

  getGeolocation() {
    this.geolocation.getCurrentPosition().then((position) => {
      console.log(position.coords.latitude + " " + position.coords.longitude);
    }
    );
  }


  sendData() {
    var userid = this.userServices.fireAuth.currentUser.uid;
   
    var data = {
      destination: this.homeMap.to,
      origin:this.homeMap.from,
      ssname: this.sname,
      recepID: this.userId.key,
      senderID: userid,
      stelephone: this.stel,
      bsname: this.bname,
      fee: this.fee,
      status:'pending',
      weigh: this.weigh,
      vehicle: this.Vehicle_type
    }
    let confirm = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure you want to add this delivery ?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            firebase.database().ref('/delivery').push(data);
          }
        }
      ]
    });
    confirm.present();

    
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


}


