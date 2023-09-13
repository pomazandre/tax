import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';

export interface ICountry {
  id: number;
  kod: number;
  name: string;
}

export class RespCountry {
  kod: string = '';
  name: string = '';
}

export class Country {
  Code: string = '';
  Name: string = '';
}

export interface IIdCountry {
  id: number;
  low_range: number;
  up_range: number;
}

@Injectable()
export class CountryService {

  constructor(private _httpClient: HttpClient, private _apiService: ApiService) {
  }

  get(): Observable<ICountry[]> {
    let url_ : string = this._apiService.urlCalc + 'nsi?method=getCountries';  
    return this._httpClient.get(url_) as Observable<ICountry[]>;
  }

  getIds(): Observable<IIdCountry[]> {
    let url_ : string = this._apiService.urlCalc + 'nsi?method=getIdCountries';  
    return this._httpClient.get(url_) as Observable<IIdCountry[]>;
  }

}
