import { ActionReducerMap } from '@ngrx/store';
import * as fromTransaction from './transactions/transaction.reducer';
import * as fromAuth from './auth/auth.reducer';

export interface AppState {
    transaction: fromTransaction.State;
    auth: fromAuth.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    transaction: fromTransaction.transactionReducer,
    auth: fromAuth.authReducer,
};
