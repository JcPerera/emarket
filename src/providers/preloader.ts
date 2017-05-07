import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LoadingController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';

/*
  Generated class for the Preloader provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Preloader {

  private loading: any;

  constructor(public http: Http,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
  }



  displayPreloader(msg: any): void {
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: msg
    });

    this.loading.present();
  }



  hidePreloader(): void {
    this.loading.dismiss();
  }

  displayAlert(title: any, msg: any) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }
}
