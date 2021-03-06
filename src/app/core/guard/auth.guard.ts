import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {  map, take } from 'rxjs/operators';
import * as fromApp from '../stores/app.reducer'

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private store: Store<fromApp.AppState>, private router: Router) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return this.store.select('auth').pipe(
            take(1),
            map(authState => {
                const isAuth = !! authState.user
                

                if (isAuth) {
                    return true;
                }
                console.log(isAuth)
                this.router.navigate(['/welcome'], {queryParams: {returnUrl: state.url}})
                return false
            })
        )

        
    }
}
