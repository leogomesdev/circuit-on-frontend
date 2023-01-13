import { Component, Inject } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Router } from '@angular/router';
import { AppPropertiesService } from 'src/app/services/app-properties.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(
    private router: Router,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    public app: AppPropertiesService
  ) {}

  async signIn(): Promise<void> {
    await this.oktaAuth
      .signInWithRedirect()
      .then(() => this.router.navigate(['/']));
  }
}
