import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';

const routes: Routes = [
    { path: '', loadChildren: () => import('./transaction/transaction.module').then((m) => m.TransactionModule), canActivate: [AuthGuard] },
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule) },
    {path: 'welcome', loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomeModule)}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
