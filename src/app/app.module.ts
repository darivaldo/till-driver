import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Geolocation} from '@ionic-native/geolocation';
import {IonicStorageModule} from '@ionic/storage';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {MomentModule} from 'angular2-moment';

import {DriverService} from '../services/driver-service';
import {ReportService} from '../services/report-service';
import {TransactionService} from '../services/transaction-service';
import {PlaceService} from "../services/place-service";
import {DealService} from "../services/deal-service";
import {TripService} from "../services/trip-service";
import {AuthService} from "../services/auth-service";
import {SettingService} from "../services/setting-service";
import {SelectCarService} from '../services/select-car-service';

import {HomePage} from '../pages/home/home';
import {JobHistoryPage} from '../pages/job-history/job-history';
import {LoginPage} from '../pages/login/login';
import {PickUpPage} from '../pages/pick-up/pick-up';
import {RegisterPage} from '../pages/register/register';
import {WalletPage} from '../pages/wallet/wallet';
import {UserPage} from "../pages/user/user";
import {Camera} from '@ionic-native/camera/ngx'
import {File} from "@ionic-native/file/ngx";
// end import pages

import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {CnhPicturePage} from "../pages/cnh-picture/cnh-picture";
import {CnhValidationProvider} from '../providers/cnh-validation/cnh-validation';
import {BrMaskerModule} from 'brmasker-ionic-3';
import {BankService} from "../services/bank-service";
import { CepProvider } from '../providers/cep/cep';
import {IndicacaoPage} from "../pages/indicacao/indicacao";
import { CadastroDadoProvider } from '../providers/cadastro-dado/cadastro-dado';
import {TermosPage} from "../pages/termos/termos";
import {GanhosPage} from "../pages/ganhos/ganhos";
import {PrizeService} from "../services/prize-service";
import {PremiosPage} from "../pages/premios/premios";
import {CashbackPage} from "../pages/cashback/cashback";
import { BackgroundMode } from '@ionic-native/background-mode';
import { BackgroundGeolocation } from "@ionic-native/background-geolocation";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/lang/', '.json');
}

// AF2 Settings
export const firebaseConfig = {
    apiKey: "AIzaSyCYXDwRtUucrZnDfsCyNQZelvrbWQMi_bg",
    authDomain: "bumingapp-f10d3.firebaseapp.com",
    databaseURL: "https://bumingapp-f10d3.firebaseio.com",
    projectId: "bumingapp-f10d3",
    storageBucket: "bumingapp-f10d3.appspot.com",
    messagingSenderId: "699781527060"
};

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        JobHistoryPage,
        LoginPage,
        PickUpPage,
        RegisterPage,
        WalletPage,
        UserPage,
        CnhPicturePage,
        IndicacaoPage,
        TermosPage,
        GanhosPage,
        PremiosPage,
        CashbackPage
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicStorageModule.forRoot(),
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        MomentModule,
        IonicModule.forRoot(MyApp, {
            mode: 'md'
        }),
        BrMaskerModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        JobHistoryPage,
        LoginPage,
        PickUpPage,
        RegisterPage,
        WalletPage,
        UserPage,
        CnhPicturePage,
        IndicacaoPage,
        TermosPage,
        GanhosPage,
        PremiosPage,
        CashbackPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Geolocation,
        DriverService,
        ReportService,
        TransactionService,
        PlaceService,
        DealService,
        TripService,
        AuthService,
        SettingService,
        Camera,
        File,
        /* import services */
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        CnhValidationProvider,
        SelectCarService,
        BankService,
        CepProvider,
        CadastroDadoProvider,
        PrizeService,
        BackgroundMode,
        BackgroundGeolocation
        
    ]
})
export class AppModule {
}
