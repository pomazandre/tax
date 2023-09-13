import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';

export interface IKs {
  kadm: number;
  sname: string;
  name: string;
  id_coun: string;
}

@Injectable()
export class KsService {

  constructor(private _httpClient: HttpClient, private _apiService: ApiService) {
  }

  get(): Observable<IKs[]> {
    let url_ : string = this._apiService.urlCalc + 'nsi?method=getKss';  
    return this._httpClient.get(url_) as Observable<IKs[]>;
  }

}

