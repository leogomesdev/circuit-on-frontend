import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AngularMaterialModule } from './material.module';
import { ApiClientService } from './services/api/api-client.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DialogScheduleComponent } from './components/schedules/dialog-schedule/dialog-schedule.component';
import { PropagandaViewerComponent } from './propaganda-viewer/propaganda-viewer.component';
import { SchedulesListComponent } from './components/schedules/schedules-list/schedules-list.component';

@NgModule({
  declarations: [
    AppComponent,
    DialogScheduleComponent,
    PropagandaViewerComponent,
    SchedulesListComponent,
  ],
  imports: [
    AngularMaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
  ],
  providers: [ApiClientService],
  bootstrap: [AppComponent],
})
export class AppModule {}
