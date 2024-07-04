import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AuthService} from "../../services/auth-service";
import {AngularFireAuth} from "@angular/fire/auth";
import {PrizeService} from "../../services/prize-service";

@Component({
    selector: 'page-premios',
    templateUrl: 'premios.html',
})
export class PremiosPage {

    prizes: any;
    user: any;
    me: any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public authService: AuthService, public afAuth: AngularFireAuth,
                private prizeService: PrizeService) {

        afAuth.authState.subscribe(authData => {
            if (authData) {
                this.user = authService.getUserData();

                authService.getUser(this.user.uid).valueChanges().subscribe((snapshot:any) => {
                    snapshot.uid = snapshot.$key;
                    this.me = snapshot;

                    this.getPrizes(this.me.itin);

                });
            }
        });
    }

    ionViewDidLoad() {

    }

    getPrizes(itin) {
        this.prizeService.getPrizes(itin).then((snapshot : any) => {
            this.prizes = snapshot;
        });
    }

}
