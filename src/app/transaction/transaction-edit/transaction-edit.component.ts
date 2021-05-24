import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Transaction } from 'src/app/core/model/transaction.model';
import * as transactionAction from 'src/app/core/stores/transactions/transaction.actions';
import * as fromApp from '../../core/stores/app.reducer';

@Component({
    selector: 'app-transaction-edit',
    templateUrl: './transaction-edit.component.html',
    styleUrls: ['./transaction-edit.component.scss'],
})
export class TransactionEditComponent implements OnInit, OnDestroy {
    @ViewChild('myForm') myForm: NgForm;
    form!: FormGroup;
    userUid!: string;
    editId!: string;
    editTransaction!: Transaction;
    isLoading: boolean = false;
    categories: string[];
    formSubscription: Subscription;
    initialFormValue: FormDataEntryValue;
    inputTheSame: boolean = true;

    expenseCategories: string[] = [
        'food',
        'social Life',
        'self development',
        'transportation',
        'culture',
        'household',
        'apparel',
        'beauty',
        'health',
        'education',
        'gift',
        'other',
    ];

    incomeCategories: string[] = ['Allowance', 'Salary', 'Petty cash', 'Bonus', 'Other'];

    constructor(private fb: FormBuilder, private store: Store<fromApp.AppState>, private router: Router) {}

    ngOnInit(): void {
        //Get Edit ID and Edit Transaction
        this.formSubscription = this.store
            .select('transaction')
            .pipe(
                map((transactionState) => {
                    this.isLoading = transactionState.isLoading;
                    this.editId = transactionState.editId !== null ? transactionState.editId : null;
                    if (this.editId !== null) {
                        this.editTransaction = transactionState.transactions.find((transaction) => transaction.id === this.editId);
                    }

                    //Initiate Reactive Form
                    this.initForm();
                    this.initialFormValue = this.form.value;
                }),
                //switch to listen to changes of form
                switchMap(() => {
                    return this.form.valueChanges;
                })
            )
            .subscribe((data) => {
                //Check if edit value user enter has been changed or the same as before edit
                if (JSON.stringify(data) == JSON.stringify(this.initialFormValue)) {
                    this.inputTheSame = true;
                } else {
                    this.inputTheSame = false;
                }
            });

        //Get User UID
        this.store.select('auth').subscribe((authState) => (this.userUid = authState.user?.id));
    }

    initForm() {
        let date = null,
            amount = null,
            note = null,
            categories = null,
            type = null;

        if (this.editTransaction) {
            if (this.editTransaction.type === 'income') {
                this.categories = this.incomeCategories;
            } else {
                this.categories = this.expenseCategories;
            }

            type = this.editTransaction.type;
            date = new Date(this.editTransaction.date);
            amount = this.editTransaction.amount;
            note = this.editTransaction.note;
            categories = this.editTransaction.category;
        }

        this.form = this.fb.group({
            type: [type, [Validators.required]],
            date: [date, [Validators.required]],
            amount: [amount, [Validators.required]],
            note: [note],
            categories: [categories, [Validators.required]],
        });
    }

    onFocusRadioBtn(value) {
        if (value === 'income') return (this.categories = this.incomeCategories);
        return (this.categories = this.expenseCategories);
    }

    onDelete() {
        this.store.dispatch(new transactionAction.DeleteTransaction({ uid: this.userUid, transactionId: this.editId }));
        this.router.navigate(['/transactions']);
    }

    onSubmit() {
        if (this.inputTheSame) {
            this.store.dispatch(new transactionAction.EditTransactionCancel())
            return this.router.navigate(['/transactions']);
        }
        
        if (this.form.valid) {
            const formValue = this.form.value;

            if (this.editId !== null) {
                const newTransaction = new Transaction(
                    formValue.type,
                    new Date(formValue.date).getTime(),
                    formValue.amount,
                    formValue.categories,
                    formValue.note,
                    this.editTransaction.id
                );

                this.store.dispatch(
                    new transactionAction.UpdateTransactionStart({ userUid: this.userUid, editId: this.editId, transaction: newTransaction })
                );
            } else {
                console.log('new');
                const newTransaction = new Transaction(
                    formValue.type,
                    new Date(formValue.date).getTime(),
                    formValue.amount,
                    formValue.categories,
                    formValue.note
                );
                this.store.dispatch(new transactionAction.AddTransactionStart({ uid: this.userUid, transaction: newTransaction }));
            }
        }
    }

    clearForm() {
        this.myForm.resetForm();
    }

    ngOnDestroy() {
        this.formSubscription.unsubscribe();
    }
}
