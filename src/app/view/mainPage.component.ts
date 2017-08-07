import { Component, OnInit } from '@angular/core';
import { NgGridModule } from 'angular2-grid';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, RouterState, ParamMap, Router } from '@angular/router';
import {Location} from '@angular/common';



import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/switchMap";

import { CoveoConnectorService } from '../service/coveo-connector.service';
import { LoadMaskDirective } from '../directive/loadmask.directive';

@Component({
  selector: 'main-page',
  templateUrl: './mainPage.html'
})

export class MainComponent implements OnInit{
  title = 'Boozle';
  private language = 'fr';
  public readonly emptyMessage = "Aucun choix";
  public inputText: string;
  private searchText = new Subject<string>();
  public resultList: any[] = [];
  public loading:boolean = false;
  private sortOptions: any[];
  private activeSortIndex: number;
  private selectedRow: number;
  private prizeName = (this.language === 'fr' ? "Prix" : "Prize") + " ";
  private myMinVar = 0;
  public resultPrizeMin = 0;
  public resultPrizeMax = 0;
  public totalPage: number;
  private activePage: number;
  
  constructor(private coveoConnectorService:CoveoConnectorService, private router: Router, private route: ActivatedRoute, private location: Location){}

  ngOnInit() {
     this.route.params.subscribe(params => {
         this.coveoConnectorService.setPage(params['page']);
         this.inputText = params['searchText'];
         this.coveoConnectorService.setSearchText(params['searchText']);
         this.coveoConnectorService.setSort(params['sortIndex']);

         if(params['searchText']){
             this.coveoConnectorService.search();
         }
    });

    this.sortOptions = this.coveoConnectorService.sortOptions;
    this.coveoConnectorService.activeSortIndex.subscribe(value => this.activeSortIndex = value);
    this.coveoConnectorService.loading.subscribe(loading => this.loading = loading);
    this.coveoConnectorService.results.subscribe((vals: any[]) => this.resultList = vals);
    this.coveoConnectorService.resultMin.subscribe((resultPrizeMin: number) => this.resultPrizeMin = resultPrizeMin);
    this.coveoConnectorService.resultMax.subscribe((resultPrizeMax: number) => this.resultPrizeMax = resultPrizeMax);
    this.coveoConnectorService.totalCount.subscribe((totalCount: number) => this.totalPage = Math.ceil(totalCount/this.coveoConnectorService.pageSize));
    this.coveoConnectorService.activePage.subscribe((activePage: number) => this.activePage = activePage);

    this.searchText
      .debounceTime(300) 
      .subscribe((inputText: string) => {
        this.inputText = inputText;
        this.coveoConnectorService.setSearchText(inputText);
        this.navigate();
       })
  }

  ngOnDestroy(){
    if(this.coveoConnectorService.activeSortIndex && this.coveoConnectorService.activeSortIndex.unsubscribe){
      this.coveoConnectorService.activeSortIndex.unsubscribe()
    }

    if(this.coveoConnectorService.loading && this.coveoConnectorService.loading.unsubscribe){
      this.coveoConnectorService.loading.unsubscribe()
    }
    
    if(this.searchText && this.searchText.unsubscribe){
      this.searchText.unsubscribe()
    }
    
    if(this.coveoConnectorService.resultMin && this.coveoConnectorService.resultMin.unsubscribe){
      this.coveoConnectorService.resultMin.unsubscribe()
    }
    
    if(this.coveoConnectorService.resultMax && this.coveoConnectorService.resultMax.unsubscribe){
      this.coveoConnectorService.resultMax.unsubscribe()
    }
    
    if(this.coveoConnectorService.totalCount && this.coveoConnectorService.totalCount.unsubscribe){
      this.coveoConnectorService.totalCount.unsubscribe()
    }
    
    if(this.coveoConnectorService.activePage && this.coveoConnectorService.activePage.unsubscribe){
      this.coveoConnectorService.activePage.unsubscribe()
    }
  }

  setSearchText(inputText: string){
    this.resultPrizeMin = null;
    this.resultPrizeMax = null;
    this.searchText.next(inputText);
  }

  sortBy(sort: number){
    this.coveoConnectorService.setSort(sort);
    this.navigate();

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
    console.log("prizeScrollOnUpdate");
    console.log(event);
  }

  prizeScrollOnChange(event){
    // console.log("prizeScrollOnChange");
    // console.log(event);
  }

  prizeScrollOnFinish(event){
    this.coveoConnectorService.setPrizeRange(event.from, event.to);
  }

  goToPreviousPage(){
    this.coveoConnectorService.setPage(+this.activePage - 1);
    this.navigate();
  }

  goToNextPage(){
    this.coveoConnectorService.setPage(+this.activePage + 1);
    this.navigate();
  }

  goToPage(page: string){
    this.coveoConnectorService.setPage(+page);
    this.navigate();
  }

  navigate(){
    let stringBuilder = "";

    if(this.coveoConnectorService.searchText){
        stringBuilder += "/searchText/" + this.coveoConnectorService.searchText;

        if(this.activePage){
            stringBuilder += "/page/" + this.activePage;
        }
        
        if(this.coveoConnectorService.activeSortIndex.getValue()){
            stringBuilder += "/sortIndex/" + this.coveoConnectorService.activeSortIndex.getValue();
        }
    }    
    
    this.location.replaceState(stringBuilder);
    this.coveoConnectorService.search();
  }
}
