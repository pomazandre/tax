import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export interface ISvo {
  kod: number;
  name: string;
}

@Injectable()
export class SvoService {

  constructor(private _HttpClient: HttpClient, private _apiService: ApiService) {
  }

  get(): Observable<ISvo[]> {
    let url_ : string = this._apiService.urlCalc + 'nsi?method=getSvos';  
    return this._HttpClient.get(url_) as Observable<ISvo[]>;
  }

}
