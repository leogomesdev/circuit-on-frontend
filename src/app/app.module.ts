import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgxColorsModule } from 'ngx-colors';
import { OKTA_CONFIG, OktaAuthModule } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

import { AngularMaterialModule } from './modules/angular-material.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './modules/app-routing.module';
import { CurrentScheduleListComponent } from './components/current-schedules/current-schedule-list/current-schedule-list.component';
import { CurrentScheduleViewerComponent } from './components/current-schedules/current-schedule-viewer/current-schedule-viewer.component';
import { DialogImageComponent } from './components/images/dialog-image/dialog-image.component';
import { DialogImageViewComponent } from './components/shared/dialog-image-view/dialog-image-view.component';
import { DialogScheduleComponent } from './components/schedules/dialog-schedule/dialog-schedule.component';
import { HomeComponent } from './components/home/home.component';
import { ImagesListComponent } from './components/images/images-list/images-list.component';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SchedulesListComponent } from './components/schedules/schedules-list/schedules-list.component';
import { SnackbarMessageComponent } from './components/shared/snackbar-message/snackbar-message.component';
import { SpinnerComponent } from './components/shared/spinner/spinner.component';
import { environment } from 'src/environments/environment';

const config = {
  issuer: environment.envVar.NG_APP_OKTA_ISSUER,
  clientId: environment.envVar.NG_APP_OKTA_CLIENT_ID,
  redirectUri: environment.envVar.NG_APP_OKTA_REDIRECT_URI,
};
console.log('okta config: ' + JSON.stringify(config));
const oktaAuth = new OktaAuth(config);

@NgModule({
  declarations: [
    AppComponent,
    CurrentScheduleListComponent,
    CurrentScheduleViewerComponent,
    DialogImageComponent,
    DialogImageViewComponent,
    DialogScheduleComponent,
    HomeComponent,
    ImagesListComponent,
    NavbarComponent,
    SafeHtmlPipe,
    SchedulesListComponent,
    SnackbarMessageComponent,
    SpinnerComponent,
  ],
  imports: [
    AngularMaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    NgxColorsModule,
    OktaAuthModule,
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: OKTA_CONFIG,
      useValue: { oktaAuth },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
