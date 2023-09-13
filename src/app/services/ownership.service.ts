import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export interface IOwnership {
  id: number;
  kod: number;
  name: string;
}

@Injectable()
export class OwnershipService {

  constructor(private _HttpClient: HttpClient, private _apiService: ApiService) {
  }

  get(): Observable<IOwnership[]> {
    let url_ : string =this._apiService.urlCalc + 'nsi?method=getOwnerships';  
    return this._HttpClient.get(url_) as Observable<IOwnership[]>;
  }

}
