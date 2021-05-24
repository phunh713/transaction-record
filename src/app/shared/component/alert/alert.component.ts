import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { merge, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromApp from '../../../core/stores/app.reducer';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit, OnDestroy {
    alertMessageSub: Subscription;
    message!: string;

    constructor(private snackBar: MatSnackBar, private store: Store<fromApp.AppState>) {}

    ngOnInit(): void {
        const authAlertMessageSub = this.store.select('auth').pipe(
            map((authState) => {
                return authState.alertMessage;
            })
        );

        const transactionAlertMessageSub = this.store.select('transaction').pipe(
            map((transaction) => {
                return transaction.message;
            })
        );

        merge(authAlertMessageSub, transactionAlertMessageSub).subscribe((mess) => {
            if (mess) {
                this.snackBar.open(mess, 'Close', {
                    duration: 1500,
                    panelClass: ['custom'],
                });
            }
        });
    }

    ngOnDestroy() {}
}
