import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDatepickerInput } from '@angular/material/datepicker';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Transaction } from 'src/app/core/model/transaction.model';
import * as fromApp from '../../core/stores/app.reducer';

@Component({
    selector: 'app-transaction-list',
    templateUrl: './transaction-list.component.html',
    styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent implements OnInit, OnDestroy {
    transactions!: Transaction[];
    uniqueDate!: number[];
    fromDate: Date = null;
    toDate: Date = null;
    filterType: string = null;
    transactionSub: Subscription;

    //Pagination Variables
    pageIndex: number = 0;
    pageSize: number = 5;


    constructor(private store: Store<fromApp.AppState>) {}

    ngOnInit(): void {
        this.transactionSub = this.store.select('transaction').subscribe((data) => {
            this.transactions = data.transactions;
            this.uniqueDate = this.getUniqueDate(this.transactions, this.filterType, this.fromDate, this.toDate);
            
        });
    }


    getUniqueDate(array: Transaction[], type: string | null, from: Date | null, to: Date | null) {
        
        return array
            .filter((transaction) => (type === null ? transaction.type !== type : transaction.type === type))
            .map((transaction) => transaction.date)
            .filter((currentValue, index, array) => {
                return array.indexOf(currentValue) === index;
            })
            .filter(date => {
                if (from && to) {
                    return from.getTime() <= date && date <= to.getTime()
                } else {
                    return date
                }
            })
            .sort((a, b) => {
                return b - a;
            });
    }

    getIncomeByDate(date: number) {
        return this.transactions
            .filter((transaction) => transaction.date === date && transaction.type === 'income')
            .map((transaction) => transaction.amount)
            .reduce((total, current) => total + current, 0);
    }

    getExpenseByDate(date: number) {
        return this.transactions
            .filter((transaction) => transaction.date === date && transaction.type === 'expense')
            .map((transaction) => transaction.amount)
            .reduce((total, current) => total + current, 0);
    }

    onDatePick(value: {start: Date, end: Date}) {
        this.fromDate = value.start ? value.start : null;
        this.toDate = value.end ? value.end : null;
        console.log(typeof this.fromDate);
        this.uniqueDate = this.getUniqueDate(this.transactions, this.filterType, this.fromDate, this.toDate)
    }

    onChangeType(value: string | null) {
        this.filterType = value;
        this.uniqueDate = this.getUniqueDate(this.transactions, this.filterType, this.fromDate, this.toDate)
    }

    onClearDate() {
        this.fromDate = null
        this.toDate = null
        this.uniqueDate = this.getUniqueDate(this.transactions, this.filterType, this.fromDate, this.toDate)
    }

    onPagEvent(event) {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
    }

    ngOnDestroy() {
        this.transactionSub.unsubscribe();
    }
}
