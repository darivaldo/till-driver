import { Component } from '@angular/core';
import { Events,NavController, AlertController, ActionSheetController, Platform } from 'ionic-angular';
import { TripService } from "../../services/trip-service";
import { DealService } from "../../services/deal-service";
import { HomePage } from '../home/home';
import * as firebase from 'firebase';
import { DriverService } from "../../services/driver-service";
import { PlaceService } from "../../services/place-service";
import { BackgroundMode } from '@ionic-native/background-mode';
import { Geolocation } from '@ionic-native/geolocation';
import { TranslateService } from '@ngx-translate/core';

import {
    TRIP_STATUS_GOING,
    TRIP_STATUS_CANCELED,
} from "../../services/constants";

declare var google: any;


@Component({
    selector: 'page-pick-up',
    templateUrl: 'pick-up.html',
})
export class PickUpPage {

    public map: any;

    // trip info
    trip: any;
    passenger: any = {};
    isTripStarted = false;
    isPassengerNotified = false;
    driver: any = {};

    public distance: any;
    public duration: any;
    public distanceText: any = '';
    public durationText: any = '';

    constructor(public nav: NavController, public tripService: TripService,
        public platform: Platform, public alertCtrl: AlertController,
        public dealService: DealService, public driverService: DriverService,
        public geolocation: Geolocation,
        public translate: TranslateService,
        public events: Events,
        public placeService: PlaceService,
        public backgroundMode: BackgroundMode,
        public actionSheetCtrl: ActionSheetController) {


        this.platform.ready()
            .then(() => {

                this.platform.registerBackButtonAction(() => {
                    this.nav.setRoot(HomePage, { 'isDriverAvailable': true });
                }, 0)

               

                this.trip = tripService.getCurrentTrip();
                let getTrips = tripService.getTripStatus(this.trip.$key).valueChanges().subscribe((trip:any) => {
                    if (trip.status == TRIP_STATUS_CANCELED) {
                        getTrips.unsubscribe();
                        this.tripService.cancel(this.trip.$key);
                        this.dealService.removeDeal(this.trip.driverId);
                        this.alertCtrl.create({ title: 'Solicitação Cancelada' }).present();
                        this.nav.setRoot(HomePage, { 'isDriverAvailable': true });
                    }
                    else if (trip.status == TRIP_STATUS_GOING) {
                        this.isTripStarted = true;
                    }
                });

                tripService.getPassenger(this.trip.passengerId).valueChanges().subscribe((snapshot : any) => {
                    this.passenger = snapshot;
                });


                this.translate.setDefaultLang('pt-br');
                
                // this.backgroundMode.enable();
                // this.backgroundMode.on("activate").subscribe(() => {
                //     console.log('backgroundMode - Iniciado');
                //     this.events.publish('driver:On');
                // });
                // this.backgroundMode.on("deactivate").subscribe(() => {
                //     console.log('backgroundMode - Desativado');
                //     this.nav.popToRoot();
                // });
        
            });


    }

    ngOnInit() {
    }

    ionViewWillEnter() {

        // get current location
        this.geolocation.getCurrentPosition().then((resp) => {

            console.log("PickUpPage - Driver Actual Position: ", this.driver, resp.coords.latitude, resp.coords.longitude);
            // let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
            // let geocoder = new google.maps.Geocoder();

            this.loadMap(resp.coords.latitude, resp.coords.longitude);

        }, err => {
            console.error("PickUpPage - geolocation.getCurrentPosition()", err);
        });

        this.events.publish('driver:On');

    }


    loadMap(lat, lng) {

        let latlng= new google.maps.LatLng(lat,lng);
        let origin_latLng = new google.maps.LatLng(this.trip.origin.location.lat, this.trip.origin.location.lng);
        let destination_latLng = new google.maps.LatLng(this.trip.destination.location.lat, this.trip.destination.location.lng);

        let directionsDisplay;
        let directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer();

        this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: origin_latLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            zoomControl: true,
            disableDefaultUI: false,
            streetViewControl: false,
            styles: this.placeService.temaWY()
        });

        let mapx = this.map;
        directionsDisplay.setMap(mapx);

        this.placeService.getDirection(
            this.trip.origin.location.lat,
            this.trip.origin.location.lng, 
            this.trip.destination.location.lat,
            this.trip.destination.location.lng).subscribe(result => {

            this.distance = result.routes[0].legs[0].distance.value;
            this.duration = result.routes[0].legs[0].duration.value;

            this.distanceText = result.routes[0].legs[0].distance.text;
            this.durationText = result.routes[0].legs[0].duration.text;
           
        });


        var bounds = new google.maps.LatLngBounds();
        bounds.extend(origin_latLng);
        bounds.extend(destination_latLng);

        mapx.fitBounds(bounds);
        var request = {
            origin: origin_latLng,
            destination: destination_latLng,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                //// console.log(response);
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(mapx);
            } else {
                // console.log("error");
            }
        });

        new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latlng
        });

    }


    inform() {
        if (!this.isPassengerNotified) {
            this.tripService.notify(this.trip.$key);
        }
        this.isPassengerNotified = true;
    }

    // pickup
    pickup() {

        if (!this.isPassengerNotified) {
            this.inform();
        }

        this.alertCtrl.create({
            subTitle: "Insira o Código OTP do passageiro",
            inputs: [{
                name: 'otp',
                placeholder: 'Código OTP'
            }],
            buttons: [{
                text: "Verificar",
                handler: (data) => {
                    console.log(data);
                    console.log(this.trip.$key);
                    firebase.database().ref('trips/' + this.trip.$key).once('value', snap => {
                        console.log(snap.val())
                        if (snap.val().otp != data.otp) {
                            this.alertCtrl.create({ title: 'Error', subTitle: 'OTP Inválido' }).present();
                        } else {
                            this.isTripStarted = true;
                            this.tripService.pickUp(this.trip.$key);
                        }
                    })
                }
            }]
        }).present();
    }

    getDirection(lat, lng) {

        //this.useNavigate('google', lat, lng);
        const actionSheet = this.actionSheetCtrl.create({
            title: 'Escolha o programa',
            buttons: [
                {
                    text: 'Google Maps',
                    handler: () => {
                        this.useNavigate('google', lat, lng)
                    }
                },
                {
                    text: 'Waze',
                    handler: () => {
                        this.useNavigate('waze', lat, lng)
                    }
                }
            ]
        });

        actionSheet.present();
        console.log("call");
    }

    useNavigate(appName, lat, lng) {

        this.driver = this.driverService.getLatLng();

        if (appName == 'google') {
            let url = "https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=Current Location&destination=" + lat + "," + lng;
            window.open(url);
        }
        else if (appName == 'waze') {
            let url = "https://waze.com/ul?q=" + lat + "," + lng + "&navigate=yes&zoom=17";
            window.open(url);
        }
    }

    showPayment() {
        let final = this.trip.fee - (this.trip.fee * (parseInt(this.trip.discount) / 100))
        this.alertCtrl.create({
            message: '<h1>' + this.trip.currency + ' ' + final + '</h1> <p>Fee: ' + this.trip.fee + ' <br> Discount (%): ' + this.trip.discount + ' (' + this.trip.promocode + ')<br>Payment Method: ' + this.trip.paymentMethod + '</p>',
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        this.tripService.dropOff(this.trip.$key);
                        this.dealService.removeDeal(this.trip.driverId);
                        this.nav.setRoot(HomePage, { 'isDriverAvailable': true });
                    }
                }
            ]
        }).present();
    }
}
