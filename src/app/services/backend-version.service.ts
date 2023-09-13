
import { OpaqueToken, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';

export const VERSION = new OpaqueToken('');
export const BUILD = new OpaqueToken('');

@Injectable()
export class BackendVersionService {

  constructor(private _httpClient: HttpClient, private _apiService: ApiService) {
  }

  get(): Observable<any> {
    return this._httpClient.get(`${this._apiService.urlCalc}version`) as Observable<any>;
  }

}
