import { Injectable } from '@angular/core';
import * as pino from 'pino';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';

@Injectable()
export class LogService {
  private _logger: any;
  private _URL: string = '';
  private _localFlag: boolean = false;
  private _remoteFlag: boolean = false;
  private _actualPeriodStore: number = 15;
  private _debugFlag: boolean;

  constructor(private _httpClient: HttpClient, private _apiService: ApiService) {
    if (environment.production) {
      this._logger = pino();
    } else {
      this._logger = pino({ prettyPrint: { colorize: true } });
    }
  }

  public set debugFlag(value : boolean){
    this._debugFlag = value;
  }

  public set debugValue(Value: Object) {
    if (this._debugFlag) {
      this._logger.info(Value);
    }
    
  }

  public set debug(msg: string) {
    if (this._debugFlag) {
    this._logger.info(`@ ${msg}`);
    }
  }

  public set info(msg: string) {
    if (this._localFlag) {
      this._logger.info(`>> ${msg}`);
    }
  }

  public set localFlag(Value: boolean) {
    this._localFlag = Value;
  }

  public set remoteFlag(Value: boolean) {
    this._remoteFlag = Value;
  }

  public get localFlag(): boolean {
    return this._localFlag;
  }

  public get remoteFlag(): boolean {
    return this._remoteFlag;
  }

  public getConfig(): Observable<any> {
    return this._httpClient.get(this._apiService.urlLog + 'log.json');
  }

  public set URL(value: string) {
    this._URL = value;
  }

  public set actualPeriodStore(value: number) {
    this._actualPeriodStore = value;
  }

  getCurTime(): string {
    const curDate = new Date();
    let _Hours: string = String(curDate.getHours());
    let _Minutes: string = String(curDate.getMinutes());
    let _Seconds: string = String(curDate.getSeconds());
    if (curDate.getHours() < 10) {
      _Hours = '0' + curDate.getHours();
    }
    if (curDate.getMinutes() < 10) {
      _Minutes = '0' + curDate.getMinutes();
    }
    if (curDate.getSeconds() < 10) {
      _Seconds = '0' + curDate.getSeconds();
    }
    return `${_Hours}:${_Minutes}:${_Seconds}`;
  }

  remoteMsg(_time: string, _event: string, _proc: string) {
    if (this._remoteFlag) {
      const headers_ = new HttpHeaders().set('Content-Type', 'charset=UTF-8');
      this._httpClient.get(`${this._URL}?time=${_time}&event=${_event}&proc=${_proc}`, { headers: headers_ }).subscribe((Resp: any) => {
        if (Resp.status !== 0) {
          this.info = 'ошибка записи лога на сервер';
        }
      });

    }
  }

  public logMsgAll(_event: string, _proc: string) {
    let time = this.getCurTime();
    if (this.localFlag) {
      this.info = _event;
    }
    if (this.remoteFlag) {
      this.remoteMsg(time, _event, _proc);
    }
  }

  erase(): Observable<any> {
    return this._httpClient.get(this._apiService.urlNsi + 'eraseLogs.php?period=' + this._actualPeriodStore);
  }

}
