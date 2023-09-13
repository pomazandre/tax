import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export interface IWagType {
  nomv4: string;
  name_web: string;
  osi: number;
  grp: number;
  tara: number;
  pr_knt: boolean;
  udl: number;
}

@Injectable()
export class WagTypesService {

  constructor(private _Http: HttpClient, private _apiService: ApiService) {
  }

  get(): Observable<IWagType[]> {
    let url_ : string = this._apiService.urlCalc + 'nsi?method=getWagTypes';
    return this._Http.get(url_) as Observable<IWagType[]>;
  }

}

