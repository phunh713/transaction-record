import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionResolver } from '../core/resolver/transaction.resolver';
import { TransactionEditComponent } from './transaction-edit/transaction-edit.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionComponent } from './transaction.component';

const routes: Routes = [
    { path: '', component: TransactionComponent },
    { path: 'add', component: TransactionEditComponent, resolve: [TransactionResolver] },
    { path: 'edit', component: TransactionEditComponent },
    { path: 'transactions', component: TransactionListComponent, resolve: [TransactionResolver] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TransactionRoutingModule {}
