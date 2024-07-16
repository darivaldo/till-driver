import { Component, ViewChild, NgZone } from '@angular/core';
import { Events, Nav, ModalController, AlertController, Platform, ToastController } from 'ionic-angular';


// @angular/fire
import { AngularFireAuth } from "@angular/fire/auth/auth";

// import service
import { AuthService } from "../services/auth-service";
import { TranslateService } from '@ngx-translate/core';
import { PlaceService } from "../services/place-service";
import { DriverService } from '../services/driver-service';
import { DealService } from "../services/deal-service";

// import page
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TripService } from "../services/trip-service";
import { PickUpPage } from "../pages/pick-up/pick-up";

import { TRIP_STATUS_WAITING, TRIP_STATUS_GOING } from "../services/constants";
import { WalletPage } from "../pages/wallet/wallet";
import { JobHistoryPage } from "../pages/job-history/job-history";
import { UserPage } from "../pages/user/user";
import { TermosPage } from "../pages/termos/termos";
import { GanhosPage } from "../pages/ganhos/ganhos";


import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse, BackgroundGeolocationEvents } from "@ionic-native/background-geolocation";

import { DEAL_STATUS_PENDING, DEAL_TIMEOUT, POSITION_INTERVAL, PLAY_AUDIO_ON_REQUEST, AUDIO_PATH } from "../services/constants";


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


declare var google: any;

@Component({
    templateUrl: 'app.html',
    queries: {
        nav: new ViewChild('content')
    }
})

export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage: any;
    driver: any;
    public user: any;

    public pages = [
        {
            title: 'Perfil',
            icon: 'person',
            count: 0,
            component: UserPage
        },
        {
            title: 'Carteira',
            icon: 'card',
            count: 0,
            component: WalletPage
        },
        {
            title: 'Histórico',
            icon: 'clipboard',
            count: 0,
            component: JobHistoryPage
        },
        {
            title: 'Escritório Virtual',
            icon: 'briefcase',
            count: 0,
            component: GanhosPage
        },
        {
            title: 'Termos e condições',
            icon: 'paper',
            count: 0,
            component: TermosPage
        },
        {
            title: 'Logout',
            icon: 'exit',
            count: 0,
            component: LoginPage
        }
    ];

    public confirm: any;
    public deal: any;
    public alertShown: boolean = false;
    public job: any;
    public remainingTime = DEAL_TIMEOUT;
    public isDriverAvailable: boolean = false;

    public gpsLocation: any = { country: "", locality: "", latitude: 0, longitude: 0 };

    constructor(private platform: Platform,
        public events: Events,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public driverService: DriverService,
        public afAuth: AngularFireAuth,
        public authService: AuthService,
        public tripService: TripService,
        public translate: TranslateService,
        public modalCtrl: ModalController,
        public toastCtrl: ToastController,
        public backgroundMode: BackgroundMode,
        public backgroundGeolocation: BackgroundGeolocation,
        public ngZone: NgZone,
        public alertCtrl: AlertController,
        public dealService: DealService,
        public placeService: PlaceService,
        public geolocation: Geolocation
    ) {

        this.translate.setDefaultLang('en');
        this.translate.use('en');


        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {

            this.statusBar.styleDefault();
            this.splashScreen.hide();


            if (localStorage.getItem('isDriverAvailable') == null) {
                localStorage.setItem('isDriverAvailable', 'false');
            }
            this.isDriverAvailable = (localStorage.getItem('isDriverAvailable') == 'true');

            localStorage.setItem('isInDealDecision', "false");


            if (localStorage.getItem("gpsLocation") == null) {
                localStorage.setItem("gpsLocation", JSON.stringify(this.gpsLocation));
            }

            this.events.subscribe('driver:On', () => {
                this.startSendLocation();
                this.sendAvailability();
            });

            this.events.subscribe('watchDeals:On', () => {
                this.watchDeals();
            });

            this.afAuth.authState.subscribe(authData => {
                if (authData) {

                    if (this.authService == undefined) {
                        this.user = this.authService.getUserData();

                        this.authService.getUser(authData.uid).valueChanges().subscribe((snapshot: any) => {

                            //snapshot.uid = snapshot.$key;
                            if (snapshot) {
                                snapshot.uid = "CfQswwkyeaht5raUOcO9ylH26zv2";
                                snapshot.name = "Teste";
                            }
                            else {
                                snapshot = {};
                                snapshot.uid = "CfQswwkyeaht5raUOcO9ylH26zv2";
                                snapshot.name = "Teste";
                            }

                            if (snapshot.itin == '' || snapshot.id_card == '' || snapshot.birthdate == '' ||
                                snapshot.name == '' || snapshot.email == '' || snapshot.phoneNumber == '') {
                                //Caso uma das informações obrigatórias não esteja preenchida, envia pra página do Perfil
                                this.nav.push(UserPage, { 'uid': this.user.uid });
                            }

                            this.driverService.getDriver().valueChanges().subscribe((snapshotDriver: any) => {

                                if (snapshotDriver) {
                                    snapshotDriver.uid = "CfQswwkyeaht5raUOcO9ylH26zv2";
                                    snapshotDriver.name = "Teste";
                                    snapshotDriver.photoUrl = "";
                                }
                                else {
                                    snapshotDriver = {};
                                    snapshotDriver.uid = "CfQswwkyeaht5raUOcO9ylH26zv2";
                                    snapshotDriver.name = "Teste";
                                    snapshotDriver.photoUrl = "";
                                }

                                this.driver = snapshotDriver;
                                this.driver.name = snapshot.name;
                                this.driver.photoUrl = snapshot.photoUrl;

                                this.events.publish('driver:On');

                                //======================================        
                                let root: any = HomePage;
                                // check for uncompleted trip
                                this.tripService.getTrips().take(1).subscribe((trips: any) => {
                                    trips.forEach(trip => {
                                        if (trip.status == TRIP_STATUS_WAITING || trip.status == TRIP_STATUS_GOING) {
                                            this.tripService.setCurrentTrip(trip.$key);
                                            root = PickUpPage;
                                        }
                                    });

                                    // if all trip are completed, go to home page
                                    this.nav.setRoot(root);
                                });


                                //======================================        
                                if (!this.driver.plate && !this.driver.type) {
                                    this.nav.push(UserPage, {
                                        user: this.authService.getUserData(),
                                        'vehicle': true
                                    });
                                }

                                this.events.publish('watchDeals:On');
                            });
                        });
                    }
                    else {
                        //this.driver = null;
                        this.nav.setRoot(LoginPage, { email: "daridados@gmail.com", password: "120202" });
                    }
                }
                else {
                    //this.driver = null;
                    this.nav.setRoot(LoginPage, { email: "daridados@gmail.com", password: "120202" });
                }


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
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario

        if(page.title == 'Perfil'){
            this.nav.push(page.component, { user: this.authService.getUserData() });
        }
        else {
            this.nav.push(page.component);
        }

    }



    //---1/3 Inicia Enviando Localizacao
    startSendLocation() {

        if (localStorage.getItem('isDriverAvailable') == 'true') {


            const config: BackgroundGeolocationConfig = {
                desiredAccuracy: 10,
                stationaryRadius: 1,
                distanceFilter: 1,
                debug: false,
                stopOnTerminate: true,
                // Android only section
                locationProvider: 0,
                startForeground: true,
                //notificationTitle: 'Dado Tracker',
                //notificationText:"App is online",
                notificationsEnabled: false,
                interval: (POSITION_INTERVAL * 2),
                fastestInterval: POSITION_INTERVAL,
                activitiesInterval: (POSITION_INTERVAL * 2)
            };

            this.backgroundGeolocation
                .configure(config)
                .then(() => {

                    this.backgroundGeolocation
                        .on(BackgroundGeolocationEvents.location)
                        .subscribe((location: BackgroundGeolocationResponse) => {

                            this.ngZone.run(() => {

                                let latLng = new google.maps.LatLng(location.latitude, location.longitude);
                                this.gpsLocation.latitude = location.latitude;
                                this.gpsLocation.longitude = location.longitude;

                                let geocoder = new google.maps.Geocoder();
                                geocoder.geocode({ 'latLng': latLng }, (results, status) => {
                                    console.log('startSendLocation - geocoder.geocode Status:', status);
                                    if (status == google.maps.GeocoderStatus.OK) {
                                        this.gpsLocation.country = this.placeService.setCountryFromGeocoder(results);
                                        this.gpsLocation.locality = this.placeService.setLocalityFromGeocoder(results);

                                        localStorage.setItem("gpsLocation", JSON.stringify(this.gpsLocation));

                                        this.driverService.updateGpsLocation(

                                            this.driver.uid,
                                            this.driver.name,
                                            this.gpsLocation.country,
                                            this.gpsLocation.locality,
                                            this.driver.type,
                                            this.gpsLocation.latitude,
                                            this.gpsLocation.longitude

                                        );

                                        console.log('startSendLocation - updatePosition:', location);
                                    }
                                });

                            });


                        });


                });

            this.backgroundGeolocation.checkStatus().then(status => {
                console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
                console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
                console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

                // you don't need to check status before start (this is just the example)
                if (!status.isRunning) {
                    this.backgroundGeolocation.start();//triggers start on start event
                }
            });

        }

    }


    //---2/3 - Envia se Ativo/Inativo
    sendAvailability() {

        if (localStorage.getItem('isDriverAvailable') == 'true') {

            if (localStorage.getItem('interval_sendAvailability') != null) {
                clearInterval(+localStorage.getItem('interval_sendAvailability'));
            }
            let interval_sendAvailability = setInterval(() => {


                this.gpsLocation = JSON.parse(localStorage.getItem("gpsLocation"));

                this.driverService.updateGpsLocation(

                    this.driver.uid,
                    this.driver.name,
                    this.gpsLocation.country,
                    this.gpsLocation.locality,
                    this.driver.type,
                    this.gpsLocation.latitude,
                    this.gpsLocation.longitude

                );

                console.log('sendAvailability driverService.updatePosition', this.gpsLocation);

                if (localStorage.getItem('isDriverAvailable') != 'true') {
                    clearInterval(+localStorage.getItem('interval_sendAvailability'));
                }

            }, POSITION_INTERVAL);
            localStorage.setItem('interval_sendAvailability', interval_sendAvailability.toString());

        }
        else {

            clearInterval(+localStorage.getItem('interval_sendAvailability'));
        }

    }

    //---3/3 Verifica Novos Jobs/Acordos/Viagens
    watchDeals() {


        if (localStorage.getItem('isDriverAvailable') == 'true') {

            // start tracking
            if (localStorage.getItem('interval_watchDeals') != null) {
                clearInterval(+localStorage.getItem('interval_watchDeals'));
            }
            let interval_watchDeals = setInterval(() => {

                if (localStorage.getItem('isInDealDecision') == "false") {


                    localStorage.setItem('isInDealDecision', "true");

                    this.dealService.getDeal(this.driver.uid).valueChanges().subscribe((snapshot: any) => {

                        console.log("watchDeals - this.dealService.getDeal()", snapshot);

                        if (snapshot.status != undefined) {

                            if (snapshot.status == DEAL_STATUS_PENDING) {

                                if (this.driver.uid != undefined && this.driver.uid != null) {

                                    if (!this.isExpired(snapshot, this.driver.uid)) {

                                        this.job = snapshot;
                                        this.deal = snapshot;

                                        this.job.origin.distance = this.placeService.calcCrow(this.gpsLocation.latitude, this.gpsLocation.longitude, this.job.origin.location.lat, this.job.origin.location.lng).toFixed(0);
                                        this.job.destination.distance = this.placeService.calcCrow(this.gpsLocation.latitude, this.gpsLocation.longitude, this.job.destination.location.lat, this.job.destination.location.lng).toFixed(0);

                                        console.log("watchDeals - this.dealService.getDeal() - DEAL_STATUS_PENDING", this.job);


                                        clearInterval(+localStorage.getItem('interval_watchDeals'));
                                        this.confirmJob();
                                    }
                                }
                                else {
                                    localStorage.setItem('isInDealDecision', "false");
                                }
                            }
                            else {
                                localStorage.setItem('isInDealDecision', "false");
                            }
                        }
                        else {
                            localStorage.setItem('isInDealDecision', "false");
                        }
                    }, err => {
                        localStorage.setItem('isInDealDecision', "false");
                    });
                }

            }, POSITION_INTERVAL);
            localStorage.setItem('interval_watchDeals', interval_watchDeals.toString());

        } else {

            clearInterval(+localStorage.getItem('interval_watchDeals'));

        }
    }


    isExpired(deal: any, driverKey: any) {

        let ret = false;

        // if deal expired
        if (deal.createdAt < (Date.now() - DEAL_TIMEOUT * 1000)) {
            this.toastCtrl.create({ message: 'Tempo para Acordo expirou', duration: 3000, }).present();
            console.log('Tempo para Acordo expirou--->', deal);
            localStorage.setItem('isInDealDecision', "false");
            this.dealService.removeDeal(driverKey);
            ret = true;
        }

        return ret;
    }

    cancelDeal() {
        console.log("cancelDeal");
        this.dealService.removeDeal(this.driver.uid);
    }


    // confirm a job
    confirmJob() {

        let message = "<b>De:</b> (" + this.job.origin.distance + "km)<br/>" + this.job.origin.vicinity + "<br/><br/> <b>Para:</b>(" + this.job.destination.distance + "km)<br>" + this.job.destination.vicinity + "";

        this.confirm = this.alertCtrl.create({
            title: 'Nova Solicitação',
            message: message,
            cssClass: "alertcss",
            buttons: [
                {
                    text: 'Rejeitar',
                    cssClass: 'cancelcss',
                    handler: () => {
                        console.log('Reject');
                        this.dealService.removeDeal(this.driver.uid);
                        localStorage.setItem('isInDealDecision', "false");

                    }
                },
                {
                    text: 'Aceitar',
                    cssClass: 'okcss',
                    handler: () => {

                        if (!this.isExpired(this.job, this.driver.uid)) {

                            localStorage.setItem('isInDealDecision', "false");
                            this.dealService.acceptDeal(this.driver.uid, this.deal).then(() => {
                                this.nav.setRoot(PickUpPage);
                            });
                        }
                    }
                }
            ]
        });
        this.confirm.present();
        this.playAudio();
    }

    playAudio() {
        if (PLAY_AUDIO_ON_REQUEST == true) {
            let audio = new Audio(AUDIO_PATH);
            audio.play();
        }
    }



}

