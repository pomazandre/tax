
import { OpaqueToken, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';

@Injectable()
export class TariffPolicyService {

  constructor(private _httpClient: HttpClient, private _apiService: ApiService) {
  }

  get(): Observable<any> {
    return this._httpClient.get(this._apiService.urlCalc + 'tpdate') as Observable<any>;
  }

}
