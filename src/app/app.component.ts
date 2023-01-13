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
import { filter, map, Subscription } from 'rxjs';
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
    this.app.isAuthenticated$ = this.oktaStateService.authState$.pipe(
      filter((s: AuthState) => !!s),
      map((s: AuthState) => s.isAuthenticated ?? false)
    );

    this.oktaStateServiceSubscription = this.app.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        if (isAuthenticated) {
          this.oktaAuth.getUser().then((data: UserClaims<CustomUserClaims>) => {
            this.app.username = data.given_name;
          });
        } else {
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
