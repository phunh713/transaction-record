import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { Transaction } from '../model/transaction.model';
import * as fromApp from '../stores/app.reducer';
import * as transactionActions from '../stores/transactions/transaction.actions';

@Injectable({
    providedIn: 'root',
})
export class TransactionResolver implements Resolve<Transaction[]> {
    constructor(private store: Store<fromApp.AppState>, private action$: Actions) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Transaction[]> {
        return this.store.select('transaction').pipe(
            take(1),
            map((authState) => {
                return authState.transactions;
            }),
            withLatestFrom(this.store.select('auth')),
            switchMap(([transactions, authState]) => {
                
                if (transactions.length === 0) {
                    this.store.dispatch(new transactionActions.GetTransactionsStart(authState.user.id));

                    return this.action$.pipe(
                        ofType(transactionActions.GET_TRANSACTIONS_SUCCESS, transactionActions.GET_TRANSACTIONS_FAIL),
                        // take(1) //Observable needs to complete for resolver to finish => Take 1 can do it
                    );
                } else {
                    return of(transactions);
                }
            })
        );
    }
}
