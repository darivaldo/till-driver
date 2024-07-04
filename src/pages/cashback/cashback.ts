import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AuthService} from "../../services/auth-service";
import {AngularFireAuth} from "@angular/fire/auth";
import {PrizeService} from "../../services/prize-service";

@Component({
    selector: 'page-cashback',
    templateUrl: 'cashback.html',
})
export class CashbackPage {

    user: any;
    me: any;
    cashBack: any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public authService: AuthService, public afAuth: AngularFireAuth,
                private prizeService: PrizeService) {

        afAuth.authState.subscribe(authData => {
            if (authData) {
                this.user = authService.getUserData();

                authService.getUser(this.user.uid).valueChanges().subscribe((snapshot:any) => {
                    snapshot.uid = snapshot.$key;
                    this.me = snapshot;

                    this.getCashback(this.me.itin);

                });
            }
        });
    }

    ionViewDidLoad() {
    }

    getCashback(itin) {
        this.prizeService.getCashbackPrizes(itin).then((snapshot : any) => {
            this.cashBack = snapshot;
            console.log(this.cashBack);
        });
    }

}
