import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap, map } from 'rxjs/operators';
import { Transaction } from '../model/transaction.model';

export class TransactionByMonth {
    constructor(public year: number, public month: number, public income: number, public expense: number) {}
}

export class TransactionByType {
    constructor(public year: number, public type: string, public category: string, public amount: number) {}
}

@Injectable({
    providedIn: 'root',
})
export class TransactionService {
    userUid: string = '';
    getTransactionsUrlBase = `https://angular-transaction-default-rtdb.firebaseio.com/transactions`;

    constructor(private http: HttpClient) {}

    getTransactions(uid) {
        const getTransactionUrl = `${this.getTransactionsUrlBase}/${uid}.json`;
        return this.http.get(getTransactionUrl);
    }

    postTransaction(loginUserUid, transaction: Transaction) {
        const getTransactionUrl = `${this.getTransactionsUrlBase}/${loginUserUid}.json`;
        return this.http.post(getTransactionUrl, transaction).pipe(
            map((ResData: { name: string }) => ResData.name),
            concatMap((pushId) => {
                return this.patchTransaction(loginUserUid, pushId, { ...transaction, id: pushId });
            })
        );
    }

    patchTransaction(uid, transactionId, transaction: Transaction) {
        const patchTransactionUrl = `${this.getTransactionsUrlBase}/${uid}/${transactionId}.json`;
        return this.http.patch(patchTransactionUrl, transaction);
    }

    deleteTransaction(uid, transactionId) {
        const deleteTransactionUrl = `${this.getTransactionsUrlBase}/${uid}/${transactionId}.json`;
        return this.http.delete(deleteTransactionUrl);
    }

    getMonthName(month: number): string {
        let monthName: string;
        switch (month) {
            case 0:
                return (monthName = 'January');

            case 1:
                return (monthName = 'February');

            case 2:
                return (monthName = 'March');

            case 3:
                return (monthName = 'Arpil');

            case 4:
                return (monthName = 'May');

            case 5:
                return (monthName = 'June');

            case 6:
                return (monthName = 'July');

            case 7:
                return (monthName = 'August');

            case 8:
                return (monthName = 'September');

            case 9:
                return (monthName = 'October');

            case 10:
                return (monthName = 'November');

            case 11:
                return (monthName = 'December');

            default:
                break;
        }
        return monthName;
    }

    getUniqueValue(array: TransactionByMonth[], filter: string) {
        if (filter === 'month') {
            return array
                .map((transaction) => transaction.month)
                .filter((month, index, array) => {
                    return array.indexOf(month) === index;
                });
        } else if (filter === 'year') {
            return array
                .map((transaction) => transaction.year)
                .filter((year, index, array) => {
                    return array.indexOf(year) === index;
                });
        }
    }

    groupTransactionByMonth(array: Transaction[]): TransactionByMonth[] {
        let result: TransactionByMonth[] = [];
        // let resultItem: TransactionByMonth;

        for (let item of array) {
            let itemYear = new Date(item.date).getFullYear();
            let itemMonth = new Date(item.date).getMonth();
            let itemIncome = item.type === 'income' ? item.amount : 0;
            let itemExpense = item.type === 'expense' ? item.amount : 0;

            let duplicateIndex = result.findIndex((resultItem) => resultItem.month === itemMonth);
            if (duplicateIndex === -1) {
                result.push(new TransactionByMonth(itemYear, itemMonth, itemIncome, itemExpense));
            } else {
                result[duplicateIndex].income += itemIncome;
                result[duplicateIndex].expense += itemExpense;
            }
        }
        return result;
    }

    groupTransactionByType(array: Transaction[]): TransactionByType[] {
        let result: TransactionByType[] = [];

        for (let transaction of array) {
            const year = new Date(transaction.date).getFullYear();
            const duplicateIndex = result.findIndex((item) => {
                return item.category === transaction.category && item.type === transaction.type && item.year === year;
            });

            if (duplicateIndex === -1) {
                result.push(new TransactionByType(year, transaction.type, transaction.category, transaction.amount));
            } else {
                result[duplicateIndex].amount += transaction.amount
            }
        }

        return result;
    }
}
