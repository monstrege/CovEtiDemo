import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }      from '@angular/http';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { CoveoConnectorService } from './service/coveo-connector.service';
import { LoadMaskDirective } from './directive/loadmask.directive';

import { IonRangeSliderModule } from "ng2-ion-range-slider";

@NgModule({
  declarations: [
    AppComponent,
    LoadMaskDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonRangeSliderModule
  ],
  providers: [CoveoConnectorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
