import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import {
  OktaAuth,
  UserClaims,
  CustomUserClaims,
  AuthState,
} from '@okta/okta-auth-js';
import { Router } from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.production';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  username!: string | undefined;

  public isAuthenticated$!: Observable<boolean>;

  public testEnv = environment.envVar.NG_APP_BACKEND_BASE_URL;

  constructor(
    private router: Router,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private oktaStateService: OktaAuthStateService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.oktaStateService.authState$.pipe(
      filter((s: AuthState) => !!s),
      map((s: AuthState) => s.isAuthenticated ?? false)
    );

    this.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.oktaAuth
          .getUser()
          .then(
            (data: UserClaims<CustomUserClaims>) =>
              (this.username = data.given_name)
          );
      }
    });
  }

  async signIn(): Promise<void> {
    await this.oktaAuth
      .signInWithRedirect()
      .then(() => this.router.navigate(['/']));
  }
}
