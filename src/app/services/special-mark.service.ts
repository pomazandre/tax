import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export interface ISpecMark {
  id: number;
  kod: number;
  name: string;
  n_ot: number;
  nvl: number;
  pr: number;
}

@Injectable()
export class SpecMarkService {

  constructor(private _HttpClient: HttpClient, private _apiService: ApiService) {
  }

  get(): Observable<ISpecMark[]> {
    let url_ : string = this._apiService.urlCalc + 'nsi?method=getSpecialMarks';  
    return this._HttpClient.get(url_) as Observable<ISpecMark[]>;
  }

}
