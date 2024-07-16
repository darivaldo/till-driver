import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class PrizeService {

    constructor(public http: HttpClient) {
    }

    async getPrizes(itin: string) {

        let itin_nbn = itin.replace(/[./-]/g, '');

        let resultado: any;
        let dadoURL = 'http://bumingapi.bumingapp.com.br/public/api/v1/awards/?itin='+itin_nbn;
        // let dadoURL = 'http://dadoapi.test/api/v1/awards/?itin=' + itin_nbn;
        return await new Promise((resolve, reject) => {
            this.http.get(dadoURL)
                .subscribe(function (result) {
                    resultado = result;
                    resolve(resultado);
                }, () => {
                    reject('0');
                })
        });

    }

    getNetworkPrizes(){
        let resultado: any;
        let dadoURL = 'http://bumingapi.bumingapp.com.br/public/api/v1/netprizes/';
        // let dadoURL = 'http://dadoapi.test/api/v1/netprizes/';
        return new Promise((resolve, reject) => {
            this.http.get(dadoURL)
                .subscribe(function (result) {
                    resultado = result;
                    resolve(resultado);
                }, () => {
                    reject('0');
                })
        });
    }

    async getCashbackPrizes(itin: string){
        let itin_nbn = itin.replace(/[./-]/g, '');

        let resultado: any;
        let dadoURL = 'http://bumingapi.bumingapp.com.br/public/api/v1/cashback/?itin=' + itin_nbn;
        // let dadoURL = 'http://dadoapi.test/api/v1/cashback/?itin=' + itin_nbn;
        return await new Promise((resolve, reject) => {
            this.http.get(dadoURL)
                .subscribe(function (result) {
                    resultado = result;
                    resolve(resultado);
                }, () => {
                    reject('0');
                })
        });
    }

}
