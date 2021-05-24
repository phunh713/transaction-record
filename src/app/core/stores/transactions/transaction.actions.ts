import { Action } from '@ngrx/store';
import { Transaction } from '../../model/transaction.model';

export const GET_TRANSACTIONS_START = '[Transaction] Get Transactions Start';
export const GET_TRANSACTIONS_SUCCESS = '[Transaction] Get Transactions Success';
export const GET_TRANSACTIONS_FAIL = '[Transaction] Get Transactions Fail';
export const GET_TRANSACTION = '[Transaction] Get Transaction';

export const ADD_TRANSACTION_START = '[Transaction] Add Transaction Start';
export const ADD_TRANSACTION_SUCCESS = '[Transaction] Add Transaction Success';
export const ADD_TRANSACTION_FAIL = '[Transaction] Add Transaction Fail';

export const EDIT_TRANSACTION = '[Transaction] Edit Transaction';
export const EDIT_TRANSACTION_CANCEL = '[Transaction] Edit Transaction Cancel';
export const UPDATE_TRANSACTION_START = '[Transaction] Update Transaction Start';
export const UPDATE_TRANSACTION_SUCCESS = '[Transaction] Update Transaction Success';

export const DELETE_TRANSACTION = '[Transaction] Delete Transaction';

export class GetTransactionsStart implements Action {
    readonly type = GET_TRANSACTIONS_START;
    constructor(public payload: string) {}
}

export class GetTransactionsSuccess implements Action {
    readonly type = GET_TRANSACTIONS_SUCCESS;
    constructor(public payload: Transaction[]) {}
}

export class GetTransactionsFail implements Action {
    readonly type = GET_TRANSACTIONS_FAIL;
}

export class GetTransaction implements Action {
    readonly type = GET_TRANSACTION;
    constructor(public payload: { id: number }) {}
}

export class AddTransactionStart implements Action {
    readonly type = ADD_TRANSACTION_START;
    constructor(public payload: { uid: string; transaction: Transaction }) {}
}

export class AddTransactionSuccess implements Action {
    readonly type = ADD_TRANSACTION_SUCCESS;
    constructor(public payload: Transaction) {}
}

export class AddTransactionFail implements Action {
    readonly type = ADD_TRANSACTION_FAIL;
}

export class EditTransaction implements Action {
    readonly type = EDIT_TRANSACTION;
    constructor(public payload: string) {}
}

export class EditTransactionCancel implements Action {
    readonly type = EDIT_TRANSACTION_CANCEL;
}

export class UpdateTransactionStart implements Action {
    readonly type = UPDATE_TRANSACTION_START;
    constructor(public payload: { userUid: string; editId: string; transaction: Transaction }) {}
}

export class UpdateTransactionSuccess implements Action {
    readonly type = UPDATE_TRANSACTION_SUCCESS;
}

export class DeleteTransaction implements Action {
    readonly type = DELETE_TRANSACTION;
    constructor(public payload: { uid: string; transactionId: string }) {}
}

export type TransactionActions =
    | GetTransactionsStart
    | GetTransactionsSuccess
    | GetTransactionsFail
    | GetTransaction
    | EditTransaction
    | EditTransactionCancel
    | AddTransactionStart
    | AddTransactionSuccess
    | AddTransactionFail
    | UpdateTransactionStart
    | UpdateTransactionSuccess
    | DeleteTransaction;
