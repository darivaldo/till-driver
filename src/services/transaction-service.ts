import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database/database";
import { AuthService } from "./auth-service";
import { TRANSACTION_TYPE_WITHDRAW } from "./constants";

@Injectable()
export class TransactionService {
  constructor(public db: AngularFireDatabase, public authService: AuthService) {
  }

  getTransactions() {
    let user = this.authService.getUserData();
    console.log(user);
    return this.db.list('transactions',ref => ref.orderByChild('userId').equalTo(user.uid)).valueChanges();
  }

  widthDraw(amount: number, balance: number) {
    let user = this.authService.getUserData();
    return this.db.list('transactions/').push({
      userId: user.uid,
      name: user.displayName,
      amount: amount,
      createdAt: Date.now(),
      type: TRANSACTION_TYPE_WITHDRAW,
      status: 'PENDING'
    });
  }
}
