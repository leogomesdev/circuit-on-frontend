import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PropagandaViewerComponent } from './propaganda-viewer/propaganda-viewer.component';
import { PropagandaViewerService } from './services/propaganda-viewer.service';

@NgModule({
  declarations: [AppComponent, PropagandaViewerComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [PropagandaViewerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
