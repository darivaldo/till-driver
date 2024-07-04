import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AuthService } from "../../services/auth-service";
import { AngularFireAuth } from "@angular/fire/auth";
import { PremiosPage } from "../premios/premios";
import { CashbackPage } from "../cashback/cashback";
import { HomePage } from '../../pages/home/home';

@Component({
    selector: 'page-ganhos',
    templateUrl: 'ganhos.html',
})
export class GanhosPage {

    user: any;
    me: any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public platform: Platform,
        public authService: AuthService, public afAuth: AngularFireAuth) {

        this.platform.ready()
            .then(() => {

                this.platform.registerBackButtonAction(() => {
                    this.navCtrl.setRoot(HomePage);
                }, 0);
            });


        afAuth.authState.subscribe(authData => {
            if (authData) {
                this.user = authService.getUserData();

                authService.getUser(this.user.uid).valueChanges().subscribe((snapshot:any) => {
                    snapshot.uid = snapshot.$key;
                    this.me = snapshot;
                });
            }
        });
    }

    goFirst() {
        this.navCtrl.push(PremiosPage);
    }

    goSecond() {
        this.navCtrl.push(CashbackPage);
    }

    ionViewDidLoad() {
    }

}
