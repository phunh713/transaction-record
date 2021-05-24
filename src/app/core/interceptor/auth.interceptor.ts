import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';
import * as fromApp from '../../core/stores/app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private store: Store<fromApp.AppState>) {}

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return this.store.select('auth').pipe(
            take(1),
            concatMap((authState) => {
                if (!authState.user) {
                    return next.handle(req);
                }
                const modifiedReq = req.clone({
                    params: new HttpParams().set('auth',authState.user.token)
                })
                return next.handle(modifiedReq)
            })
        );
    }
}
