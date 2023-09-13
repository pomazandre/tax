import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';

export interface IEtsngMask {
  kod_etsng: string;
  kod_gng: string;
}

@Injectable()
export class EtsngMasksService {

  constructor(private _HttpClient: HttpClient, private _apiService: ApiService) {
  }

  get(): Observable<IEtsngMask[]> {
    let url_ : string = this._apiService.urlCalc + 'nsi?method=getEtsngMasks';  
    return this._HttpClient.get(url_) as Observable<IEtsngMask[]>;
  }

}


