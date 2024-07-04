import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class CepProvider {

    constructor(public http: HttpClient) {
    }

    cep(inputCep: string) {
        let resultado: any;
        let cepURL = 'https://viacep.com.br/ws/'+inputCep+'/json';
        return new Promise((resolve, reject) => {
            this.http.get(cepURL)
                .subscribe(function(result){
                    resultado = result;
                    resolve(resultado);
                })
        });
    }
}
