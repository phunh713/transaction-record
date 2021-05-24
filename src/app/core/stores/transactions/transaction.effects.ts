import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, tap } from 'rxjs/operators';
import { Transaction } from '../../model/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import * as transactionActions from './transaction.actions';
import { Router } from '@angular/router';

@Injectable()
export class TransactionEffects {
    constructor(private action$: Actions, private transactionService: TransactionService, private router: Router) {}

    @Effect()
    getTransactions = this.action$.pipe(
        ofType(transactionActions.GET_TRANSACTIONS_START),
        switchMap((resData: transactionActions.GetTransactionsStart) => {
            return this.transactionService.getTransactions(resData.payload).pipe(
                map((resData) => {
                    if (resData === null) {
                        console.log('from transaction effect')
                        return new transactionActions.GetTransactionsFail();
                    }

                    //TODO: create Transaction[] from resData
                    const transactions: Transaction[] = [];
                    for (let key in resData) {
                        transactions.push(resData[key]);
                    }

                    return new transactionActions.GetTransactionsSuccess(transactions);
                })
            );
        })
    );

    @Effect()
    postTransactions = this.action$.pipe(
        ofType(transactionActions.ADD_TRANSACTION_START),
        switchMap((action: transactionActions.AddTransactionStart) => {
            return this.transactionService.postTransaction(action.payload.uid, action.payload.transaction).pipe(
                map((patchRes: { id: string }) => {
                    this.router.navigate(['/transactions']);
                    return new transactionActions.AddTransactionSuccess({ ...action.payload.transaction, id: patchRes.id });
                })
            );
        })
    );

    @Effect()
    updateTransaction = this.action$.pipe(
        ofType(transactionActions.UPDATE_TRANSACTION_START),
        switchMap((action: transactionActions.UpdateTransactionStart) => {
            return this.transactionService.patchTransaction(action.payload.userUid, action.payload.editId, action.payload.transaction).pipe(
                map(() => {
                    this.router.navigate(['/transactions']);
                    return new transactionActions.UpdateTransactionSuccess();
                })
            );
        })
    );

    @Effect({ dispatch: false })
    deleteTransaction = this.action$.pipe(
        ofType(transactionActions.DELETE_TRANSACTION),
        tap((action: transactionActions.DeleteTransaction) => {
            this.transactionService.deleteTransaction(action.payload.uid, action.payload.transactionId).subscribe();
        })
    );
}
