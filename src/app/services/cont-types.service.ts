import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';

export interface IContType {
  kod: number;
  tip: string;
}

@Injectable()
class ContTypesService {

  constructor(private _HttpClient: HttpClient, private _apiService: ApiService) {
  }

  get(): Observable<IContType[]> {
    let url_ : string = this._apiService.urlCalc + 'nsi?method=getContTypes';
    return this._HttpClient.get(url_) as Observable<IContType[]>;;
  }

}

export { ContTypesService };
