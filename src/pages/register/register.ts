import {Component, ViewChild} from '@angular/core';
import {NavController, LoadingController, AlertController, TextInput, NavParams} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {AuthService} from "../../services/auth-service";
import {TranslateService} from '@ngx-translate/core';
import {File} from "@ionic-native/file/ngx";
import {AngularFireDatabase} from "@angular/fire/database/database";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CepProvider} from "../../providers/cep/cep";
import {HomePage} from "../home/home";
import {TermosPage} from "../termos/termos";


@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})

export class RegisterPage {
    user: any = {};
    origin = '';
    form: FormGroup;
    email: string = "";
    password: string = "";
    name: string = "";
    phoneNumber: string = "";
    endereco: any = [];
    tabs: any = 'profile';
    uid = '';
    me: any = {};
    snapshot: any = [];
    indicadoPor: any;
    buttonText = '';

    photoPreview;
    photo = '';
    isCpfValid: boolean;
    showCpfValidation: boolean;

    @ViewChild('inputFilePhoto')
    inputFilePhoto: TextInput;

    year = null;
    year2 = null;
    currentTime = null;

    constructor(public nav: NavController, public authService: AuthService, public alertCtrl: AlertController, 
                public loadingCtrl: LoadingController, public translate: TranslateService, private navParams: NavParams,
                public file: File, private formBuilder: FormBuilder, public db: AngularFireDatabase,
                public cepProvider: CepProvider) {

        this.form = this.formBuilder.group({
            name: ['', Validators.compose([Validators.required, Validators.maxLength(255)])],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
            password: ['', Validators.compose([Validators.required, Validators.maxLength(14), Validators.minLength(6)])],
            phoneNumber: ['', Validators.compose([Validators.required, Validators.maxLength(15)])],
            itin: ['', Validators.compose([Validators.required, Validators.maxLength(14)])],
            //id_card: ['', Validators.compose([Validators.required, Validators.maxLength(13)])],
            birthdate: ['', Validators.compose([Validators.required])],
            //gender: ['', Validators.compose([Validators.required])],
            //zipcode: ['', Validators.compose([Validators.required])],
            //address: ['', Validators.compose([Validators.required])],
            //number: ['', Validators.compose([Validators.required])],
            //complement: [''],
            //neighborhood: ['', Validators.compose([Validators.required])],
            //city: ['', Validators.compose([Validators.required])],
            //state: ['', Validators.compose([Validators.required])],
            //photo: ['', Validators.compose([Validators.required])],
            indicadoPor: [''],
            minhaIndicacao: ['']
        });

        this.origin = this.navParams.get('origin');

        if (this.origin == 'login') {
            this.snapshot = this.navParams.get('snapshot');
            this.form.controls.indicadoPor.setValue(this.snapshot.codigo_indicacao);
            this.form.controls.minhaIndicacao.setValue(this.snapshot.codigo_afiliacao);
            this.getCadastroDado();
            this.buttonText = 'Salvar Dados';
        } else if (this.origin == 'new') {
            this.indicadoPor = this.navParams.get('indicadoPor');
            this.form.controls.indicadoPor.setValue(this.indicadoPor.codigo_afiliacao);
            this.form.controls.minhaIndicacao.setValue(this.navParams.get('minhaIndicacao'));
            this.buttonText = 'Criar Conta';
        }

        this.dateParams();
    }

    getCadastroDado() {
        let sForm = this.form;

        //Verifica cadastro dado
        sForm.controls.name.setValue(this.snapshot.primeiro_nome + ' ' + this.snapshot.segundo_nome);
        sForm.controls.email.setValue(this.snapshot.email);
        sForm.controls.birthdate.setValue(this.snapshot.data_nascimento);
        sForm.controls.itin.setValue(this.snapshot.cpf);
        //sForm.controls.id_card.setValue(this.snapshot.rg);
        sForm.controls.phoneNumber.setValue(this.snapshot.telefone);
        //sForm.controls.gender.setValue(this.snapshot.sexo);
        //sForm.controls.address.setValue(this.snapshot.endereço);
        //sForm.controls.zipcode.setValue(this.snapshot.cep);
        //sForm.controls.complement.setValue(this.snapshot.complemento);

        /*
        this.cepProvider.cep(this.snapshot.cep)
            .then(data => {
                    this.endereco = data;
                    if (!this.endereco.erro) {
                        sForm.controls.neighborhood.setValue(this.endereco.bairro);
                        sForm.controls.city.setValue(this.endereco.localidade);
                        sForm.controls.state.setValue(this.endereco.uf);
                    }
                }
            );
        */

        const alert = this.alertCtrl.create({
            title: 'Dado App',
            cssClass: 'alertnormal',
            message: 'Verificamos que seu cadastro pode estar incompleto. Por favor, verifique e complete suas informações.',
            buttons: [{
                text: 'OK',
                cssClass: 'oknormalcss',
            }]
        });
        alert.present();
    }

    getDbDado() {
        return this.db.list('pessoas',ref => ref.orderByChild('email').equalTo(this.me.email)).valueChanges();
    }

    /*
    selectPhoto() {
        const nativeElement = this.inputFilePhoto.getElementRef().nativeElement;
        const inputFile = nativeElement.querySelector('input');
        inputFile.click();
    }
    */
    //onChosePhoto(files: FileList) {
    /*if (!files.length) {
        return;
    }

    this.makePhotoPreview(files[0]);
    this.form.get('photo').setValue(files[0]);*/
    //}

    //makePhotoPreview(file: File) {
    /*const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (event: ProgressEvent) => {
        const target = event.target;
        this.photoPreview = (<any>target).result;
    }*/

    //}

    submit() {

        try {

            let loading = this.loadingCtrl.create({content: 'Criando conta...'});
            loading.present();

            this.user = this.form.value;
            let mes = ((new Date().getMonth() + 1) > 9) ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)
            this.user.data_cadastro = new Date().getFullYear() + '-' + mes + '-' + new Date().getDate();

            this.authService.register(this.user).subscribe(authData => {
                loading.dismiss();
                this.nav.setRoot(HomePage);
            }, error => {
                loading.dismiss();
                let alert = this.alertCtrl.create({
                    message: error.message,
                    buttons: ['OK']
                });
                alert.present();
            });
        } catch (e) {
            let alert = this.alertCtrl.create({
                message: e.message,
                buttons: ['OK']
            });
            alert.present();
        }
    }

    dateParams() {
        this.currentTime = new Date();
        this.year = this.currentTime.getFullYear();
        this.year = this.year - 18;
    }

    signup() {
        /* console.log(this.photo);
         if (this.photo){
             let storageRef = firebase.storage().ref();
             let path = '/users/' + Date.now() + this.photo;
             let iRef = storageRef.child(path);
             iRef.put(this.photo).then((snapshot) => {
                 this.userInfo.photoURL = snapshot.downloadURL;
             });
         }
 */
        this.alertCtrl.create({message: 'Demonstração do app Dado.', buttons: ['OK']}).present();
        /* let loading = this.loadingCtrl.create({content: 'Criando conta...'});
         loading.present();
         this.authService.register(this.userInfo).subscribe(() => {
             loading.dismiss();
             this.alertCtrl.create({message: 'Conta criada com sucesso', buttons: ['OK']}).present();
         }, error => {
             loading.dismiss();
             this.alertCtrl.create({message: error.message, buttons: ['OK']}).present();
         });*/
    }

    /*
    async takePicture() {
        this.photo = '';

        const options: CameraOptions = {
            quality: 85,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            allowEdit: true,
            cameraDirection: this.camera.Direction.FRONT,
            targetWidth: window.screen.width,
            targetHeight: window.screen.height,
            sourceType: this.camera.PictureSourceType.CAMERA,
        };

        const photo = await this.camera.getPicture(options)
            .then((imageData) => {
                let base64image = 'data:image/jpeg;base64,' + imageData;
                this.photo = base64image;
                this.writeFile(base64image, 'dadopic', 'dadoavatar.jpg');

            }, (error) => {
                console.error(error);
            })
            .catch((error) => {
                console.error(error);
            });

        console.log(this.photoPreview);
    }
    */

    async getCep() {
        let loading = this.loadingCtrl.create({content: 'Procurando endereço...'});
        loading.present();
        let sForm = this.form;
        let cep = sForm.controls.zipcode.value;

        if (cep.toString().length > 0) {

            try {
                await this.cepProvider.cep(cep)
                    .then(data => {
                        this.endereco = data;
                        loading.dismiss();
                        if (!this.endereco.erro) {
                            sForm.controls.address.setValue(this.endereco.logradouro);
                            sForm.controls.complement.setValue(' ');
                            sForm.controls.neighborhood.setValue(this.endereco.bairro);
                            sForm.controls.city.setValue(this.endereco.localidade);
                            sForm.controls.state.setValue(this.endereco.uf);
                            /*this.user.address = this.endereco.logradouro;
                            this.user.neighborhood = this.endereco.bairro;
                            this.user.city = this.endereco.localidade;
                            this.user.state = this.endereco.uf;
                            this.user.complement = ' ';*/
                        } else {
                            this.showAlertCep();
                        }
                    });
            } catch (e) {
                this.showAlertCep();
            }
        }
    }

    //here is the method is used to write a file in storage
    writeFile(base64Data: any, folderName: string, fileName: any) {
        let content: any;
        let contentType = this.getContentType(base64Data);
        let DataBlob = this.base64toBlob(content, contentType);
        // here iam mentioned this line this.file.externalRootDirectory is a native pre-defined file path storage. You can change a file path whatever pre-defined method.
        let filePath = this.file.externalRootDirectory + folderName;
        this.file.writeFile(filePath, fileName, DataBlob, contentType).then((success) => {
            console.log("File Writed Successfully", success);
            console.log('pic', filePath, fileName);
        }).catch((err) => {
            console.log("Error Occured While Writing File", err);
        })
    }

    //here is the method is used to get content type of an bas64 data
    getContentType(base64Data: any) {
        let block = base64Data.split(";");
        let contentType = block[0].split(":")[1];
        return contentType;
    }

    //here is the method is used to convert base64 data to blob data
    base64toBlob(b64Data, contentType) {
        contentType = contentType || '';
        let sliceSize = 512;
        let byteCharacters = atob(b64Data);
        let byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);
            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        let blob = new Blob(byteArrays, {
            type: contentType
        });
        return blob;
    }

    login() {
        this.nav.setRoot(LoginPage);
    }

    showAlertCep() {
        const alert = this.alertCtrl.create({
            title: 'Ocorreu um erro',
            subTitle: 'Não foi posssível encontrar seu endereço pelo CEP informado.',
            buttons: ['OK']
        });
        alert.present();
    }

    validaCpf(): boolean {

        let sForm = this.form;
        let cpf = sForm.controls.itin.value;
        this.isCpfValid = false;
        this.showCpfValidation = true;

        cpf = cpf.split('.').join('').split('-').join('');

        if (cpf == null) {
            return false;
        }
        if (cpf.length != 11) {
            return false;
        }
        if ((cpf == '00000000000') || (cpf == '11111111111') || (cpf == '22222222222') || (cpf == '33333333333') || (cpf == '44444444444') || (cpf == '55555555555') || (cpf == '66666666666') || (cpf == '77777777777') || (cpf == '88888888888') || (cpf == '99999999999')) {
            return false;
        }
        let numero: number = 0;
        let caracter: string = '';
        let numeros: string = '0123456789';
        let j: number = 10;
        let somatorio: number = 0;
        let resto: number = 0;
        let digito1: number = 0;
        let digito2: number = 0;
        let cpfAux: string = '';
        cpfAux = cpf.substring(0, 9);
        for (let i: number = 0; i < 9; i++) {
            caracter = cpfAux.charAt(i);
            if (numeros.search(caracter) == -1) {
                return false;
            }
            numero = Number(caracter);
            somatorio = somatorio + (numero * j);
            j--;
        }
        resto = somatorio % 11;
        digito1 = 11 - resto;
        if (digito1 > 9) {
            digito1 = 0;
        }
        j = 11;
        somatorio = 0;
        cpfAux = cpfAux + digito1;
        for (let i: number = 0; i < 10; i++) {
            caracter = cpfAux.charAt(i);
            numero = Number(caracter);
            somatorio = somatorio + (numero * j);
            j--;
        }
        resto = somatorio % 11;
        digito2 = 11 - resto;
        if (digito2 > 9) {
            digito2 = 0;
        }
        cpfAux = cpfAux + digito2;
        if (cpf != cpfAux) {
            return false;
        } else {
            this.isCpfValid = true;
            return true;
        }
    }

    goTermos() {
        this.nav.push(TermosPage);
    }
}
