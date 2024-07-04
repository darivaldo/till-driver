import { Component } from '@angular/core';
import { Events, NavController, NavParams, LoadingController, AlertController, ToastController, Platform } from 'ionic-angular';
import { AuthService } from "../../services/auth-service";
import * as firebase from 'firebase';
import { SettingService } from "../../services/setting-service";
import { LoginPage } from '../login/login';
import {
    CUSTOMER_CARE,
    CURRENCY_SYMBOL,
    DEFAULT_COUNTRY_CODE,
    DEFAULT_COUNTRY_MOBILE_CODE
} from "../../services/constants";
import { HomePage } from '../home/home';
import { TranslateService } from '@ngx-translate/core';
import { SelectCarService } from "../../services/select-car-service";

import { BankService } from "../../services/bank-service";
import { CepProvider } from "../../providers/cep/cep";
import { BrMaskerIonicServices3, BrMaskModel } from "brmasker-ionic-3";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UserDto } from '../../Dto/UserDto';

@Component({
    selector: 'page-user',
    templateUrl: 'user.html',
})
export class UserPage {
    user: any = {};
    driver: any = {};
    currency: any;
    support = CUSTOMER_CARE;
    tripCount = 0;
    totalEarning = 0;
    rating: any = 5;
    types: Array<any> = [];
    tabs: any = 'profile';
    renavam_valid = true;

    brands: any;
    ufs: any;
    municipios: any;
    models: any;
    banks: any;
    endereco: any;
    tem_email: boolean = true;
    car_inicio: any;

    year = null;
    year2 = null;
    private currentTime = null;

    constructor(public platform: Platform,
        public nav: NavController,
        public navParams: NavParams,
        public authService: AuthService,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public settingService: SettingService,
        public events: Events,
        public translate: TranslateService,
        public selectCarService: SelectCarService,
        public bankService: BankService,
        public cepProvider: CepProvider,
        public brMasker: BrMaskerIonicServices3,
        public camera: Camera,
        public userDto: UserDto) {


        this.platform.ready()
            .then(() => {

                this.platform.registerBackButtonAction(() => {
                    this.nav.setRoot(HomePage);
                }, 0);
            });

        var user = navParams.get('user');
        let vehicle = navParams.get('vehicle');

        this.currency = CURRENCY_SYMBOL;
        this.tem_email = true;

        if (vehicle) {
            let alert = this.alertCtrl.create({
                title: 'Atualização de dados',
                message: 'Preencha os dados do veículo antes de ficar online.',
                buttons: ['OK']
            });
            alert.present();
            this.tabs = 'carinfo';
        }

        // list of vehicle types
        this.settingService.getVehicleType().valueChanges().subscribe((snapshot: any) => {
            console.log(snapshot);

            if (snapshot) {
                snapshot.uid = "CfQswwkyeaht5raUOcO9ylH26zv2";
                snapshot.name = "Teste";
                snapshot.$key = "CfQswwkyeaht5raUOcO9ylH26zv2";
                snapshot.photoUrl = "";
                snapshot.$value = null;
            }
            else {
                snapshot = {};
                snapshot.uid = "CfQswwkyeaht5raUOcO9ylH26zv2";
                snapshot.name = "Teste";
                snapshot.$key = "CfQswwkyeaht5raUOcO9ylH26zv2";
                snapshot.photoUrl = "";
                snapshot.$value = null;
            }


            if (snapshot.$value === null) {
                this.settingService.getDefaultVehicleType().valueChanges().subscribe((snapshot: any) => {

                    if (snapshot) {
                        snapshot.uid = "CfQswwkyeaht5raUOcO9ylH26zv2";
                        snapshot.name = "Teste";
                        snapshot.$key = "CfQswwkyeaht5raUOcO9ylH26zv2";
                        snapshot.photoUrl = "";
                        snapshot.$value = null;
                        snapshot.type = "sedan";
                    }
                    else {
                        snapshot = {};
                        snapshot.uid = "CfQswwkyeaht5raUOcO9ylH26zv2";
                        snapshot.name = "Teste";
                        snapshot.$key = "CfQswwkyeaht5raUOcO9ylH26zv2";
                        snapshot.photoUrl = "";
                        snapshot.$value = null;
                        snapshot.type = "sedan";
                    }


                    this.types = Object.keys(snapshot).map(function (key) {
                        return snapshot[key];
                    });
                    console.log(this.types);
                })
            } else {
                this.types = Object.keys(snapshot).map(function (key) {
                    return snapshot[key];
                });
            }
        });

        //list of Vehicle Brands
        this.selectCarService.getBrands().valueChanges().subscribe((snapshot: any) => {
            this.brands = Object.keys(snapshot).map(function (key) {
                return snapshot[key];
            }).sort();
        });

        this.bankService.getBanks().valueChanges().subscribe((snapshot: any) => {
            this.banks = Object.keys(snapshot).map(function (key) {
                return snapshot[key];
            })
        });

        this.selectCarService.getUFs().then((snapshot: any) => {
            this.ufs = Object.keys(snapshot).map(function (key) {
                return snapshot[key];
            }).sort();
        });

        this.authService.getUser(user.uid).valueChanges().subscribe((snapshot: any) => {

            if (snapshot) {
                snapshot.uid = "CfQswwkyeaht5raUOcO9ylH26zv2";
                snapshot.name = "Teste";
                snapshot.$key = "CfQswwkyeaht5raUOcO9ylH26zv2";
                snapshot.photoUrl = "";
                snapshot.$value = null;
                snapshot.user = new UserDto();
                snapshot.user.itin = "010101";
                snapshot.user.phoneNumber = "11983194534";
                snapshot.user.id_card = "1231231231231";
                snapshot.user.email = "daridados@gmail.com";
                snapshot.user.tipo_condu = 'CONDUAPP';
                snapshot.user.photoUrl = 'assets/img/no_image.jpeg';
                snapshot.user.photoCNH = 'assets/img/no_image.jpeg';
                snapshot.user.photoComprovante = 'assets/img/no_image.jpeg';
                snapshot.user.photoDocCarro = 'assets/img/no_image.jpeg';
                snapshot.user.photoINSS = 'assets/img/no_image.jpeg';
                snapshot.user.photoCONDUTAXI_CONDUAPP = 'assets/img/no_image.jpeg';
                snapshot.user.photoCSVAPP = 'assets/img/no_image.jpeg';
                snapshot.user.photoCarFrente = 'assets/img/no_image.jpeg';
                snapshot.user.photoCarTraseira = 'assets/img/no_image.jpeg';
                snapshot.user.photoCarLateralMotorista = 'assets/img/no_image.jpeg';
                snapshot.user.photoCarLateralPassageiro = 'assets/img/no_image.jpeg';
                snapshot.user.photoCarBancoTraseiro = 'assets/img/no_image.jpeg';
                snapshot.user.photoCarPainel = 'assets/img/no_image.jpeg';
                snapshot.user.photoCarPainel = 'assets/img/no_image.jpeg';

            }
            else {
                snapshot = {};
                snapshot.uid = "CfQswwkyeaht5raUOcO9ylH26zv2";
                snapshot.name = "Teste";
                snapshot.$key = "CfQswwkyeaht5raUOcO9ylH26zv2";
                snapshot.photoUrl = "";
                snapshot.$value = null;
                snapshot.user = new UserDto();
                snapshot.user.itin = "010101";
                snapshot.user.phoneNumber = "11983194534";
                snapshot.user.id_card = "1231231231231";
                snapshot.user.email = "daridados@gmail.com";
                snapshot.user.tipo_condu = 'CONDUAPP';
                snapshot.user.photoUrl = 'assets/img/no_image.jpeg';
                snapshot.user.photoCNH = 'assets/img/no_image.jpeg';
                snapshot.user.photoComprovante = 'assets/img/no_image.jpeg';
                snapshot.user.photoDocCarro = 'assets/img/no_image.jpeg';
                snapshot.user.photoINSS = 'assets/img/no_image.jpeg';
                snapshot.user.photoCONDUTAXI_CONDUAPP = 'assets/img/no_image.jpeg';
                snapshot.user.photoCSVAPP = 'assets/img/no_image.jpeg';
                snapshot.user.photoCarFrente = 'assets/img/no_image.jpeg';
                snapshot.user.photoCarTraseira = 'assets/img/no_image.jpeg';
                snapshot.user.photoCarLateralMotorista = 'assets/img/no_image.jpeg';
                snapshot.user.photoCarLateralPassageiro = 'assets/img/no_image.jpeg';
                snapshot.user.photoCarBancoTraseiro = 'assets/img/no_image.jpeg';
                snapshot.user.photoCarPainel = 'assets/img/no_image.jpeg';
                snapshot.user.photoCarPainel = 'assets/img/no_image.jpeg';
            }


            snapshot.uid = snapshot.$key;
            console.log(snapshot);
            this.user = snapshot;

            if (!this.user.email) {
                this.tem_email = false;
            } else if (this.user.email == '') {
                this.tem_email = false;
            }

            this.user.itin = brMasker.writeValuePerson(this.user.itin);

            const config: BrMaskModel = new BrMaskModel();
            config.phone = true;
            this.user.phoneNumber = brMasker.writeCreateValue(this.user.phoneNumber, config);

            const configmask: BrMaskModel = new BrMaskModel();
            configmask.mask = '00.000.000-00';
            configmask.len = 13;
            this.user.id_card = brMasker.writeCreateValue(this.user.id_card, configmask);

            if (!this.user.tipo_condu) {
                this.user.tipo_condu = 'CONDUAPP';
            } else {
                if (this.user.tipo_condu == '') {
                    this.user.tipo_condu = 'CONDUAPP';
                }
            }

            if (!this.user.photoUrl) {
                this.user.photoUrl = 'assets/img/no_image.jpeg';
            } else {
                if (this.user.photoUrl == '') {
                    this.user.photoUrl = 'assets/img/no_image.jpeg';
                }
            }
            if (!this.user.photoCNH) {
                this.user.photoCNH = 'assets/img/no_image.jpeg';
            } else {
                if (this.user.photoCNH == '') {
                    this.user.photoCNH = 'assets/img/no_image.jpeg';
                }
            }
            if (!this.user.photoComprovante) {
                this.user.photoComprovante = 'assets/img/no_image.jpeg';
            } else {
                if (this.user.photoComprovante == '') {
                    this.user.photoComprovante = 'assets/img/no_image.jpeg';
                }
            }
            if (!this.user.photoDocCarro) {
                this.user.photoDocCarro = 'assets/img/no_image.jpeg';
            } else {
                if (this.user.photoDocCarro == '') {
                    this.user.photoDocCarro = 'assets/img/no_image.jpeg';
                }
            }
            if (!this.user.photoINSS) {
                this.user.photoINSS = 'assets/img/no_image.jpeg';
            } else {
                if (this.user.photoINSS == '') {
                    this.user.photoINSS = 'assets/img/no_image.jpeg';
                }
            }
            if (!this.user.photoCONDUTAXI_CONDUAPP) {
                this.user.photoCONDUTAXI_CONDUAPP = 'assets/img/no_image.jpeg';
            } else {
                if (this.user.photoCONDUTAXI_CONDUAPP == '') {
                    this.user.photoCONDUTAXI_CONDUAPP = 'assets/img/no_image.jpeg';
                }
            }
            if (!this.user.photoCSVAPP) {
                this.user.photoCSVAPP = 'assets/img/no_image.jpeg';
            } else {
                if (this.user.photoCSVAPP == '') {
                    this.user.photoCSVAPP = 'assets/img/no_image.jpeg';
                }
            }
            if (!this.user.photoCarFrente) {
                this.user.photoCarFrente = 'assets/img/no_image.jpeg';
            } else {
                if (this.user.photoCarFrente == '') {
                    this.user.photoCarFrente = 'assets/img/no_image.jpeg';
                }
            }
            if (!this.user.photoCarTraseira) {
                this.user.photoCarTraseira = 'assets/img/no_image.jpeg';
            } else {
                if (this.user.photoCarTraseira == '') {
                    this.user.photoCarTraseira = 'assets/img/no_image.jpeg';
                }
            }
            if (!this.user.photoCarLateralMotorista) {
                this.user.photoCarLateralMotorista = 'assets/img/no_image.jpeg';
            } else {
                if (this.user.photoCarLateralMotorista == '') {
                    this.user.photoCarLateralMotorista = 'assets/img/no_image.jpeg';
                }
            }
            if (!this.user.photoCarLateralPassageiro) {
                this.user.photoCarLateralPassageiro = 'assets/img/no_image.jpeg';
            } else {
                if (this.user.photoCarLateralPassageiro == '') {
                    this.user.photoCarLateralPassageiro = 'assets/img/no_image.jpeg';
                }
            }
            if (!this.user.photoCarBancoTraseiro) {
                this.user.photoCarBancoTraseiro = 'assets/img/no_image.jpeg';
            } else {
                if (this.user.photoCarBancoTraseiro == '') {
                    this.user.photoCarBancoTraseiro = 'assets/img/no_image.jpeg';
                }
            }
            if (!this.user.photoCarPainel) {
                this.user.photoCarPainel = 'assets/img/no_image.jpeg';
            } else {
                if (this.user.photoCarPainel == '') {
                    this.user.photoCarPainel = 'assets/img/no_image.jpeg';
                }
            }

        });

        this.authService.getDriver(user.uid).valueChanges().subscribe((snapshot: any) => {

            if (snapshot) {
                snapshot.uid = "CfQswwkyeaht5raUOcO9ylH26zv2";
                snapshot.name = "Teste";
                snapshot.$key = "CfQswwkyeaht5raUOcO9ylH26zv2";
                snapshot.photoUrl = "";
                snapshot.$value = null;
            }
            else {
                snapshot = {};
                snapshot.uid = "CfQswwkyeaht5raUOcO9ylH26zv2";
                snapshot.name = "Teste";
                snapshot.$key = "CfQswwkyeaht5raUOcO9ylH26zv2";
                snapshot.photoUrl = "";
                snapshot.$value = null;
            }


            snapshot.uid = snapshot.$key;
            this.driver = snapshot;

            this.car_inicio = this.driver.brand + '|' + this.driver.model + '|' + this.driver.year + '|' +
                this.driver.plate + '|' + this.driver.color + '|' + this.driver.type

            this.rating = this.user.rating;
            if (this.driver.brand) {
                this.getModels();
                this.getType();
            }
            if (this.driver.uf_emplacamento) {
                this.getMunicipios()
            }
            else {
                this.driver.uf_emplacamento = 'SP';
                this.getMunicipios();
            }
            this.getTrips();
        });

        this.user.isEmailVerified = firebase.auth().currentUser.emailVerified;

        this.dateParams(7);
        this.dateParamsBd(21);
    }


    ionViewWillEnter() {
        this.events.publish('driver:On');
    }

    getType() {
        this.selectCarService.getCarType(this.driver.brand, this.driver.model)
            .then(result => {
                if (this.driver.year >= result[0].year) {
                    this.driver.type = result[0].type;
                } else {
                    this.driver.type = 'GO';
                }

            });

    }

    getModels() {
        this.selectCarService.getModelsByBrand(this.driver.brand).subscribe((snapshot: any) => {
            this.models = Object.keys(snapshot).map(function (key) {
                return snapshot[key];
            });
            console.log(this.models);
        });
    }

    getMunicipios() {
        this.selectCarService.getMunicipios(this.driver.uf_emplacamento)
            .then((snapshot: any) => {
                this.municipios = Object.keys(snapshot).map(function (key) {
                    return snapshot[key];
                });
                console.log(this.models);
            });
    }

    async getCep() {
        this.loader('Procurando Endereço...');

        if (this.user.zipcode.length > 0) {

            try {
                this.cepProvider.cep(this.user.zipcode)
                    .then(data => {
                        this.endereco = data;
                        if (!this.endereco.erro) {
                            this.user.address = this.endereco.logradouro;
                            this.user.neighborhood = this.endereco.bairro;
                            this.user.city = this.endereco.localidade;
                            this.user.state = this.endereco.uf;
                        } else {
                            this.showAlertCep();
                        }
                    });
            } catch (e) {
                this.showAlertCep();
            }
        }
    }

    loader(message) {
        const loader = this.loadingCtrl.create({
            content: message,
            duration: 2000
        });
        loader.present();
    }

    dateParamsBd(limit: number) {
        this.currentTime = new Date();
        this.year2 = this.currentTime.getFullYear();
        this.year2 = this.year - limit;
    }

    dateParams(limit: number) {
        this.currentTime = new Date();
        this.year = this.currentTime.getFullYear();
        this.year = this.year - limit;
    }

    save() {
        try {

            //this.driver.type = this.driver.type ? this.driver.type : 'GO';
            this.user.isPhoneVerified = this.user.isPhoneVerified ? this.user.isPhoneVerified : false;

            let car_fim = this.driver.brand + '|' + this.driver.model + '|' + this.driver.year + '|' +
                this.driver.plate + '|' + this.driver.color + '|' + this.driver.type;

            console.log(this.car_inicio + ' <=> ' + car_fim);

            if (this.car_inicio != car_fim) {
                let mes = ((new Date().getMonth() + 1) > 9) ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)
                this.user.data_atualizacao_carro = new Date().getFullYear() + '-' + mes + '-' + new Date().getDate();
                console.log('DIFERENTES');
            } else {
                console.log('IGUAIS');
            }

            this.authService.getUser(this.user.uid).update(this.user).then(data => {
                console.log('ok dados user');
            });

            this.authService.getDriver(this.user.uid).update(this.driver).then(data => {
                this.displayToast("Dados salvos!");
                this.nav.setRoot(HomePage);
            });
        } catch (e) {
            this.showAlert('Erro ao salvar os dados, tente novamente. ');
            console.log(e);
        }

    }

    /*
    chooseFile() {
        document.getElementById('avatar').click();
    }

    upload() {
        // Create a root reference
        let storageRef = firebase.storage().ref();
        let loading = this.loadingCtrl.create({content: 'Aguarde...'});
        loading.present();

        for (let selectedFile of [(<HTMLInputElement>document.getElementById('avatar')).files[0]]) {
            let path = '/users/' + Date.now() + `${selectedFile.name}`;
            let iRef = storageRef.child(path);
            iRef.put(selectedFile).then((snapshot) => {
                loading.dismiss();
                this.user.photoURL = snapshot.downloadURL;
                this.save()
            });
        }
    }
    */
    /*
    // code for uploading licence image
    chooseDocs() {
        document.getElementById('docsPDF').click();
    }

    uploadDocs() {
        let storageRef = firebase.storage().ref();
        let loading = this.loadingCtrl.create({content: 'Aguarde...'});
        loading.present();
        for (let selectedFile of [(<HTMLInputElement>document.getElementById('docsPDF')).files[0]]) {
            let path = '/users/' + Date.now() + `${selectedFile.name}`;
            let iRef = storageRef.child(path);
            iRef.put(selectedFile).then((snapshot) => {
                loading.dismiss();
                this.user.docsURL = snapshot.downloadURL;
            });
        }
    }
    */

    //Tira qualquer foto, plota na tela e já salva no objeto
    takePicture(tipo: any) {
        const options: CameraOptions = {
            quality: 85,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            allowEdit: false,
            targetWidth: window.screen.width,
            targetHeight: window.screen.height,
            sourceType: this.camera.PictureSourceType.CAMERA,
            correctOrientation: true
        };

        this.camera.getPicture(options)
            .then((imageData) => {
                let base64image = 'data:image/jpeg;base64,' + imageData;
                if (tipo == 'SELF') {
                    this.user.photoUrl = base64image;
                }
                if (tipo == 'CNH') {
                    this.user.photoCNH = base64image;
                }
                if (tipo == 'COMPROVANTE') {
                    this.user.photoComprovante = base64image;
                }
                if (tipo == 'DOCCARRO') {
                    this.user.photoDocCarro = base64image;
                }
                if (tipo == 'INSS') {
                    this.user.photoINSS = base64image;
                }
                if (tipo == 'CONDUTAXI_CONDUAPP') {
                    this.user.photoCONDUTAXI_CONDUAPP = base64image;
                }
                if (tipo == 'CSVAPP') {
                    this.user.photoCSVAPP = base64image;
                }
                if (tipo == 'CAR_FRENTE') {
                    this.user.photoCarFrente = base64image;
                }
                if (tipo == 'CAR_TRAS') {
                    this.user.photoCarTraseira = base64image;
                }
                if (tipo == 'CAR_LAT_MOT') {
                    this.user.photoCarLateralMotorista = base64image;
                }
                if (tipo == 'CAR_LAT_PAS') {
                    this.user.photoCarLateralPassageiro = base64image;
                }
                if (tipo == 'CAR_BANCO') {
                    this.user.photoCarBancoTraseiro = base64image;
                }
                if (tipo == 'CAR_PAINEL') {
                    this.user.photoCarPainel = base64image;
                }

                //Atualiza dados passageiro
                this.authService.updateUserProfile(this.user);
            }, (error) => {
                console.error(error);
            })
            .catch((error) => {
                console.error(error);
            })
    }

    // show alert with message
    showAlert(message) {
        let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    }

    getTrips() {
        console.log(this.driver.uid);
        let ref = firebase.database().ref('trips');
        ref.orderByChild("driverId").equalTo(this.driver.uid).on('value', (snapshot: any) => {
            console.log(snapshot.val());
            let tmp = [];
            let earning = 0;
            snapshot.forEach(snap => {
                if (snap.val().status === 'finished') {
                    earning += parseFloat(snap.val().fee);
                    let trip = { key: snap.key, ...snap };
                    tmp.push(trip);
                }
                return false;
            })
            this.tripCount = tmp.length;
            this.totalEarning = earning;
        });
    }


    logout() {
        this.authService.logout().then(() => {
            this.nav.setRoot(LoginPage);
        });
    }

    verifyPhone() {
        if (this.platform.is('core')) {
            this.displayToast("Only Works on Device");
        } else {
            console.log(this.user.phoneNumber);
            (<any>window).AccountKitPlugin.loginWithPhoneNumber({
                useAccessToken: true,
                defaultCountryCode: DEFAULT_COUNTRY_CODE,
                facebookNotificationsEnabled: true,
                initialPhoneNumber: [DEFAULT_COUNTRY_MOBILE_CODE, this.user.phoneNumber]
            }, data => {
                this.displayToast("Verificado com Sucesso");
                this.user.isPhoneVerified = true;
                //this.authService.updateUserProfile(this.user);
            });
        }
    }

    verifyEmail() {
        firebase.auth().currentUser.sendEmailVerification().then(data => {
            this.displayToast("Verifique sua caixa de correio");
        }).catch(err => console.log(err));
    }

    displayToast(message) {
        this.toastCtrl.create({ duration: 2000, message }).present();
    }

    verificaRenavam() {

        var renavam = this.driver.renavam;
        var soma = 0;
        var i = 0;

        if (renavam) {
            if (renavam.length < 11) {
                renavam = renavam.padStart(11, "0");
                this.driver.renavam = renavam;
            }

            if (!renavam.match("[0-9]{11}")) {
                this.renavam_valid = false;
            }

            var renavamSemDigito = renavam.substring(0, 10);
            var renavamReversoSemDigito = renavamSemDigito.split('').reverse().join('');

            // Multiplica as strings reversas do renavam pelos numeros multiplicadores
            // para apenas os primeiros 8 digitos de um total de 10
            // Exemplo: renavam reverso sem digito = 69488936
            // 6, 9, 4, 8, 8, 9, 3, 6
            // * * * * * * * *
            // 2, 3, 4, 5, 6, 7, 8, 9 (numeros multiplicadores - sempre os mesmos [fixo])
            // 12 + 27 + 16 + 40 + 48 + 63 + 24 + 54
            // soma = 284
            for (i = 0; i < 8; i++) {
                let algarismo = parseInt(renavamReversoSemDigito.substring(i, i + 1));
                let multiplicador = i + 2;
                soma += algarismo * multiplicador;
            }

            // Multiplica os dois ultimos digitos e soma
            soma += parseInt(renavamReversoSemDigito.charAt(8)) * 2;
            soma += parseInt(renavamReversoSemDigito.charAt(9)) * 3;

            // mod11 = 284 % 11 = 9 (resto da divisao por 11)
            let mod11 = soma % 11;
            // Faz-se a conta 11 (valor fixo) - mod11 = 11 - 9 = 2
            let ultimoDigitoCalculado = 11 - mod11;

            // ultimoDigito = Caso o valor calculado anteriormente seja 10 ou 11, transformo ele em 0
            // caso contrario, eh o proprio numero
            ultimoDigitoCalculado = (ultimoDigitoCalculado >= 10 ? 0 : ultimoDigitoCalculado);

            // Pego o ultimo digito do renavam original (para confrontar com o calculado)
            let digitoRealInformado = parseInt(renavam.substring(renavam.length - 1, renavam.length));

            // Comparo os digitos calculado e informado
            if (ultimoDigitoCalculado == digitoRealInformado) {
                this.renavam_valid = true;
            } else {
                this.renavam_valid = false;
            }
        }

    }

    showAlertCep() {
        const alert = this.alertCtrl.create({
            title: 'Ocorreu um erro',
            subTitle: 'Não foi posssível encontrar seu endereço pelo CEP informado.',
            buttons: ['OK']
        });
        alert.present();
    }
}
