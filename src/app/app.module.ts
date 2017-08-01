import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }      from '@angular/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { CoveoConnectorService } from './service/coveo-connector.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [CoveoConnectorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
