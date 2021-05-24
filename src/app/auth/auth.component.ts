import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';
import * as fromApp from '../core/stores/app.reducer';
import * as AuthActions from '../core/stores/auth/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
    form!: FormGroup;
    isLogin: boolean = true;
    isLoading: boolean = false;
    returnUrl!: string;

    @ViewChild('authForm') authForm: NgForm;

    constructor(private fb: FormBuilder, private authService: AuthService, private store: Store<fromApp.AppState>, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.initForm();
        this.store.select('auth').subscribe((authState) => (this.isLoading = authState.isLoading));
    }

    initForm() {
        this.form = this.fb.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required, Validators.minLength(6)]],
        });
    }

    onSubmit() {
        if (this.form.valid) {
            const email = this.form.value.email,
                password = this.form.value.password;

            if (this.isLogin) {
                this.store.dispatch(new AuthActions.LoginStart({ email, password }));
            } else {
                this.store.dispatch(new AuthActions.SignupStart({ email, password }));
            }

            this.authForm.resetForm();
        }
    }
}
