import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Transaction } from '../core/model/transaction.model';
import * as fromApp from '../core/stores/app.reducer';
import * as transactionAction from '../core/stores/transactions/transaction.actions';
import { Chart } from 'node_modules/chart.js';
import { TransactionByMonth, TransactionByType, TransactionService } from '../core/services/transaction.service';
import { State } from '../core/stores/transactions/transaction.reducer';

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit, OnDestroy {
    @ViewChild('barChart') barChart: ElementRef;

    authStoreSub: Subscription;
    transactionStoreSub: Subscription;
    transactions: Transaction[] = [];
    uniqueMonths: string[] = [];

    unfilteredTransactionsByMonth: TransactionByMonth[] = [];
    transactionsByMonth: TransactionByMonth[] = [];

    unfilteredTransactionsByType: TransactionByType[] = [];
    transactionsByType: TransactionByType[] = [];

    totalIncome: number;
    totalExpense: number;
    yearsList: number[];
    noTransaction: boolean = false;

    constructor(private store: Store<fromApp.AppState>, private transactionService: TransactionService) {}

    ngOnInit(): void {
        
        console.log(this.barChart)
        this.authStoreSub = this.store
            .select('auth')
            .pipe(
                map((authState) => {
                    return authState.user ? authState.user.id : null;
                })
            )
            .subscribe((uid: string) => {
                if (uid) {
                    this.store.dispatch(new transactionAction.GetTransactionsStart(uid));
                    return;
                }
                this.store.dispatch(new transactionAction.GetTransactionsFail());
            });

        this.transactionStoreSub = this.store
            .select('transaction')
            .pipe(
                //take(2),
                tap((transactionState) => {
                    this.unfilteredTransactionsByMonth = this.transactionService
                        .groupTransactionByMonth(transactionState.transactions)
                        .sort((a, b) => {
                            return a.month - b.month;
                        });
                    this.yearsList = this.transactionService.getUniqueValue(this.unfilteredTransactionsByMonth, 'year');
                }),
                tap((transactionState) => {
                    this.unfilteredTransactionsByType = this.transactionService
                        .groupTransactionByType(transactionState.transactions)
                        .map((transaction: TransactionByType) => {
                            return { ...transaction, category: transaction.category.toLowerCase() };
                        })
                        .sort((a, b) => {
                            if (a.category > b.category) return 1;
                            if (a.category < b.category) return -1;
                            if (a.category === b.category) return 0;
                        });
                })
            )
            .subscribe((transactionState: State) => {
                this.displayOverview(this.yearsList[0]);
            });
    }

    displayOverview(year: number) {
        //
        this.transactionsByMonth = this.unfilteredTransactionsByMonth.filter((transaction) => transaction.year === year);

        this.totalExpense = this.transactionsByMonth.reduce((previous, current) => previous + current.expense, 0);
        this.totalIncome = this.transactionsByMonth.reduce((previous, current) => previous + current.income, 0);

        this.barChartDisplay();

        //
        this.transactionsByType = this.unfilteredTransactionsByType.filter((transaction) => transaction.year === year);
        this.doughnutChartDisplay('income', 'incomeDoughnutChart');
        this.doughnutChartDisplay('expense', 'expenseDoughnutChart');
    }

    onSelectYear(event) {
        this.displayOverview(event.value);
    }

    barChartDisplay() {
        const barChart = new Chart('barChart', {
            type: 'bar',
            data: {
                labels: this.transactionsByMonth.map((transaction) => this.transactionService.getMonthName(transaction.month)),
                datasets: [
                    {
                        label: 'Income',
                        data: this.transactionsByMonth.map((transaction) => transaction.income),
                        backgroundColor: '#2a9d8f',
                    },
                    {
                        label: 'Expense',
                        data: this.transactionsByMonth.map((transaction) => -transaction.expense),
                        backgroundColor: '#03071e',
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    yAxes: [
                        {
                            stacked: true,
                            gridLines: {
                                display: false,
                            },
                            ticks: {
                                beginAtZero: true,
                                userCallback: function (value, index, values) {
                                    return Intl.NumberFormat().format(value);
                                },
                            },
                        },
                    ],
                    xAxes: [
                        {
                            stacked: true,
                            gridLines: {
                                display: false,
                            },
                        },
                    ],
                    scaleLabel: {},
                },
            },
        });
    }

    doughnutChartDisplay(type: string, chartId: string) {
        let myChart = new Chart(chartId, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: this.transactionsByType.filter((transaction) => transaction.type === type).map((transaction) => transaction.amount),
                        label: 'dataset 1',
                        backgroundColor: [
                            '#03071e',
                            '#073b4c',
                            '#118ab2',
                            '#2a9d8f',
                            '#83c5be',
                            '#edf6f9',
                            '#ffddd2',
                            '#e9c46a',
                            '#f4a261',
                            '#e76f51',
                            '#d00000',
                        ],
                    },
                ],
                labels: this.transactionsByType.filter((transaction) => transaction.type === type).map((transaction) => transaction.category),
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                legend: { position: 'bottom', align: 'start', labels: { boxWidth: 10 } },
            },
        });
    }

    ngOnDestroy() {
        console.log('transaction component destroyed');
        this.authStoreSub.unsubscribe();
        this.transactionStoreSub.unsubscribe();
    }
}
