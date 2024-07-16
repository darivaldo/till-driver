import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database/database';
import {AngularFireAuth} from '@angular/fire/auth/auth';

@Injectable()
export class SelectCarService {

    constructor(public http: HttpClient, public afAuth: AngularFireAuth, public db: AngularFireDatabase) {
    }

    getBrands() {
        return this.db.list('/brands');
    }

    getModelsByBrand(brand) {
        return this.db.list('models',ref => ref.orderByChild('brand').equalTo(brand)).valueChanges();
   }

    async getCarType(brand, model) {

        let resultado: any;
        let dadoURL = 'http://bumingapi.bumingapp.com.br/public/api/v1/cartype/verify/?brand='+brand+'&model='+model;
        return await new Promise((resolve, reject) => {
            this.http.get(dadoURL)
                .subscribe(function(result){
                    resultado = result;
                    resolve(resultado);
                }, () => {
                    reject('0');
                })
        });
    }

    async getUFs(){
        let resultado: any;
        let dadoURL = 'http://bumingapi.bumingapp.com.br/public/api/v1/uf/';
        return await new Promise((resolve, reject) => {
            this.http.get(dadoURL)
                .subscribe(function(result){
                    resultado = result;
                    resolve(resultado);
                }, () => {
                    reject('0');
                })
        });

    }

    async getMunicipios(uf){
        let resultado: any;
        let dadoURL = 'http://bumingapi.bumingapp.com.br/public/api/v1/municipios/?uf='+uf;
        return await new Promise((resolve, reject) => {
            this.http.get(dadoURL)
                .subscribe(function(result){
                    resultado = result;
                    resolve(resultado);
                }, () => {
                    reject('0');
                })
        });

    }
}
