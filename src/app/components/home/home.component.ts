import { Component, Inject } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Router } from '@angular/router';
import { AppPropertiesService } from 'src/app/services/app-properties.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(
    private router: Router,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private messageService: MessageService,
    public app: AppPropertiesService
  ) {}

  /**
   * Call third-part login integration.
   * Due SSR limitations, it will try logout in advance
   * In case of error, force user logout
   */
  async signIn(): Promise<void> {
    await this.oktaAuth.signOut();
    await this.oktaAuth
      .signInWithRedirect()
      .catch(async (error) => {
        this.messageService.showError(
          'Error, please try again',
          [JSON.stringify(error)],
          30
        );
        await this.oktaAuth.signOut();
      })
      .then(() => this.router.navigate(['/']));
  }
}
