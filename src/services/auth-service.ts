import {Injectable} from "@angular/core";
import {AngularFireDatabase} from '@angular/fire/database';
import {AngularFireAuth} from '@angular/fire/auth/auth';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import {
    DRIVER_INIT_BALANCE,
    DRIVER_INIT_RATING,
    EMAIL_VERIFICATION_ENABLED
} from "./constants";

@Injectable()
export class AuthService {
    user: any;

    constructor(public afAuth: AngularFireAuth, public db: AngularFireDatabase) {
    }

    getUserData() { // get current user data from firebase
        return this.afAuth.auth.currentUser;
    }

    getUser(id) { // get person by id
        return this.db.object('persons/' + id);
    }

    getDriver(id) { // get driver by id
        return this.db.object('drivers/' + id);
    }

    login(email, password) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password); // login with email & password
    }

    logout() {
        return this.afAuth.auth.signOut();   // logout from firebase
    }

    // register new account
    register(user: any) {
        return Observable.create(observer => {
            this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then((authData: any) => {
                authData.name = user.name;
                authData.itin = user.itin;

                authData.id_card = '';
                authData.cnh = user.cnh ? user.cnh : '';
                authData.phoneNumber = user.phoneNumber;
                authData.birthdate = user.birthdate;

                authData.gender = '';
                authData.zipcode = '';
                authData.address = '';
                authData.number = '';
                authData.complement = '';
                authData.neighborhood = '';
                authData.city = '';
                authData.state = '';
                authData.country = '';

                authData.photoUrl = user.photo;

                authData.indicadoPor = user.indicadoPor;
                authData.minhaIndicacao = user.minhaIndicacao;

                authData.tipo_condu  = user.tipo_condu ? user.tipo_condu : 'CONDUAPP';
                authData.num_condu = user.num_condu ? user.num_condu : '',

                authData.bank    = user.bank ? user.bank : '';
                authData.agency  = user.agency ? user.agency : '';
                authData.account = user.account ? user.account : '',
                
                authData.data_cadastro  = user.data_cadastro,
                authData.data_atualizacao_carro = ''
                
                authData.isPhoneVerified = false;
                authData.isEmailVerified = false;
                if (EMAIL_VERIFICATION_ENABLED === true)
                    this.getUserData().sendEmailVerification();
                // update passenger object
                this.updateUserProfile(authData);
                observer.next();
            }).catch((error: any) => {
                if (error) {
                    observer.error(error);
                }
            });
        });
    }

    // update user display name and photo
    updateUserProfile(user) {
        console.log(user);
        let name = user.name;
        let photoUrl = user.photoUrl ? user.photoUrl : '';
        let photoCNH = user.photoCNH ? user.photoCNH : '';
        let photoComprovante = user.photoComprovante ? user.photoComprovante : '';
        let photoDocCarro = user.photoDocCarro ? user.photoDocCarro : '';
        let photoINSS = user.photoINSS ? user.photoINSS : '';
        let photoCONDUTAXI_CONDUAPP = user.photoCONDUTAXI_CONDUAPP ? user.photoCONDUTAXI_CONDUAPP : '';
        let photoCSVAPP = user.photoCSVAPP ? user.photoCSVAPP : '';
        let photoCarFrente = user.photoCarFrente ? user.photoCarFrente : '';
        let photoCarTraseira = user.photoCarTraseira ? user.photoCarTraseira : '';
        let photoCarLateralMotorista = user.photoCarLateralMotorista ? user.photoCarLateralMotorista : '';
        let photoCarLateralPassageiro = user.photoCarLateralPassageiro ? user.photoCarLateralPassageiro : '';
        let photoCarBancoTraseiro = user.photoCarBancoTraseiro ? user.photoCarBancoTraseiro : '';
        let photoCarPainel = user.photoCarPainel ? user.photoCarPainel : '';

        this.getUserData().updateProfile({
            displayName: name,
            photoURL: photoUrl
        });

        // create or update person
        this.db.object('persons/' + user.uid).update({
            name: name,
            itin: user.itin,
            id_card: user.id_card,
            cnh: user.cnh ? user.cnh : '',
            birthdate: user.birthdate,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            zipcode: user.zipcode,
            address: user.address,
            number: user.number,
            complement: user.complement,
            neighborhood: user.neighborhood,
            city: user.city,
            state: user.state,
            tipo_condu: user.tipo_condu ? user.tipo_condu : 'CONDUAPP',
            num_condu: user.num_condu ? user.num_condu : '',
            photoUrl: photoUrl,
            photoCNH: photoCNH,
            photoComprovante: photoComprovante,
            photoDocCarro: photoDocCarro,
            photoINSS: photoINSS,
            photoCONDUTAXI_CONDUAPP: photoCONDUTAXI_CONDUAPP,
            photoCSVAPP: photoCSVAPP,
            photoCarFrente: photoCarFrente,
            photoCarTraseira: photoCarTraseira,
            photoCarLateralMotorista: photoCarLateralMotorista,
            photoCarLateralPassageiro: photoCarLateralPassageiro,
            photoCarBancoTraseiro: photoCarBancoTraseiro,
            photoCarPainel: photoCarPainel,
            indicadoPor: user.indicadoPor,
            minhaIndicacao: user.minhaIndicacao,
            bank: user.bank ? user.bank : '',
            agency: user.agency ? user.agency : '',
            account: user.account ? user.account : '',
            isPhoneVerified: false,
            isEmailVerified: false,
            data_cadastro: user.data_cadastro ? user.data_cadastro : '',
            data_atualizacao_carro: user.data_atualizacao_carro ? user.data_atualizacao_carro : ''
        });

        this.db.object('drivers/' + user.uid).update({
            rating: DRIVER_INIT_RATING,
            balance: DRIVER_INIT_BALANCE,
            canRide: false
        });
    }

    // create new user if not exist
    createUserIfNotExist(user) {
        // check if user does not exist
        this.getUser(user.uid).valueChanges().subscribe((snapshot : any) => {
            if (snapshot.$value === null) {
                // update passenger object
                this.updateUserProfile(user);
            }
        });
    }
}
