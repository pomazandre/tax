import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ApiService, QUERY_STATUS } from './api.service';
import { LoginService } from './login.service';
import { CacheService } from './cache.service';
import { LogService } from './log.service';

export enum RouteType { Standart, TransitOneJoint, TransitTwoJoints };

export class Station {
  kod: string;
  name: string;
  country: string;
  dist: string;
}

export interface IRoute {
  outJointCode: string;
  outJoint: string;
  inJointCode: string;
  belDist: string;
  totalDist: string;
  outParagraf: string;
  destParagraf: string;
  destDetailParagraf: string;
  outDetailParagraf: string;
  error: string;
  stations: Station[];
}

export class Route implements IRoute {
  outJointCode: string;
  outJoint: string;
  inJointCode: string;
  inJoint: string;
  belDist: string;
  totalDist: string;
  outParagraf: string;
  destParagraf: string;
  outDetailParagraf: string;
  destDetailParagraf: string;
  error: string;
  stations: Station[];
}

export class Joint {
  code: string;
  name: string;
}

export class RouteCalcParams {
  private _outStation: string;
  private _inStation: string;
  private _outCountry: string;
  private _inCountry: string;
  private _contCol: number;
  private _foot: number;
  private _specMark: number;
  private _svo: number;
  private _contPayload: number;
  private _transit: number;
  private _inRW: string;
  private _outRW: string;
  private _date: string;
  private _currency: string;

  constructor(outStation: string, inStation: string, outCountry: string, inCountry: string, contCol: string, foot: string,
    contPayload: string, specMark: number, svo: string, inRW: string, outRW: string, date: string, currency: string) {
    this._outStation = outStation;
    this._inStation = inStation;
    this._outCountry = outCountry;
    this._inCountry = inCountry;
    this._contCol = Number.parseInt(contCol);
    this._foot = Number.parseInt(foot);
    this._contPayload = Number.parseInt(contPayload);
    this._specMark = specMark;
    this._svo = Number.parseInt(svo);
    this._inRW = inRW;
    this._outRW = outRW;
    this._date = date;
    this._currency = currency;
  }

  public get outStation(): string {
    return this._outStation;
  }

  public get inStation(): string {
    return this._inStation;
  }

  public get outCountry(): string {
    return this._outCountry;
  }

  public get inCountry(): string {
    return this._inCountry;
  }

  public get contCol(): number {
    return this._contCol;
  }

  public get foot(): number {
    return this._foot;
  }

  public get contPayload(): number {
    return this._contPayload;
  }

  public get specMark(): number {
    return this._specMark;
  }

  public get svo(): number {
    return this._svo;
  }

  public get transit(): number {
    return this._transit;
  }

  public get inRW(): string {
    return this._inRW;
  }

  public get outRW(): string {
    return this._outRW;
  }

  public get tariff(): string {
    return '15';
  }

  public get date(): string {
    return this._date;
  }

  public get currency(): string {
    return this._currency;
  }
}

@Injectable()
export class RouteService {
  private _route: Route = new Route();
  private _routeTransit: Route[] = [];
  private _status: number;
  private _type: RouteType;


  constructor(private _Http: HttpClient, private _apiService: ApiService, private _loginService: LoginService, private _cacheService: CacheService,
    private _logService: LogService) {
    this._status = QUERY_STATUS.Null;
  }

  public get route(): Route {
    return this._route;
  }

  public get routeTransit(): Route[] {
    return this._routeTransit;
  }

  public set routeTransit(value: Route[]) {
    this._routeTransit = value;
  }

  public get status(): QUERY_STATUS {
    return this._status;
  }

  public set status(value: QUERY_STATUS) {
    this._status = value;
  }

  public set logInfo(value: any) {
    this._logService.info = value;
  }

  public set logDebug(msg: string) {
    this._logService.debug = msg;
  }

  public set logDebugValue(value: any) {
    this._logService.debugValue = value;
  }

  public get type(): RouteType {
    return this._type;
  }

  public set type(value: RouteType) {
    this._type = value;
  }

  get(Params: RouteCalcParams): Observable<IRoute> {
    const { outStation, inStation, outCountry, inCountry, contCol, foot, contPayload, specMark, svo, inRW, outRW, tariff, date, currency } = Params;
    let _Foot: number = foot;
    let _contCol: number = contCol;
    let _contPayload: number = contPayload;
    let _httpParamsFinal;
    if (svo === 1) {
      _Foot = 0;
      _contCol = 0;
      _contPayload = 0;
    }
    let _httpParams: HttpParams = new HttpParams().
      set('outstation', outStation).
      set('deststation', inStation).
      set('outcountry', outCountry).
      set('destcountry', inCountry).
      set('cont', String(_contCol)).
      set('foot', String(_Foot)).
      set('contpayload', String(_contPayload)).
      set('svo', String(svo)).
      set('inRW', String(inRW)).
      set('outRW', String(outRW)).
      set('date', date).
      //set('tarifftype', tariff).  по сетке идет константа
      set('currency', String(currency)).
      set('UUID', this._loginService.session);
    if (specMark > 0) {
      _httpParamsFinal = _httpParams.append('specmark', String(specMark));
    } else {
      _httpParamsFinal = _httpParams;
    }
    return this._Http.get(`${this._apiService.urlCalc}route`, { params: _httpParamsFinal }) as Observable<IRoute>;
  }

  getCountry(stationCode: string): any {
    let idResp: any = this._cacheService.idCountries.find({ $and: [{ low_range: { "$lte": stationCode } }, { up_range: { "$gte": stationCode } }] });
    let idCountry = idResp[0].id;
    let regExp: RegExp = new RegExp('^' + idCountry);
    let countryResp: any = this._cacheService.Countries.find({ 'id': regExp }); // поиск страны
    return countryResp[0];
  }

  getKs(stationCode: string): string {
    let idResp: any = this._cacheService.idCountries.find({ $and: [{ low_range: { "$lte": stationCode } }, { up_range: { "$gte": stationCode } }] });
    let idCountry = idResp[0].id;
    let regExp: RegExp = new RegExp('^' + idCountry);
    let ksResp: any = this._cacheService.Kss.find({ 'id_coun': regExp }); // поиск страны
    return ksResp[0].sname;
  }

  isFullRouteTransitTwoJoints(): boolean {
    return (this._type === RouteType.TransitTwoJoints) && (this._routeTransit[0] !== undefined)
      && (this._routeTransit[1] !== undefined) && (this._routeTransit[2] !== undefined);
  }

  isFullRouteTransitOneJoint(): boolean {
    return (this._type === RouteType.TransitOneJoint) && (this._routeTransit[0] !== undefined)
      && (this._routeTransit[1] !== undefined);
  }

  copyRespRoute(resp: IRoute) {
    let _Resp: any;
    let regExp: RegExp;
    this._route.outJointCode = resp.outJointCode;
    this._route.inJointCode = resp.inJointCode;

    if (resp.outJointCode !== undefined) { // сервлет не возвращает имя станции-стыка - баг
      if (resp.outJointCode !== '') {
        regExp = new RegExp('^' + resp.outJointCode);
        _Resp = this._cacheService.Stations.find({ '_id': regExp });
        this._route.outJoint = _Resp[0].name;
      } else {
        this._route.outJoint = '';
      }
    }
    if (resp.inJointCode !== undefined) {
      if (resp.inJointCode !== '') {
        regExp = new RegExp('^' + resp.inJointCode);
        _Resp = this._cacheService.Stations.find({ '_id': regExp });
        this._route.inJoint = _Resp[0].name;
        console.log(_Resp);
      } else {
        this._route.inJoint = '';
      }
    }
    this._route.belDist = resp.belDist;
    this._route.totalDist = resp.totalDist;
    this._route.outParagraf = resp.outParagraf;
    this._route.destParagraf = resp.destParagraf;
    this._route.outDetailParagraf = resp.outDetailParagraf;
    this._route.destDetailParagraf = resp.destDetailParagraf;
    this._route.stations = [];

    // копирование станций маршрута
    resp.stations.forEach( item => {
      item.country = this.getCountry(item.kod).name;
      this._route.stations.push(item);
    }
    );
    
  }

  clear() {
    this._route.outJointCode = '';
    this._route.outJoint = '';
    this._route.inJointCode = '';
    this._route.inJoint = '';
    this._route.belDist = '';
    this._route.totalDist = '';
    this._route.outParagraf = '';
    this._route.destParagraf = '';
    this._route.error = '';
    this._route.stations = [];
  }

}
