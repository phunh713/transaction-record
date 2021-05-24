import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Transaction } from 'src/app/core/model/transaction.model';
import { EditTransaction } from 'src/app/core/stores/transactions/transaction.actions';
import * as fromApp from '../../core/stores/app.reducer';

@Component({
    selector: 'app-transaction-detail',
    templateUrl: './transaction-detail.component.html',
    styleUrls: ['./transaction-detail.component.scss'],
})
export class TransactionDetailComponent implements OnInit {
    @Input() transaction!: Transaction;

    constructor(private store: Store<fromApp.AppState>, private router: Router) {}

    ngOnInit(): void {
    }

    onSelect() {
        this.store.dispatch(new EditTransaction(this.transaction.id));
        this.router.navigate(['/edit']);
    }
}
