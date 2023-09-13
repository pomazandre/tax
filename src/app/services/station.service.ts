import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';

export interface IStation {
  kod: string;
  name: string;
  type: string;
}

export class RespStation {
  kod: string;
  name: string;
  type: string;
}

export class Station {
  Code: string = '';
  Name: string = '';
  Type: StationType = StationType.Out;
}

export enum StationType { Out, In };

@Injectable()
export class StationService {

  constructor(private _HttpClient: HttpClient, private _apiService: ApiService) {
  }

  get2(): Observable<IStation[]> {
    return this._HttpClient.get(this._apiService.urlNsi + 'getStations.php') as Observable<IStation[]>;
  }

  get(): Observable<IStation[]> {
    let url_: string = this._apiService.urlCalc + 'nsi?method=getStations';  
    return this._HttpClient.get(url_) as Observable<IStation[]>;
  }

}

