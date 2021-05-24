import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as fromApp from '../../../core/stores/app.reducer';
import * as authActions from '../../../core/stores/auth/auth.actions';
import * as transactionActions from '../../../core/stores/transactions/transaction.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    isLogin!: boolean;

    constructor(private store: Store<fromApp.AppState>) {}

    ngOnInit(): void {
        this.store
            .select('auth')
            .pipe(map((authState) => authState.user))
            .subscribe((user) => {
                this.isLogin = user !== null ? true : false;
            });
    }

    onNavToAdd() {
        this.store.dispatch(new transactionActions.EditTransactionCancel())
    }
    onLogout() {
        this.store.dispatch(new authActions.Logout());
    }
}
