import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }      from '@angular/http';
import { NgModule } from '@angular/core';
import { NgGridModule } from 'angular2-grid';

import { AppComponent } from './app.component';

import { CoveoConnectorService } from './service/coveo-connector.service';
import { LoadMaskDirective } from './directive/loadmask.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoadMaskDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    NgGridModule
  ],
  providers: [CoveoConnectorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
