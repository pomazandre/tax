import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';

export class Gng {
  kod: string;
  name: string;
  bh1: number;
}

export interface IGng {
  kod: string;
  name: string;
  bh1: number;
}

@Injectable()
export class GngService {

  constructor(private _HttpClient: HttpClient, private _apiService: ApiService) {
  }

  get(): Observable<IGng[]> {
    let url_ : string = this._apiService.urlCalc + 'nsi?method=getGngs';  
    return this._HttpClient.get(url_) as Observable<IGng[]>;
  }
 

}
