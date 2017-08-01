import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/switchMap";

import { CoveoConnectorService } from './service/coveo-connector.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent /*implements OnInit*/{
  title = 'Boozle';
  private searchText = new Subject<String>();
  private resultList: any[];


  constructor(private coveoConnectorService:CoveoConnectorService){}

  ngOnInit() {
    this.searchText
      .debounceTime(100) 
      .distinctUntilChanged()
      .switchMap(inputText => this.coveoConnectorService.search(inputText, "058c85fd-3c79-42a3-9236-b83d35588103"))
      .subscribe((vals) => {
        this.resultList = vals;
      });
  }

  search(imputText: String){
    this.searchText.next(imputText);
  }
}
