import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import {
  AuthState,
  CustomUserClaims,
  OktaAuth,
  UserClaims,
} from '@okta/okta-auth-js';
import { Subscription } from 'rxjs';
import { AppPropertiesService } from './services/app-properties.service';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private oktaStateServiceSubscription!: Subscription;

  constructor(
    private oktaStateService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    public messageService: MessageService,
    public app: AppPropertiesService
  ) {}

  ngOnInit(): void {
    this.app.changePropertiesBasedOnSize();
    this.oktaStateServiceSubscription =
      this.oktaStateService.authState$.subscribe(
        async (authState: AuthState) => {
          if (authState.isAuthenticated) {
            const userClaims: UserClaims<CustomUserClaims> =
              await this.oktaAuth.getUser();
            this.app.username = userClaims.given_name;
            this.app.isAuthenticated = true;
          } else {
            this.app.isAuthenticated = false;
            this.app.username = undefined;
          }
        }
      );
  }

  ngOnDestroy(): void {
    if (this.oktaStateServiceSubscription) {
      this.oktaStateServiceSubscription.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.app.changePropertiesBasedOnSize();
  }
}
