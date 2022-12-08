import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PropagandaViewerComponent } from './propaganda-viewer/propaganda-viewer.component';
import { ApiClientService } from './services/api-client.service';

@NgModule({
  declarations: [AppComponent, PropagandaViewerComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [ApiClientService],
  bootstrap: [AppComponent],
})
export class AppModule {}
