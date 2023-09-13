import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ApiService } from './api.service';

export class ILogin {
  Result: string;
}

@Injectable()
export class LoginService {
  private _user: string = '';
  private _password: string = '';
  private _session: string = '';

  constructor(private _httpService: Http, private _apiService: ApiService) {
    this._user = 'guest';
  }

  public set user(value: string) {
    this._user = value;
  }

  public get user(): string {
    return this._user;
  }

  public set password(value: string) {
    this._password = value;
  }

  public get password(): string {
    return this._password;
  }

  public set session(value: string) {
    this._session = value;
  }

  public get session(): string {
    return this._session;
  }

  get(): Observable<ILogin> {
    return this._httpService.get(`${this._apiService.urlCalc}login?user=${this._user}&password=${this._password}`).map(loginResp => { return loginResp.json() });
  }

}
