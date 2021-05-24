import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionComponent } from './transaction.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';
import { TransactionEditComponent } from './transaction-edit/transaction-edit.component';
import { TransactionRoutingModule } from './transaction-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [TransactionComponent, TransactionListComponent, TransactionDetailComponent, TransactionEditComponent],
  imports: [
    CommonModule,
    TransactionRoutingModule,
    SharedModule
  ]
})
export class TransactionModule { }
