import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { CurrentScheduleListComponent } from '../components/current-schedules/current-schedule-list/current-schedule-list.component';
import { CurrentScheduleViewerComponent } from '../components/current-schedules/current-schedule-viewer/current-schedule-viewer.component';
import { HomeComponent } from '../components/home/home.component';
import { ImagesListComponent } from '../components/images/images-list/images-list.component';
import { SchedulesListComponent } from '../components/schedules/schedules-list/schedules-list.component';

const routes: Routes = [
  {
    path: 'view',
    component: CurrentScheduleViewerComponent,
  },
  {
    path: 'schedules',
    component: SchedulesListComponent,
    canActivate: [OktaAuthGuard],
  },
  {
    path: 'images',
    component: ImagesListComponent,
    canActivate: [OktaAuthGuard],
  },
  {
    path: 'current-schedule',
    component: CurrentScheduleListComponent,
    canActivate: [OktaAuthGuard],
  },
  { path: '', component: HomeComponent },
  {
    path: 'login/callback',
    component: OktaCallbackComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
