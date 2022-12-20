import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropagandaViewerComponent } from '../propaganda-viewer/propaganda-viewer.component';
import { SchedulesListComponent } from '../components/schedules/schedules-list/schedules-list.component';

const routes: Routes = [
  {
    path: 'view',
    component: PropagandaViewerComponent,
  },
  { path: 'schedules-list', component: SchedulesListComponent },
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
