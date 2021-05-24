import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './component/header/header.component';
import { ModalComponent } from './component/modal/modal.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ThousandSeparatorDirective } from './directives/thousand-separator.directive';
import { AlertComponent } from './component/alert/alert.component';
import { SpinnerComponent } from './component/spinner/spinner.component';
import { FilterTransactionPipe } from './pipes/filter-transaction.pipe';
import { FilterDateRangePipe } from './pipes/filter-date-range.pipe';
import { PaginationPipe } from './pipes/pagination.pipe';

@NgModule({
    declarations: [
        HeaderComponent,
        ModalComponent,
        ThousandSeparatorDirective,
        AlertComponent,
        SpinnerComponent,
        FilterTransactionPipe,
        FilterDateRangePipe,
        PaginationPipe,
    ],
    imports: [CommonModule, MaterialModule, RouterModule, ReactiveFormsModule],
    exports: [
        HeaderComponent,
        ModalComponent,
        ReactiveFormsModule,
        MaterialModule,
        ThousandSeparatorDirective,
        AlertComponent,
        SpinnerComponent,
        FilterTransactionPipe,
        FilterDateRangePipe,
        PaginationPipe
    ],
})
export class SharedModule {}
