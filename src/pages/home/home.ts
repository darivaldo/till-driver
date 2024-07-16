import { Component, NgZone } from '@angular/core';
import { Events, NavController, ModalController, AlertController, NavParams, Platform, ToastController } from 'ionic-angular';
import 'rxjs/Rx';

import { DriverService } from '../../services/driver-service';
import { DealService } from "../../services/deal-service";
import { AuthService } from "../../services/auth-service";
import { PlaceService } from "../../services/place-service";

import { UserPage } from "../user/user";
import { WalletPage } from '../wallet/wallet';
import { JobHistoryPage } from '../job-history/job-history';

import { Geolocation } from '@ionic-native/geolocation';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireAuth } from "@angular/fire/auth/auth";

import { DEFAULT_AVATAR } from '../../services/constants'; 

declare var google: any;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    public map: any;
    public mapId = Math.random() + 'map';

    public driver: any;
    public deal: any;
    public user: any;
    public confirm: any;

    public alertShown: boolean = false;
    public job: any;
    public isDriverAvailable: boolean = false;
    public locality: any = "";
    public gpsLocation: any = { country:"", locality:"", neighborhood: "", latitude: 0, longitude: 0 };

    constructor(
        public driverService: DriverService,
        public modalCtrl: ModalController,
        public platform: Platform,
        public toastCtrl: ToastController,
        public events: Events,
        public ngZone: NgZone,
        public alertCtrl: AlertController,
        public dealService: DealService,
        public authService: AuthService,
        public placeService: PlaceService,
        public geolocation: Geolocation,
        public translate: TranslateService,
        public nav: NavController,        
        public navParams: NavParams, 
        public afAuth: AngularFireAuth) {

        this.platform.ready()
            .then(() => {


                this.platform.registerBackButtonAction(() => {
                    if (this.alertShown == false) {
                        this.presentConfirm();
                    }
                }, 0)


                this.translate.setDefaultLang('pt-br');
                this.user = [];

                if (localStorage.getItem('isDriverAvailable') == null) {
                    localStorage.setItem('isDriverAvailable', 'false');
                }
                this.isDriverAvailable = (localStorage.getItem('isDriverAvailable') == 'true');

               
                afAuth.authState.subscribe(authData => {
                    if (authData) {
                        this.user = authService.getUserData();

                        authService.getUser(this.user.uid).valueChanges().subscribe((snapshot: any) => {

                            if (snapshot) {
                                snapshot.uid = "CfQswwkyeaht5raUOcO9ylH26zv2";
                                snapshot.name = "Teste";
                                snapshot.rating = 10;
                                snapshot.$key = "CfQswwkyeaht5raUOcO9ylH26zv2";
                                snapshot.photoUrl = DEFAULT_AVATAR;
                            }
                            else {
                                snapshot = {};
                                snapshot.uid = "CfQswwkyeaht5raUOcO9ylH26zv2";
                                snapshot.name = "Teste";
                                snapshot.rating = 10;
                                snapshot.$key = "CfQswwkyeaht5raUOcO9ylH26zv2";
                                snapshot.photoUrl = DEFAULT_AVATAR;
                            }
    
                            snapshot.uid = snapshot.$key;

                            this.driverService.getDriver().valueChanges().subscribe((snapshotDriver: any) => {

                                if (snapshotDriver) {
                                    snapshotDriver.uid = "CfQswwkyeaht5raUOcO9ylH26zv2";
                                    snapshotDriver.name = "Teste";
                                    snapshotDriver.photoUrl = DEFAULT_AVATAR;
                                }
                                else {
                                    snapshotDriver = {};
                                    snapshotDriver.uid = "CfQswwkyeaht5raUOcO9ylH26zv2";
                                    snapshotDriver.name = "Teste";
                                    snapshotDriver.photoUrl = DEFAULT_AVATAR;
                                }

                                this.driver = snapshotDriver;
                                this.driver.name = snapshotDriver.name;
                                this.driver.photoUrl = snapshotDriver.photoUrl ? snapshotDriver.photoUrl : DEFAULT_AVATAR;                                                           
                            });

                        });
                    }
                    else {
                        if (this.driver) {
                            this.driver.uid = "CfQswwkyeaht5raUOcO9ylH26zv2";
                            this.driver.name = "Teste";
                            this.driver.rating = 10;
                            this.driver.$key = "CfQswwkyeaht5raUOcO9ylH26zv2";
                            this.driver.photoUrl = DEFAULT_AVATAR;
                        }
                        else {
                            this.driver = {};
                            this.driver.uid = "CfQswwkyeaht5raUOcO9ylH26zv2";
                            this.driver.name = "Teste";
                            this.driver.rating = 10;
                            this.driver.$key = "CfQswwkyeaht5raUOcO9ylH26zv2";
                            this.driver.photoUrl = DEFAULT_AVATAR;
                        }
            }
                });

            });

  
    }

    presentConfirm() {
        let alert = this.alertCtrl.create({
            title: 'Confirmação',
            message: 'Deseja realmente sair do Dado Motorista?',
            buttons: [
                {
                    text: 'Não',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                        this.alertShown = false;
                    }
                },
                {
                    text: 'Sim',
                    handler: () => {
                        console.log('Yes clicked');
                        this.platform.exitApp();
                    }
                }
            ]
        });
        alert.present().then(() => {
            this.alertShown = true;
        });
    }


    ionViewWillEnter() {

        // get current location
        this.geolocation.getCurrentPosition().then((resp) => {

            // let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
            // let geocoder = new google.maps.Geocoder();
            this.gpsLocation.latitude = resp.coords.latitude;
            this.gpsLocation.longitude = resp.coords.longitude;

            this.loadMap(resp.coords.latitude, resp.coords.longitude);

        }, err => {
            console.error("Home", err);
        });

        this.events.publish('driver:On');
    }

    ionViewWillLeave() {


    }


    loadMap(lat, lng) {
        let latLng = new google.maps.LatLng(lat, lng);

        this.map = new google.maps.Map(document.getElementById(this.mapId), {
            zoom: 15,
            center: latLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            zoomControl: true,
            disableDefaultUI: false,
            streetViewControl: false,
            styles: this.placeService.temaWY()
        });

        new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        });
    }

    onChangeAvailability() {

        if (this.isDriverAvailable == true) {

            localStorage.setItem('isDriverAvailable', 'true');
            this.events.publish('driver:On');

        } else {

            localStorage.setItem('isDriverAvailable', 'false');
            clearInterval(+localStorage.getItem('interval_sendAvailability'));
            clearInterval(+localStorage.getItem('interval_watchDeals'));

        }

    }

    goProfile() {
        this.nav.push(UserPage, { user: this.authService.getUserData() });
    }

    goWallet() {
        this.nav.push(WalletPage);
    }

    goHistory() {
        this.nav.push(JobHistoryPage);
    }


}

