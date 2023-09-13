import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {ApiService} from './api.service';

export interface IUpdateDateDb {
  val : string;
}

@Injectable()
export class UpdateDbDateService {

	constructor(private _httpClient : HttpClient, private _apiService : ApiService) {
 	}

	get(): Observable<IUpdateDateDb> {
		let url = this._apiService.urlNsi + 'getEventLog.php';
		return this._httpClient.get(url) as Observable<IUpdateDateDb>;
	}
}





