import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropagandaViewerComponent } from './propaganda-viewer/propaganda-viewer.component';

const routes: Routes = [
  {
    path: 'view',
    component: PropagandaViewerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
