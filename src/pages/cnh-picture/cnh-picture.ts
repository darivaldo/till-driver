import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {CnhValidationProvider} from "../../providers/cnh-validation/cnh-validation";
import {RegisterPage} from "../register/register";

@IonicPage()
@Component({
    selector: 'page-cnh-picture',
    templateUrl: 'cnh-picture.html',
})
export class CnhPicturePage {
    photo: string = '';

    constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera,
                public cnhValidation: CnhValidationProvider, public loading: LoadingController) {
    }

    ionViewDidLoad() {
    }

    takePicture() {
        this.photo = '';

        const options: CameraOptions = {
            quality: 85,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            allowEdit: false,
            targetWidth:  window.screen.width,
            targetHeight: window.screen.height,
        };

        this.camera.getPicture(options)
            .then((imageData) => {
                let base64image = 'data:image/jpeg;base64,' + imageData;
                this.photo = base64image;
                let loader = this.loading.create({
                    content: "Validando Documento..."
                });

                loader.present();

                this.cnhValidation.getCnhData(this.photo).subscribe(result => {
                    loader.dismiss();
                    this.navCtrl.push(RegisterPage, {'result': result});
                });

            }, (error) => {
                console.error(error);
            })
            .catch((error) => {
                console.error(error);
            })


    }

}
