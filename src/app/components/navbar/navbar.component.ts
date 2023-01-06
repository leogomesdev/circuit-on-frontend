import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import {
  OktaAuth,
  UserClaims,
  CustomUserClaims,
  AuthState,
} from '@okta/okta-auth-js';
import { filter, map, Observable } from 'rxjs';

import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  username!: string | undefined;

  public isAuthenticated$!: Observable<boolean>;

  constructor(
    public nav: NavbarService,
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
        this.oktaAuth.getUser().then((data: UserClaims<CustomUserClaims>) => {
          this.username = data.given_name;
        });
      }
    });
  }

  async signOut(): Promise<void> {
    await this.oktaAuth.signOut();
  }
}
