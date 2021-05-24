import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './core/stores/app.reducer';
import * as authAction from './core/stores/auth/auth.actions';
import * as transactionAction from './core/stores/transactions/transaction.actions';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor(private store: Store<fromApp.AppState>) {}

    ngOnInit() {
        this.store.dispatch(new authAction.LoginAuto());
    }
}
