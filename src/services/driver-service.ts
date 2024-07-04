import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database/database";
import { AuthService } from "./auth-service";

@Injectable()
export class DriverService {
  user: any;
  lat: any;
  lng: any;

  constructor(public db: AngularFireDatabase, public authService: AuthService) {
    this.user = this.authService.getUserData();
  }

  setUser(user) {
    this.user = user;
  }

  // get driver by id
  getDriver() {
    let user = this.authService.getUserData();
    return this.db.object('drivers/' + user.uid);
  }

  getDriverData() {
    let user = this.authService.getUserData();
    return this.db.object('persons/' + user.uid);
  }

  getLatLng(){
    return {"lat": this.lat, "lng":this.lng};
  }

  // update driver's position
  updatePosition(vehicleId, vehicleType, locality, lat, lng, rating, name) {
    let path = 'localities/' + locality + '/' + vehicleType + '/' + vehicleId;
    this.lat = lat;
    this.lng = lng;

    let today = new Date();
    let todayFormated = today.getFullYear() + '-' + this.zerofill((today.getMonth() + 1)) + '-' + this.zerofill(today.getDate()) + ' ' +
      this.zerofill(today.getHours()) + ':' + this.zerofill(today.getMinutes()) + ':' + this.zerofill(today.getSeconds());
    let gmtRegex = /GMT([\-\+]?\d{4})/;
    let gmt = gmtRegex.exec(today.toString())[1];

    this.db.object(path).valueChanges().subscribe((snapshot:any) => {
      // insert if not exists
      if (snapshot.$value === null) {
        this.db.object(path).set({
          lat: lat,
          lng: lng,
          oldLat: lat,
          oldLng: lng,
          last_active: Date.now(),
          date_gps: todayFormated,
          date_gmt: gmt,
          rating: rating,
          name: name
        });

      } else {
        // update
        this.db.object(path).update({
          lat: lat,
          lng: lng,
          oldLat: snapshot.lat,
          oldLng: snapshot.lng,
          last_active: Date.now(),
          date_gps: todayFormated,
          date_gmt: gmt,
          rating: rating,
          name: name
        });
      }
    });
  }

  // update driver's position
  updateGpsLocation(vehicleId, name, country, locality, vehicleType, lat, lng ) {
    let path = 'driversOnline/'+ vehicleId;
    this.lat = lat;
    this.lng = lng;

    let today = new Date();
    let todayFormated = today.getFullYear() + '-' + this.zerofill((today.getMonth() + 1)) + '-' + this.zerofill(today.getDate()) + ' ' +
      this.zerofill(today.getHours()) + ':' + this.zerofill(today.getMinutes()) + ':' + this.zerofill(today.getSeconds());
    let gmtRegex = /GMT([\-\+]?\d{4})/;

    let gmt = gmtRegex.exec(today.toString())[1];

    this.db.object(path).valueChanges().subscribe((snapshot:any) => {
      console.log('driversOnline object:',snapshot);
      // insert if not exists
      if (snapshot.$value === null) {
        
        this.db.object(path).set({
          name: name,
          country: country,
          locality: locality,
          vehicleType,
          lat: lat,
          lng: lng,
          last_active: Date.now(),
          date_gps: todayFormated,
          date_gmt: gmt
        });

      } else {
        // update
        this.db.object(path).update({
          name: name,
          country: country,
          locality: locality,
          vehicleType,
          lat: lat,
          lng: lng,
          last_active: Date.now(),
          date_gps: todayFormated,
          date_gmt: gmt
        });
      }
    });
  }

  zerofill(n: number) {
    if ((n + '').length == 1)
      return '0' + n;
    return n;
  }

}
