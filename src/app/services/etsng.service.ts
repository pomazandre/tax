import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';

export class Etsng {
  kod: string;
  name: string;
}

export interface IEtsng {
  kod: string;
  name: string;
}

@Injectable()
export class EtsngService {

  constructor(private _HttpClient: HttpClient, private _apiService: ApiService) {
  }

  get(): Observable<IEtsng[]> {
    let url_ : string = this._apiService.urlCalc + 'nsi?method=getEtsngs';  
    return this._HttpClient.get(url_) as Observable<IEtsng[]>;
  }
  
}


