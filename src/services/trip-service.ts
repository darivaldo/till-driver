import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database/database";
import {
  TRIP_STATUS_WAITING,
  TRIP_STATUS_GOING,
  TRIP_STATUS_FINISHED,
  TRIP_STATUS_CANCELED,
  TRIP_STATUS_NOTIFIED
} from "./constants";
import { AuthService } from "./auth-service";

@Injectable()
export class TripService {
  currentTrip: any;

  constructor(public db: AngularFireDatabase, public authService: AuthService) {
  }

  // create trip from deal object
  createFromDeal(deal) {
    deal.status = TRIP_STATUS_WAITING;
    deal.otp = Math.floor(Math.random() * 9999);
    return this.db.list('trips').push(deal);
  }

  notify(tripId){
    this.db.object('trips/' + tripId).update({
      notifiedAt: Date.now(),
      status: TRIP_STATUS_NOTIFIED
    })
  }

  // pickup passenger
  pickUp(tripId) {
    this.db.object('trips/' + tripId).update({
      pickedUpAt: Date.now(),
      status: TRIP_STATUS_GOING
    })
  }

  // drop off
  dropOff(tripId) {
    this.db.object('trips/' + tripId).update({
      droppedOffAt: Date.now(),
      status: TRIP_STATUS_FINISHED
    })
  }

  cancel(tripId) {
    this.db.object('trips/' + tripId).update({
      droppedOffAt: Date.now(),
      status: TRIP_STATUS_CANCELED
    })
  }

  setCurrentTrip(tripId) {
    return this.db.object('trips/' + tripId).valueChanges().subscribe((snapshot : any) => {
      this.currentTrip = snapshot;
    });
  }

  getCurrentTrip() {
    console.log(this.currentTrip);
    return this.currentTrip;
  }

  getTripStatus(tripId){
    return this.db.object('trips/' + tripId);
  }

  getPassenger(passengerId) {
    return this.db.object('passengers/' + passengerId);
  }

  // get driver's trip
  getTrips() {
    let user = this.authService.getUserData();
    return this.db.list('trips',ref => ref.orderByChild('driverId').equalTo(user.uid)).valueChanges();
  }
}
