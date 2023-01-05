import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgxColorsModule } from 'ngx-colors';

import { AngularMaterialModule } from './modules/angular-material.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './modules/app-routing.module';
import { CurrentSchedulesApiService } from './services/api/current-schedules-api.service';
import { CurrentScheduleViewerComponent } from './components/current-schedules/current-schedule-viewer/current-schedule-viewer.component';
import { DialogImageComponent } from './components/images/dialog-image/dialog-image.component';
import { DialogImageViewComponent } from './components/shared/dialog-image-view/dialog-image-view.component';
import { DialogScheduleComponent } from './components/schedules/dialog-schedule/dialog-schedule.component';
import { ImagesListComponent } from './components/images/images-list/images-list.component';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SchedulesListComponent } from './components/schedules/schedules-list/schedules-list.component';
import { SnackbarMessageComponent } from './components/shared/snackbar-message/snackbar-message.component';
import { SpinnerComponent } from './components/shared/spinner/spinner.component';
import { CurrentScheduleListComponent } from './components/current-schedules/current-schedule-list/current-schedule-list.component';

@NgModule({
  declarations: [
    AppComponent,
    CurrentScheduleViewerComponent,
    DialogImageComponent,
    DialogImageViewComponent,
    DialogScheduleComponent,
    ImagesListComponent,
    SafeHtmlPipe,
    SchedulesListComponent,
    SnackbarMessageComponent,
    SpinnerComponent,
    CurrentScheduleListComponent,
  ],
  imports: [
    AngularMaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    NgxColorsModule,
  ],
  providers: [
    CurrentSchedulesApiService,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
