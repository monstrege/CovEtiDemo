import { Component, OnInit } from '@angular/core';
import { NgGridModule } from 'angular2-grid';
import { Subject } from 'rxjs/Subject';

import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/switchMap";

import { CoveoConnectorService } from './service/coveo-connector.service';
import { LoadMaskDirective } from './directive/loadmask.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit{
  title = 'Boozle';
  private language = 'fr';
  public readonly emptyMessage = "Aucun choix";
  private searchText = new Subject<String>();
  public resultList: any[] = [];
  private imputText: String;
  private loading:boolean = false;
  private sortOptions: any[];
  private activeSortIndex: number;
  private selectedRow: number;
  private prizeName = (this.language === 'fr' ? "Prix" : "Prize") + " ";
  private myMinVar = 0;
  
  constructor(private coveoConnectorService:CoveoConnectorService){}

  ngOnInit() {
    this.sortOptions = this.coveoConnectorService.sortOptions;
    this.coveoConnectorService.activeSortIndex.subscribe(value => this.activeSortIndex = value);
    this.coveoConnectorService.loading.subscribe(loading => this.loading = loading);

    this.searchText
      .debounceTime(250) 
      .switchMap(inputText => this.coveoConnectorService.search(inputText, "058c85fd-3c79-42a3-9236-b83d35588103"))
      .subscribe((vals: any[]) => this.resultList = vals);
  }

  ngOnDestroy(){
    if(this.coveoConnectorService.activeSortIndex){
      this.coveoConnectorService.activeSortIndex.unsubscribe()
    }

    if(this.coveoConnectorService.loading){
      this.coveoConnectorService.loading.unsubscribe()
    }
  }

  search(imputText: String){
    this.imputText = imputText;
    // if(imputText){
      this.searchText.next(imputText);
    // } 
  }

  sortBy(sort: number){
    this.coveoConnectorService.setSort(sort);
    if(this.imputText){
      this.search(this.imputText);
    }
  }

  expandRow(index: number){
    if(index === this.selectedRow){
      this.selectedRow = null;
    } else {
      this.selectedRow = index;
    }
  }

  fakeArray(length: number){
    return Array(length).fill(1);
  }


  // Prize Scoll:
  prizeScrollOnUpdate(event){
    console.log(event);
  }

  prizeScrollOnChange(event){
    console.log(event);
  }

  prizeScrollOnFinish(event){
    console.log(event);
  }
}
