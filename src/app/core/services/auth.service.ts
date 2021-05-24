import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../model/user.model';
import * as fromApp from '../stores/app.reducer';
import * as AuthActions from '../stores/auth/auth.actions';

export interface authRes {
    idToken?: string;
    email?: string;
    refreshToken?: string;
    expiresIn?: string;
    localId?: string;
    registered?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    signupUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
    emailVerifyUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=';
    signinUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
    getUserDataUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=';
    loginUser!: User;
    autoLogoutTimer!: any;

    constructor(private http: HttpClient, private store: Store<fromApp.AppState>) {}

    signUp(email: string, password: string) {
        return this.http
            .post<authRes>(this.signupUrl + environment.firebaseAPI, {
                email,
                password,
                returnSecureToken: true,
            })
            .pipe(
                map((ResData) => ResData.idToken),
                concatMap((idToken) => {
                    return this.sendEmailVerfication(idToken);
                })
            );
    }

    sendEmailVerfication(idToken) {
        return this.http.post(this.emailVerifyUrl + environment.firebaseAPI, {
            requestType: 'VERIFY_EMAIL',
            idToken,
        });
    }

    signIn(email: string, password: string) {
        return this.http
            .post<authRes>(this.signinUrl + environment.firebaseAPI, {
                email,
                password,
                returnSecureToken: true,
            })
            .pipe(
                tap((resData) => {
                    let expireDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
                    this.loginUser = new User(resData.email, resData.localId, resData.idToken, expireDate);
                }),
                map((resData) => resData.idToken),
                concatMap((idToken) => this.getUserData(idToken)),
                map((resData) => {
                    if (resData.users[0].emailVerified) {
                        localStorage.setItem('userData', JSON.stringify(this.loginUser));

                        let timeleft = new Date(this.loginUser.tokenExpreDate).getTime() - new Date().getTime();

                        this.setLogoutTimer(timeleft)
                    }
                    return resData.users[0].emailVerified;
                })
            );
    }

    getUserData(idToken: string) {
        return this.http.post<any>(this.getUserDataUrl + environment.firebaseAPI, {
            idToken,
        });
    }

    handleError(errorRes) {
        let errorMessage = 'An unknown error occurred!';
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct.';
                break;
            case 'INVALID_ID_TOKEN':
                errorMessage = 'Invalid Token ID.';
                break;
            default:
                errorMessage = 'An unknown error occurred!';
                break;
        }

            return errorMessage
    }

    setLogoutTimer(timeleft) {
        this.autoLogoutTimer = setTimeout(() => {
            this.store.dispatch(new AuthActions.Logout())
        },timeleft)
    }
}
