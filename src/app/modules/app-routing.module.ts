import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
  { path: 'schedules', component: SchedulesListComponent },
  { path: 'images', component: ImagesListComponent },
  { path: 'current-schedule', component: CurrentScheduleListComponent },
  { path: '', component: HomeComponent },
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
