import { Transaction } from '../../model/transaction.model';
import * as TransactionActions from './transaction.actions';

export interface State {
    transactions: Transaction[];
    editId: string | null;
    isLoading: boolean;
    message: string | null;
}

const initialState: State = {
    transactions: [],
    editId: null,
    isLoading: false,
    message: null,
};

export function transactionReducer(state: State = initialState, action: TransactionActions.TransactionActions): State {
    switch (action.type) {
        case TransactionActions.GET_TRANSACTIONS_START:
            return { ...state, isLoading: true, message: null, transactions: [] };

        case TransactionActions.GET_TRANSACTIONS_SUCCESS:
            return { ...state, transactions: action.payload, isLoading: false };

        case TransactionActions.GET_TRANSACTIONS_FAIL:
            return { ...state, transactions: [], isLoading: false };

        case TransactionActions.ADD_TRANSACTION_START:
            return { ...state, isLoading: true, message: null };

        case TransactionActions.ADD_TRANSACTION_SUCCESS:
            return { ...state, transactions: [...state.transactions, action.payload], isLoading: false, message: 'Add New Transaction Successfully' };

        case TransactionActions.ADD_TRANSACTION_FAIL:
            return { ...state, isLoading: false };

        case TransactionActions.EDIT_TRANSACTION:
            return { ...state, editId: action.payload, message: null };

        case TransactionActions.EDIT_TRANSACTION_CANCEL:
            return {...state, editId: null, message: null}

        case TransactionActions.UPDATE_TRANSACTION_START:
            return {
                ...state,
                editId: null,
                isLoading: true,
                message: null,
                transactions: state.transactions.map((transaction) => {
                    return state.editId === transaction.id ? { ...transaction, ...action.payload.transaction } : transaction;
                }),
            };

        case TransactionActions.UPDATE_TRANSACTION_SUCCESS:
            console.log('UPDATE_TRANSACTION_SUCCESS');
            return { ...state, isLoading: false, message: 'Update Transaction Successfully' };

        case TransactionActions.DELETE_TRANSACTION:
            console.log('DELETE_TRANSACTION');
            return {
                ...state,
                editId: null,
                message: 'Delete Transaction Successfully',
                transactions: state.transactions.filter((transaction) => {
                    return transaction.id !== state.editId;
                }),
            };

        default:
            return state;
    }
}
