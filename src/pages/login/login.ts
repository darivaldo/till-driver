import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, LoadingController, ToastController} from 'ionic-angular';
import {RegisterPage} from '../register/register';
import {HomePage} from '../home/home'
import {AuthService} from "../../services/auth-service";
import {ENABLE_SIGNUP} from "../../services/constants";
import * as firebase from 'firebase';
import {TranslateService} from '@ngx-translate/core';
import {IndicacaoPage} from "../indicacao/indicacao";
import {CadastroDadoProvider} from "../../providers/cadastro-dado/cadastro-dado";


@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    userInfo: any = {};
    email: string = "";
    password: string = "";
    isRegisterEnabled = ENABLE_SIGNUP;

    constructor(public nav: NavController, public navParams: NavParams,
                public authService: AuthService, public alertCtrl: AlertController,
                public loadingCtrl: LoadingController, public toast: ToastController,
                public translate: TranslateService, public dado: CadastroDadoProvider) {

                if (this.navParams.get('email') && this.navParams.get('password')) {
                    this.email = this.navParams.get('email');
                    this.password = this.navParams.get('password');
                }else {
                    this.email = "daridados@gmail.com";
                    this.password = "120202";
                }


            
    }

    // go to signup page
    signup() {
        //this.nav.push(RegisterPage);
        this.nav.push(IndicacaoPage);
        //this.alertCtrl.create({message: 'Demonstração do app Dado.', buttons: ['OK']}).present();
    }

    reset() {
        if (this.userInfo.email) {
            firebase.auth().sendPasswordResetEmail(this.userInfo.email)
                .then(data =>
                    this.toast.create({message: 'Por favor, verifique seu e-mail', duration: 3000}).present())
                .catch(err => this.toast.create({message: err.message, duration: 3000}).present())
        }
    }

    // go to login page
    login() {
        let msg = "";
        let verifyDado = false;
        if (this.email.length == 0 || this.password.length == 0) {
            this.alertCtrl.create({subTitle: 'Dados inválidos', buttons: ['ok']}).present();
        } else {
            let loading = this.loadingCtrl.create({content: 'Fazendo login...'});
            loading.present();

            this.authService.login(this.email, this.password).then(authData => {

                loading.dismiss();
                this.nav.setRoot(HomePage);
            }, error => {
                // in case of login error
                let err: any = error;
                loading.dismiss();
                switch (err.code) {
                    case 'auth/user-not-found':
                        msg = "Usuário não encontrado.";
                        //verifyDado = true;
                        break;
                    case 'auth/wrong-password':
                        msg = "Senha incorreta. Por favor, tente novamente.";
                        break;
                    default:
                        msg = "Ocorreu um erro no login. Por favor, tente novamente.";
                        break;
                }
                if (!verifyDado){
                    let alert = this.alertCtrl.create({
                        message: msg,
                        buttons: ['OK']
                    });
                    alert.present();
                }
                else{
                    this.dado.searchByEmail(this.email)
                        .then( result => {
                            if (result){
                                this.nav.push(RegisterPage, {'snapshot': result[0], 'origin':'login'});
                            }
                            else{
                                let alert = this.alertCtrl.create({
                                    message: msg,
                                    buttons: ['OK']
                                });
                                alert.present();
                            }
                        })
                }
            });
        }



       /* let loading = this.loadingCtrl.create({content: 'Aguarde...'});
        loading.present();


        this.authService.login(this.userInfo.email, this.userInfo.password).then(authData => {
            loading.dismiss();
            this.nav.setRoot(HomePage);
        }, error => {

            this.authService.verifyUser(this.userInfo.email, this.userInfo.password).valueChanges().subscribe((snapshot : any) => {
                if (snapshot[0].pswd === this.userInfo.password) {
                    let loading = this.loadingCtrl.create({content: 'Carregando dados Dado...'});
                    loading.present();
                    setTimeout('', 2000);
                    this.nav.push(RegisterPage, {'snapshot': snapshot[0]});

                } else {
                    let alert = this.alertCtrl.create({
                        message: error.message,
                        buttons: ['OK']
                    });
                    alert.present();
                }
            });

            loading.dismiss();

        });*/
    }

}
