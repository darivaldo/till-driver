import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CadastroDadoProvider {

  constructor(public http: HttpClient) {
  }

  searchUserData(inputCPF: string) {
    let resultado: any;
    let dadoURL = 'http://bumingapi.bumingapp.com.br/public/api/v1/cadastro/verify/'+inputCPF;
    return new Promise((resolve, reject) => {
      this.http.get(dadoURL)
          .subscribe(function(result){
            resultado = result;
            resolve(resultado);
          }, () => {
            reject('0');
          })
    });
  }

  searchAffiliateByCode(inputCode: string) {
    let resultado: any;
    let dadoURL = 'http://bumingapi.bumingapp.com.br/public/api/v1/afiliados/search/'+inputCode;
    return new Promise((resolve, reject) => {
      this.http.get(dadoURL)
          .subscribe(function(result){
            resultado = result;
            resolve(resultado);
          }, () => {
            reject('0');
          })
    });
  }

  verifyAffiliateCode(inputCode: string){
    let resultado: any;
    let dadoURL = 'http://bumingapi.bumingapp.com.br/public/api/v1/afiliados/verify/'+inputCode;
    return new Promise((resolve, reject) => {
      this.http.get(dadoURL)
          .subscribe(function(result){
            resultado = result;
            resolve(resultado);
          }, () => {
            reject('0');
          })
    });
  }

  searchByEmail(inputEmail: string){
    let resultado: any;
    let dadoURL = 'http://bumingapi.bumingapp.com.br/public/api/v1/cadastro/search/'+inputEmail;
    return new Promise((resolve, reject) => {
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
