import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable()
export class BankService {

    constructor(public http: HttpClient, public afAuth: AngularFireAuth, public db: AngularFireDatabase) {
    }

    getBanks(){
        return this.db.list('/bancos');
    }

}
