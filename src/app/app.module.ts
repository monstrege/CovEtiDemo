import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }      from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MainComponent } from './view/mainPage.component';

import { CoveoConnectorService } from './service/coveo-connector.service';
import { LoadMaskDirective } from './directive/loadmask.directive';

import { IonRangeSliderModule } from "ng2-ion-range-slider";

const appRoutes: Routes = [{
    path: 'searchText/:searchText/page/:page/sortIndex/:sortIndex', component: MainComponent
  },{
     path: '**', redirectTo: '', component: MainComponent
  }];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoadMaskDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonRangeSliderModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [CoveoConnectorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
