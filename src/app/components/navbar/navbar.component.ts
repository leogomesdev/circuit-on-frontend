import { Component, Inject } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { AppPropertiesService } from 'src/app/services/app-properties.service';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(
    public nav: NavbarService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    public app: AppPropertiesService
  ) {}

  async signOut(): Promise<void> {
    await this.oktaAuth.signOut();
  }
}
