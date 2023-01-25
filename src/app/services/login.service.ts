import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private router: Router,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private messageService: MessageService
  ) {}

  /**
   * Call third-part login integration.
   * Due SSR limitations, it will try logout in advance
   * In case of error, force user logout
   */
  async signIn(): Promise<void> {
    await this.signOut();
    await this.oktaAuth
      .signInWithRedirect()
      .catch(async (error) => {
        this.messageService.showError(
          'Error, please sign out and try again',
          [JSON.stringify(error)],
          30
        );
      })
      .then(() => this.router.navigate(['/']));
  }

  async signOut(): Promise<void> {
    await this.oktaAuth.signOut().catch((err) => {
      console.log(err);
    });
  }
}
