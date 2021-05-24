import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { User } from '../../model/user.model';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions, private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

    @Effect()
    authLoginStart = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((resData: AuthActions.LoginStart) => {
            return this.authService.signIn(resData.payload.email, resData.payload.password).pipe(
                map((isEmailVerified) => {
                    if (isEmailVerified) {
                        return new AuthActions.LoginSuccess({ user: this.authService.loginUser, redirect: true, message: 'Login Successfully' });
                    } else {
                        return new AuthActions.LoginFail('email is not Verified');
                    }
                }),
                catchError((err) => {
                    let errMess = this.authService.handleError(err);
                    return of(new AuthActions.LoginFail(errMess));
                })
            );
        })
    );

    @Effect()
    authSignupStart = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((resData: AuthActions.SignupStart) => {
            return this.authService.signUp(resData.payload.email, resData.payload.password).pipe(
                map((res: { email: string }) => {
                    return new AuthActions.SignupSuccess('A verification email has been sent to ' + res.email);
                }),
                catchError((err) => {
                    let message = this.authService.handleError(err);
                    return of(new AuthActions.SignupFail(message));
                })
            );
        })
    );

    @Effect({ dispatch: false })
    authRedirect = this.actions$.pipe(
        ofType(AuthActions.LOGIN_SUCCESS),
        tap((action: AuthActions.LoginSuccess) => {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] ? this.route.snapshot.queryParams['returnUrl'] : '/';
            if (action.payload.redirect) {
                this.router.navigate([returnUrl]);
            }
        })
    );

    @Effect({ dispatch: false })
    authlogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            this.router.navigate(['/welcome']);
            clearTimeout(this.authService.autoLogoutTimer);
            localStorage.removeItem('userData');
        })
    );

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_AUTO),
        map(() => {
            const userFromLocalStorage: {
                email: string;
                id: string;
                _token: string;
                _tokenExpireDate: string;
            } = JSON.parse(localStorage.getItem('userData'));

            if (userFromLocalStorage) {
                const autoLoginUser = new User(
                    userFromLocalStorage.email,
                    userFromLocalStorage.id,
                    userFromLocalStorage._token,
                    new Date(userFromLocalStorage._tokenExpireDate)
                );

                if (autoLoginUser.token) {
                    const timeleft = new Date(autoLoginUser.tokenExpreDate).getTime() - new Date().getTime();
                    console.log(timeleft);
                    this.authService.setLogoutTimer(timeleft);

                    return new AuthActions.LoginSuccess({ user: autoLoginUser, redirect: false, message: '' });
                }
            }
        }),
        filter((action) => action !== undefined)
    );
}
