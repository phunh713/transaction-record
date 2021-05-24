import { User } from '../../model/user.model';
import * as authActions from './auth.actions';

export interface State {
    user: User;
    isLoading: boolean;
    alertMessage: string;
}

const initialState: State = {
    user: null,
    isLoading: false,
    alertMessage: null,
};

export function authReducer(state: State = initialState, action: authActions.AuthActions) {
    switch (action.type) {
        case authActions.LOGIN_START:
            return { ...state, user: null, isLoading: true, alertMessage: null };

        case authActions.LOGIN_SUCCESS:
            return { ...state, user: action.payload.user, isLoading: false, alertMessage: action.payload.message };

        case authActions.LOGIN_FAIL:
            return { ...state, user: null, isLoading: false, alertMessage: action.payload };

        case authActions.LOGOUT:
            return { ...state, user: null, isLoading: false, alertMessage: 'You are Logged Out' };

        case authActions.SIGNUP_START:
            return { ...state, user: null, isLoading: true, alertMessage: null };

        case authActions.SIGNUP_FAIL:
            return { ...state, user: null, isLoading: false, alertMessage: action.payload };

        case authActions.SIGNUP_SUCCESS:
            return { ...state, user: null, isLoading: false, alertMessage: action.payload };

        default:
            return state;
    }
}
