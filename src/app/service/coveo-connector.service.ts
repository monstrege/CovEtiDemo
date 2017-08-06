import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map'
import 'rxjs/add/observable/of'
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class CoveoConnectorService {
  private url:String = "https://cloudplatform.coveo.com/rest/";
  private lastBoozeName: String;
  private lastToken: String;
  private sort:number;
  public loading = new BehaviorSubject<boolean>(false);

  private searchParam = {
     "numberOfResults": 20,
     "sortCriteria": ""
    }

  public activeSortIndex: BehaviorSubject<number> = new BehaviorSubject(0);
  public prizeMin: BehaviorSubject<number> = new BehaviorSubject(null);
  public prizeMax: BehaviorSubject<number> = new BehaviorSubject(null);


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

  search(boozeName: String, token:String){
    this.loading.next(true);
    const queryIdentifier: String = 'search';

    this.lastBoozeName = boozeName;
    this.lastToken= token;

    return this.http
          .get(this.queryBuilder(queryIdentifier, token) + boozeName, {params: this.searchParam})
          .map((r: Response) => {
            this.loading.next(false);
            return r.json().results
          });
  }

  private queryBuilder(queryIdentifier: String, token:String){
    let queryItems:String[] = [
      this.url,
      queryIdentifier,
      '?',
      "access_token=" + token,
      '&q='
    ];
    return queryItems.join('');
  }

  setSort(sortIndex: number){
    if(sortIndex === this.activeSortIndex.getValue()){
      return;
    }
    this.activeSortIndex.next(sortIndex);

    this.searchParam.sortCriteria = !!this.sortOptions[sortIndex].key ? "@tpprixnum " + this.sortOptions[sortIndex].key : "";
  }

  // setPrizeRange(min: number, max: number){
  //   if(min === this.prizeMin.getValue() && max === this.prizeMax.getValue()){
  //     return;
  //   }

  //   this.activeSortIndex.next(sortIndex);

  //   this.searchParam.sortCriteria = !!this.sortOptions[sortIndex].key ? "@tpprixnum " + this.sortOptions[sortIndex].key : "";
  // }
}
