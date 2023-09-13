import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as pino from 'pino';
import { environment } from '../../environments/environment';

@Injectable()
export class StatService {
  private _URL: string = '';
  private _logger: any;

  constructor(private _httpClient: HttpClient) {
    if (environment.production) {
      this._logger = pino();
    } else {
      this._logger = pino({ prettyPrint: { colorize: true } });
    }
  }

  public set info(msg: string) {
    this._logger.info(`>> ${msg}`);
  }

  public set URL(value: string) {
    this._URL = value;
  }

  write() {
    const _headers = new HttpHeaders().set('Content-Type', 'charset=UTF-8');
    this._httpClient.get(this._URL, { headers: _headers }).subscribe((Resp: any) => {
      if (Resp.status !== 0) {
        this.info = 'ошибка записи статистики';
      }
    });

  }

}
