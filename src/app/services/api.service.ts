
import { Injectable } from '@angular/core';
import { environment, Target, TargetBackend } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const KTC_URL_CONF: string = '/conf/api-ktc.json';
const PORTAL_URL_CONF: string = '/wps/proxy/http/sapodf/conf/api-portal.json';

export enum QUERY_STATUS {
  Completed,
  Running,
  Null,
  Error
}

interface IApiConf {
  version: string,
  nsi: string;
  calc: string,
  assets: string,
  log: string,
  routeTimeout: number,
  calcTimeout: number,
}

@Injectable()
export class ApiService {
  private _urlNsi: string;
  private _urlCalc: string;
  private _urlAssets: string;
  private _urlConf: string;
  private _urlLog: string;
  private _routeTimeout: number;
  private _calcTimeout: number;

  /**
   * Getter urlNsi
   * @return {string}
   */
  public get urlNsi(): string {
    return this._urlNsi;
  }

  /**
   * Getter urlAssets
   * @return {string}
   */
  public get urlAssets(): string {
    return this._urlAssets;
  }

  /**
   * Getter urlConf
   * @return {string}
   */
  public get urlConf(): string {
    return this._urlConf;
  }

  public get urlCalc(): string {
    return this._urlCalc;
  }

  public get urlLog(): string {
    return this._urlLog;
  }

  public get routeTimeout(): number {
    return this._routeTimeout;
  }

  public get calcTimeout(): number {
    return this._calcTimeout;
  }
  
  constructor(private _httpClient: HttpClient) {
    this._urlNsi = '';
    this._urlCalc = '';
    this._urlAssets = '';
    this._urlConf = '';
    let symEnv: string = '';
    switch (environment.target) {
      case Target.KTC: symEnv = 'KTC'; break; // для тестирование внутри
      case Target.PORTAL: symEnv = 'PORTAL'; break; // для портала - бэк у нас
    }
    console.log('режим сборки = ' + symEnv);
  }

  getURLS(): Observable<IApiConf> {
    switch (environment.target) {
      case Target.KTC: this._urlConf = KTC_URL_CONF + ''; break;
      case Target.PORTAL: this._urlConf = PORTAL_URL_CONF; break;
    }
    return this._httpClient.get(this._urlConf) as Observable<IApiConf>
  }

  setAPI(resp: IApiConf) {
    this._urlNsi = resp.nsi;
    this._urlAssets = resp.assets;
    this._urlCalc = resp.calc;
    this._urlLog = resp.log;
    this._routeTimeout = resp.routeTimeout;
    this._calcTimeout = resp.calcTimeout;
  }

};
