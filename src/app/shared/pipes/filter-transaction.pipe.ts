import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from 'src/app/core/model/transaction.model';

@Pipe({
    name: 'filterTransaction',
})
export class FilterTransactionPipe implements PipeTransform {
    transform(transactions: Transaction[], date: number | null, type: string | null): Transaction[] {
        if (!date && !type) return transactions;

        let filterTransactions: Transaction[] = transactions;

        if (date) {
            filterTransactions = transactions.filter((transaction) => transaction.date === date);
        }
        if (type) {
            filterTransactions = filterTransactions.filter((transaction) => transaction.type === type);
        }

        return filterTransactions;
    }
}
