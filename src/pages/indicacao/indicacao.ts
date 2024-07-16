import {Component} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFireDatabase} from "@angular/fire/database";
import {RegisterPage} from "../register/register";
import {CadastroDadoProvider} from "../../providers/cadastro-dado/cadastro-dado";

@Component({
    selector: 'page-indicacao',
    templateUrl: 'indicacao.html',
})
export class IndicacaoPage {
    indicacao: string = '';
    indicadoPor: any;
    mostraIndicacao: boolean;
    minhaIndicacao: string = '';
    validacaoOK: boolean;
    indicacaoOk: boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
                public afAuth: AngularFireAuth, public db: AngularFireDatabase, public alertCtrl: AlertController,
                public dado: CadastroDadoProvider) {
    }

    ionViewDidLoad() {
    }

    invalidarIndicacao() {
        this.indicacao = '';
        this.mostraIndicacao = false;
        this.validacaoOK = false;
    }

    criarCodigo() {
        this.mostraIndicacao = true;
        this.indicacaoOk = true;
    }

    criarIndicacao() {
        let loading = this.loadingCtrl.create({content: 'Verificando...'});
        loading.present();

        this.dado.verifyAffiliateCode(this.minhaIndicacao)
            .then( result => {
                if (result[0].qtd == '1'){
                    let alert = this.alertCtrl.create({
                        title: 'Código Existente!',
                        cssClass: 'alertcss',
                        message: 'Esse código já está cadastrado. Se este código é seu, confirme digitando seu cpf:',
                        inputs: [
                            {
                                name: 'cpf',
                                type: 'text',
                                placeholder: 'CPF'
                            }],
                        buttons: [{
                            text: 'OK',
                            cssClass: 'okcss',
                            handler: data => {
                                let cpf = data.cpf.toString().replace(/[\. ,:-]+/g, "");

                                console.log('clean',cpf);
                                console.log('banco', result[0].cpf);
                                /*if (cpfClean == result[0].cpf){
                                    this.validacaoOK = true;
                                    this.navCtrl.push(RegisterPage, {'minhaIndicacao': this.minhaIndicacao, 'indicadoPor': this.indicadoPor})
                                }*/
                            }
                        }]
                    });
                    alert.present();
                    this.validacaoOK = false;
                }
                else{
                    this.validacaoOK = true;
                    this.navCtrl.push(RegisterPage, {'minhaIndicacao': this.minhaIndicacao, 'indicadoPor': this.indicadoPor, 'origin':'new'})
                }
            });

        /*this.validaAfiliacao().valueChanges().subscribe((snapshot : any) => {
            console.log('snapshot2', snapshot);
            if (snapshot.length <= 0) {


            } else {

            }


        });*/
        loading.dismiss();
    }

    validar() {

        if (!this.indicacao) {

            let alert = this.alertCtrl.create({
                title: 'Código em branco!',
                cssClass: 'alertcss',
                message: 'Digite um código antes de clicar em validar',
                buttons: [{
                    text: 'OK',
                    cssClass: 'okcss'
                }]
            });
            alert.present();

        } else {

            let loading = this.loadingCtrl.create({content: 'Procurando...'});
            loading.present();
            this.dado.searchAffiliateByCode(this.indicacao)
                .then(result => {
                    let indicadoPor = result;

                    if (typeof indicadoPor !== undefined){
                        this.mostraIndicacao = true;
                    }
                    this.indicadoPor = indicadoPor[0];
                }).catch(reject => {
                let alert = this.alertCtrl.create({
                    title: 'Não encontrado!',
                    subTitle: 'Verifique se digitou corretamente o código de indicação',
                    buttons: ['OK']
                });
                alert.present();
                this.mostraIndicacao = false;
            });
            loading.dismiss();
        }

    }

    validaAfiliacao() {
        return this.db.list('pessoas',ref => ref.orderByChild('codigo_afiliacao').equalTo(this.minhaIndicacao)).valueChanges();
    }

}
