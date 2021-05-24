import { Action } from '@ngrx/store';
import { User } from '../../model/user.model';


export const SIGNUP_START = '[Auth] Signup Start';
export const SIGNUP_SUCCESS = '[Auth] Signup Sucess';
export const SIGNUP_FAIL = '[Auth] Signup Fail';
export const LOGIN_START = '[Auth] Login Start';
export const LOGIN_SUCCESS = '[Auth] Login Success';
export const LOGIN_FAIL = '[Auth] Login Fail';
export const LOGIN_AUTO = '[Auth] Login Auto';
export const LOGOUT = '[Auth] Logout';

export class SignupStart implements Action {
    readonly type = SIGNUP_START;
    constructor(public payload: { email: string; password: string }) {}
}

export class SignupSuccess implements Action {
    readonly type = SIGNUP_SUCCESS;
    constructor(public payload: string) {}
}

export class SignupFail implements Action {
    readonly type = SIGNUP_FAIL;
    constructor(public payload: string) {}
}

export class LoginStart implements Action {
    readonly type = LOGIN_START;
    constructor(public payload: { email: string; password: string }) {}
}

export class LoginSuccess implements Action {
    readonly type = LOGIN_SUCCESS;
    constructor(public payload: {user:User, redirect: boolean, message: string}) {}
}

export class LoginFail implements Action {
    readonly type = LOGIN_FAIL;
    constructor(public payload: string) {}
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class LoginAuto implements Action {
    readonly type = LOGIN_AUTO;
}

export type AuthActions = SignupStart | SignupSuccess | SignupFail |LoginStart | LoginSuccess | Logout | LoginFail | LoginAuto;

