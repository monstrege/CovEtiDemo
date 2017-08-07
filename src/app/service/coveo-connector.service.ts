import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/of'
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class CoveoConnectorService {
  private url:String = "https://cloudplatform.coveo.com/rest/";
  private lastToken: String;
  private sort:number;
  public loading = new BehaviorSubject<boolean>(false);
  public results: BehaviorSubject<any[]> = new BehaviorSubject(null);
  public resultMin: BehaviorSubject<number> = new BehaviorSubject(null);
  public resultMax: BehaviorSubject<number> = new BehaviorSubject(null);
  public pageSize = 10;
  public activePage: BehaviorSubject<number> = new BehaviorSubject(1);
  public totalCount: Subject<number> = new Subject();
  private getSubscription;



  private searchParam = {
     "numberOfResults": this.pageSize,
     "sortCriteria": ""
  }

  public searchText: string;
  public activeSortIndex: BehaviorSubject<number> = new BehaviorSubject(0);
  public prizeMin: number;
  public prizeMax: number;

  private _sortOptions: any[] = [{
    fr: 'Pertinence',
    en: 'Relevance',
    key: ''
  },{
    fr: 'Prix ascendant',
    en: 'Price Ascending',
    key: 'ascending'
  },{
    fr: 'Prix descendant',
    en: 'Price Descending',
    key: 'descending'
  }];

  get sortOptions(){
    return this._sortOptions;
  }
  
  constructor(private http: Http) { }

  ngOnDestroy(){
    if(this.getSubscription && this.getSubscription.unsubscribe){
      this.getSubscription.unsubscribe();
    }
  }

  public search(){
    this.loading.next(true);
    const queryIdentifier: String = 'search';

    this.getSubscription = this.http
      .get(this.queryBuilder(queryIdentifier, "058c85fd-3c79-42a3-9236-b83d35588103"), {params: this.searchParam})
      .map((r: Response) => r.json())
      .subscribe(response=> {
        this.loading.next(false);
        this.totalCount.next(response.totalCount);
        if(!this.prizeMin && !this.prizeMax){
          this.resultMin.next(Math.min.apply(Math,response.results.map(function(o){return o.raw.tpprixnum || 0;})));
          this.resultMax.next(Math.max.apply(Math,response.results.map(function(o){return o.raw.tpprixnum || 0;})));
        }
        this.results.next(response.results)
      });
  }

  private queryBuilder(queryIdentifier: String, token:String){
    let queryItems:String[] = [
      this.url,
      queryIdentifier,
      '?',
      "access_token=" + token,
      '&q=' + this.searchText,
      this.prizeMax ? " @tpprixnum<=" + this.prizeMax: '',
      this.prizeMin ? " @tpprixnum>=" + this.prizeMin: '',
    ];
    return queryItems.join('');
  }

  setSearchText(searchText: string){
    if(searchText === this.searchText){
      return;
    }
    this.searchText = searchText;
    this.prizeMin = null;
    this.prizeMax = null;
  }

  setSort(sortIndex: number){
    if(sortIndex === this.activeSortIndex.getValue()){
      return;
    }

    sortIndex = sortIndex || 0;

    this.activeSortIndex.next(sortIndex);
    this.prizeMin = null;
    this.prizeMax = null;

    this.searchParam.sortCriteria = !!this.sortOptions[sortIndex].key ? "@tpprixnum " + this.sortOptions[sortIndex].key : "";
  }

  setPrizeRange(min: number, max: number){
    if(min === this.prizeMin && max === this.prizeMax){
      return;
    }

    this.prizeMin = min;
    this.prizeMax = max;

    if(this.resultMin.getValue() === min){
      this.prizeMin = null;
    }
    if(this.resultMax.getValue() === max){
      this.prizeMax = null;
    }
    this.search();
  }

  setPage(page: number){
    if(page === this.activePage.getValue()){
      return;
    }

    if(page){
      this.activePage.next(page);
      this.searchParam['firstResult'] = (this.activePage.getValue() -1) * this.pageSize;
    } else {
      delete this.searchParam['firstResult'];
    }
  }
}
