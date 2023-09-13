import { Component, Inject, ChangeDetectionStrategy, ViewChild, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { BUILD, VERSION, BackendVersionService } from '../services/backend-version.service';
import { ApiService } from '../services/api.service';
import { LogService } from '../services/log.service';
import { StatService } from '../services/stat.service';
import { CacheService, CacheTypes, enumCacheType } from '../services/cache.service';
import { UpdateDbDateService, IUpdateDateDb } from '../services/update-db-date.service';
import { ProgressDialogComponent } from '././progress/progress.component';
import { ErrorDialogComponent } from '././error/error.component';
import { ValidService } from '../services/valid.service';
import { IOwnership } from '../services/ownership.service';
import { IKs } from '../services/ks.service';
import { IWagType } from '../services/wag-types.service';
import { IContType } from '../services/cont-types.service';
import { ISpecMark } from '../services/special-mark.service';
import { ICountry, IIdCountry } from '../services/country.service';
import { ISvo } from '../services/svo.service';
import { LoginService } from '../services/login.service';
import { OwnershipListService } from '../services/ownership-list.service';
import { SvoListService } from '../services/svo-list.service';
import { WagTypeListService } from '../services/wag-type-list.service';
import { ContTypeListService } from '../services/cont-type-list.service';
import { SpecMarkListService } from '../services/spec-mark-list.service';
import { KsListService } from '../services/ks-list.service';
import { CalcService } from '../services/calc.service';
import { TariffPolicyService } from '../services/tariff-policy.service';
import { VisibleControlsService } from '../services/visible.service';
import * as cookies from 'js-cookie';
import * as Bowser from 'bowser';
import { environment, Target } from '../../environments/environment.prod';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent implements OnInit, OnDestroy {
  private _mdlBlockUI: boolean = false;
  @ViewChild(ProgressDialogComponent) private _progressDialog: ProgressDialogComponent;
  @ViewChild(ErrorDialogComponent) private _errorDialog: ErrorDialogComponent;
  private _display: boolean = false;
  private _displayLogin: boolean = true;
  private _incCache: number = 0;
  private _mdlBrowserInfo: any;
  public _mdlIsValidBrowser: boolean;
  private _startMoment: number = Date.now();
  private _finishMoment: number;
  private _backendVersion: string;
  private _backendDate: string;
  private _tariffPolicyDate: string;
  private _mdlDateFilled: string;
  private _Ru: any;  // календарь
  private _showUI : boolean;
  private _cacheSubscriptions: Subscription[] = [];
  private _loginSubscription: Subscription;
  private _nsiDateSubscription: Subscription;
  private _eraseLogsSubscription: Subscription;
  private _configSubscription: Subscription;
  private _versionBackendSubscription: Subscription;
  private _tariffPolicySubscription: Subscription;
  private _apiSubscription: Subscription;
  private _isVariosBuilds : boolean;
  
  public get Ru(): any {
    return this._Ru;
  }

  public get mdlBrowserInfo(): any {
    return this._mdlBrowserInfo;
  }

  public get mdlIsValidBrowser(): boolean {
    return this._mdlIsValidBrowser;
  }

  public get mdlBlockUI(): boolean {
    return this._mdlBlockUI;
  }

  public set logInfo(value: any) {
    this._logService.info = value;
  }

  public set logDebug(msg: string) {
    this._logService.debug = msg;
  }

  public set logDebugValue(Value: any) {
    this._logService.debugValue = Value;
  }

  public get cacheStations(): any {
    return this._cacheService.Stations;
  }

  public get cacheGngs(): any {
    return this._cacheService.Gngs;
  }

  public get cacheEtsngs(): any {
    return this._cacheService.Gngs;
  }

  public get cacheMasks(): any {
    return this._cacheService.Masks;
  }

  public get cacheOwnerships(): any {
    return this._cacheService.Ownerships;
  }

  public get cacheKss(): any {
    return this._cacheService.Kss;
  }

  public get cacheWagTypes(): any {
    return this._cacheService.wagTypes;
  }

  public get cacheContTypes(): any {
    return this._cacheService.contTypes;
  }

  public get cacheSpecialMarks(): any {
    return this._cacheService.specialMarks;
  }

  public get cacheSvo(): any {
    return this._cacheService.Svo;
  }

  public get cacheCountries(): any {
    return this._cacheService.Countries;
  }

  public get cacheIdCountries(): any {
    return this._cacheService.idCountries;
  }

  public get cacheUpdateNsiDate(): any {
    return this._cacheService.UpdateNsiDate;
  }

  public get cacheVersion(): any {
    return this._cacheService.Version;
  }

  public get lastServerUpdateNsiDate(): string {
    return this._cacheService.lastServerUpdateNsiDate;
  }

  public set lastServerUpdateNsiDate(value: string) {
    this._cacheService.lastServerUpdateNsiDate = value;
  }

  public get lastCacheUpdateNsiDate(): string {
    return this._cacheService.lastCacheUpdateNsiDate;
  }

  public set lastCacheUpdateNsiDate(value: string) {
    this._cacheService.lastCacheUpdateNsiDate = value;
  }

  public get VERSION(): string {
    return this._VERSION;
  }

  public get BUILD(): string {
    return this._BUILD;
  }

  public get enabledCacheNSI(): boolean {
    return this._cacheService.enabledCacheNSI;
  }

  public set enabledCacheNSI(value: boolean) {
    this._cacheService.enabledCacheNSI = value;
  }

  public get mdlDate(): string {
    return this._calcService.Date;
  }

  public set mdlDate(value : string) {
    this._calcService.Date = value;
  }

  /**
     * Setter mdlDateFilled
     * @param {boolean} value
     */
	public set mdlDateFilled(value: string) {
		this._mdlDateFilled = value;
	}

  /**
     * Getter mdlDateFilled
     * @return {boolean}
     */
	public get mdlDateFilled(): string {
		return this._mdlDateFilled;
  }
  
  /**
     * Setter Ru
     * @param {any} value
     */
	public set Ru(value: any) {
		this._Ru = value;
	}

  public get mdlSvo(): any {
    return this._svoListService.item  
  }

  public set mdlSvo(value : any) {
    this._svoListService.item = value; 
  }

  public set mdlSvoCode(value: string) {
    this._svoListService.code = value;
  }

  public get mdlSvoCode() {
    return this._svoListService.code;
  }
  
  public get showUI() : boolean {
    return this._showUI;
  }

  handleSvoChange(event) {
    this.mdlSvoCode = String(event.value.id);
    this.performSvoChange();
  }

  performSvoChange(){
    this.logDebug = '@AppComponent @performSvoChange';
    this._visibleControlsService.subjectSvo.next();
  }

  get mdlSvoItem(): any {
    return this._svoListService.item;
  }

  set mdlSvoItem(value : any) {
    this._svoListService.item = value;
  }
  
  public get backendVersion(): string {
    return this._backendVersion;
  }

  public get backendDate(): string {
    return this._backendDate;
  }

  public get tariffPolicyDate(): string {
    return this._tariffPolicyDate;
  }

  public get svos(): SelectItem[] {
    return this._svoListService.list;
  }

  get dateDisabled() : boolean{
    return this._visibleControlsService.dateDisabled;
  }

  get svoDisabled() : boolean{
    return this._visibleControlsService.svoDisabled;
  }
       
  constructor(@Inject(BUILD) private _BUILD: string, @Inject(VERSION) private _VERSION: string,
    private _apiService: ApiService, private _logService: LogService, private _statService: StatService, private _cacheService: CacheService,
    private _updateDbDateService: UpdateDbDateService, private _validService: ValidService,
    private _loginService: LoginService, private _ownershipListService: OwnershipListService,
    private _svoListService: SvoListService, private _wagTypeListService: WagTypeListService,
    private _contTypeListService: ContTypeListService, private _specMarkListService: SpecMarkListService,
    private _ksListService: KsListService, private _Router: Router, private _changeDetectorRef: ChangeDetectorRef,
    private _calcService: CalcService, private _backendVersionService: BackendVersionService, 
    private _tariffPolicyService: TariffPolicyService,  private _visibleControlsService: VisibleControlsService,
    private _router: Router
  ) {
    this._mdlDateFilled = '';
    moment.locale('ru');
    this._Ru = {
      firstDayOfWeek: 1,
      dayNames: ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"],
      dayNamesShort: ["пон", "вт", "ср", "чтв", "птн", "суб", "вск"],
      dayNamesMin: ["П", "В", "С", "Ч", "П", "С", "В"],
      monthNames: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
      monthNamesShort: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
      today: 'Сегодня',
      clear: 'Очистить'
    };
    this.mdlDate = moment().format('DD.MM.YYYY');
    this._logService.debugFlag = true;
    this._showUI = false;
    this._isVariosBuilds = false;

    this._visibleControlsService.dateDisabled = false
    this._visibleControlsService.svoDisabled = false
  }

  ngOnInit() {
    const BROWSER = Bowser.getParser(window.navigator.userAgent);
    this._mdlBrowserInfo = BROWSER.getBrowser();
    console.log('браузер = ' + this._mdlBrowserInfo.name + ' ' + this._mdlBrowserInfo.version);
    this._mdlIsValidBrowser = BROWSER.satisfies({ chrome: ">=29.0.0", opera: ">=16.0.0", "internet explorer": ">=9", "microsoft edge": ">=15" });
    console.log('совместимость c браузером = ' + this._mdlIsValidBrowser);
    if (this._mdlIsValidBrowser) {
      this.getUrlApi(); // грузим урлы -> конфиг логгирования -> логинимся -> НСИ
    }
  }

  ngOnDestroy() {
  }
  
  detectChanges() {
    if (!this._changeDetectorRef['destroyed']) {
      this._changeDetectorRef.detectChanges();
    }
  }

  logMsgAll(event, proc: string) {
    this._logService.logMsgAll(event, proc);
  }

  onChanged() {
    this._displayLogin = false;
    this._display = true;
  }

  public get display(): boolean {
    return this._display;
  }

  public set display(value: boolean) {
    this._display = value;
  }

  public get displayLogin(): boolean {
    return this._displayLogin;
  }

  public set displayLogin(value: boolean) {
    this._displayLogin = value;
  }

  public get Ownerships(): SelectItem[] {
    return this._ownershipListService.List;
  }

  public set Ownerships(Value: SelectItem[]) {
    this._ownershipListService.List = Value;
  }

  public set wagOwnershipItem(value: SelectItem) {
    this._ownershipListService.wagOwnershipItem = value;
  }

  public set wagOwnershipCode(value: number) {
    this._ownershipListService.wagOwnershipCode = value;
  }

  public set contOwnershipItem(value: SelectItem) {
    this._ownershipListService.contOwnershipItem = value;
  }

  public set contOwnershipCode(value: number) {
    this._ownershipListService.contOwnershipCode = value;
  }

  public get Svos(): SelectItem[] {
    return this._svoListService.list;
  }

  public set Svos(Value: SelectItem[]) {
    this._svoListService.list = Value;
  }


  public set svoItem(value: SelectItem) {
    this._svoListService.item = value;
  }

  public set svoCode(value: string) {
    this._svoListService.code = value;
  }

  public get wagTypeSuggestions(): IWagType[] {
    return this._wagTypeListService.Suggestions;
  }

  public set wagTypeRow(value: IWagType) {
    this._wagTypeListService.Row = value;
  }

  public get contTypes(): IContType[] {
    return this._contTypeListService.List;
  }

  public set contTypeRow(value: IContType) {
    this._contTypeListService.Row = value;
  }

  public set contType(value: string) {
    this._contTypeListService.Name = value;
  }

  public set contTypeCode(value: number) {
    this._contTypeListService.Code = value;
  }

  public get Kss(): IKs[] {
    return this._ksListService.List;
  }

  public set ksRow(Value: IKs) {
    this._ksListService.Row = Value;
  }

  public set Ks(Value: string) {
    this._ksListService.Name = Value;
  }

  public set ksCode(value: string) {
    this._ksListService.Code = value;
  }

  public get enabledCacheNsi() {
    return this._cacheService.enabledCacheNSI;
  }

  public set enabledCacheNsi(value: boolean) {
    this._cacheService.enabledCacheNSI = value;
  }

  handleGoHome(){
    // если сборки не совпадат, переход не делать 
    if (!this._isVariosBuilds) {
      this._router.navigate(['/']);
    }
  }

  loadNsi(event) {
    this.logMsgAll('загрузка НСИ ...', '@AppComponent@loadNsi');
    this._startMoment = Date.now();
    this._incCache = 0;

    //let cookie_ = cookies.get();
    //if (cookie_.cacheNSI === '1') {
    //  this.enabledCacheNSI = true;
    //} else {
    //  this.enabledCacheNSI = false;
     // }
     
     this.enabledCacheNSI = false;
    this.logInfo = 'кэш НСИ = ' + this.enabledCacheNSI;
    if (this.enabledCacheNSI) {
      this.loadCacheVersion();
    } else {
      this.loadAllCacheHttp();    
    }
  }

  loadAllCacheHttp(){
    this.logInfo = 'загрузка НСИ из БД и кэширование в память...';
    this._cacheSubscriptions = [];
    CacheTypes.forEach(cacheType => { this._cacheSubscriptions.push( this.getCacheObservable(cacheType).subscribe( resp => this.setCache(cacheType, resp)) );
    })
  }

  destroyCacheSubscriptions(){
    this._cacheSubscriptions.forEach( item => item.unsubscribe() );    
    this.logDebug = 'все подписки кэша отписаны';
  }

  loadCacheVersion() {
    this.logInfo = 'чтение структуры кэша НСИ...';
    this.cacheVersion.load((Error, tableStats, metaStats) => {
      if (!Error && tableStats.foundData && tableStats.rowCount > 0) {
        const Resp = this.cacheVersion.find({ '_id': 1 });
        this.logInfo = 'версия структуры кэша =  ' + Resp[0].version;
        this.logInfo = 'актуальная версия структуры кэша = 0.3';
        if (Resp[0].version === '0.3') {
          this._nsiDateSubscription = this._updateDbDateService.get().subscribe(resp => this.setUpdateDate(resp) , error => this.errorUpdateDate(error));
        } else { // грузим с сервера при несовпадении дат обновления базы
          this.loadAllCacheHttp()          
        }
      } else {
        this.logInfo = 'сохраняем версию структуры кэша НСИ ...';
        this.cacheVersion.insert({ _id: 1, version: '0.3' });
        this.cacheVersion.save(Error => {
          if (!Error) {
            this.logInfo = 'версия структуры кэша НСИ сохранена';
          } else {
            this._errorDialog.show();
            this._errorDialog.mdlText = this._validService.errorMsgs.errorSaveCacheVersion;
            this._progressDialog.display = false;
            this._mdlBlockUI = false;
            this.logInfo = 'ошибка сохранения структуры кэша НСИ';
          }
        });
        this.loadAllCacheHttp();
      }
    });
  }

  setStationsCache(Resp: any) {
    this.logInfo = 'станции из БД прочитаны';
    this.logInfo = 'кэширование станций в память...';
    Resp.forEach(item => this.cacheStations.insert({ _id: item.kod, name: item.name.trim(), type: item.type }));
    this.logInfo = 'кэширование станций в память завершено';
  }

  setGngsCache(Resp: any) {
    this.logInfo = 'ГНГ из БД прочитаны';
    this.logInfo = 'кэширование ГНГ в память ...';
    Resp.forEach(Item => this.cacheGngs.insert({ _id: Item.kod, kod: Item.kod, name: Item.name.trim(), bh1: Item.bh1 }));
    this.logInfo = 'кэширование ГНГ в память завершено';
  }

  setEtsngsCache(Resp: any) {
    this.logInfo = 'ЕТСНГ из БД прочитаны';
    this.logInfo = 'кэширование ЕТСНГ в память ...';
    Resp.forEach(Item => this.cacheEtsngs.insert({ _id: Item.kod, name: Item.name.trim() }));
    this.logInfo = 'кэширование ЕТСНГ в память завершено';
  }

  setMasksCache(Resp) {
    this.logInfo = 'маски для ГНГ и ЕТСНГ из БД прочитаны';
    this.logInfo = 'кэширование масок <ГНГ ЕТСНГ> в память ...';
    Resp.forEach( item => { this.cacheMasks.insert( { kod_gng: item.kod_gng, kod_etsng: item.kod_etsng }); });
    this.logInfo = 'кэширование масок в память завершено';
  }

  setOwnershipsCache(Resp: IOwnership[]) {
    this.logInfo = 'принадлежности из БД прочитаны';
    this.logInfo = 'кэширование принадлежностей в память ...';
    Resp.forEach(Item => {
      Item.name = Item.name.trim();
      this.cacheOwnerships.insert({ _id: Item.id, kod: Item.kod, name: Item.name });
    }
    );
    this.logInfo = 'кэширование принадлежностей в память завершено';
  }

  setKssCache(Resp: IKs[]) {
    this.logInfo = 'коды собственников из БД прочитаны';
    this.logInfo = 'кэширование кодов собственников в память ...';
    Resp.forEach(item => {
      item.name = item.name.trim();
      item.sname = item.sname.trim();
      this.cacheKss.insert(item);
    }
    );
    this.logInfo = 'кэширование кодов собственников завершено ...';
  }

  setWagTypesCache(Resp: IWagType[]) {
    this.logInfo = 'типы вагонов из БД прочитаны';
    this.logInfo = 'кэширование типов вагонов в память ...';
    Resp.forEach(Item => {
      this.cacheWagTypes.insert(Item);
    }
    );
    this.logInfo = 'кэширование типов вагонов в память завершено';
  }

  setContTypesCache(Resp: IContType[]) {
    this.logInfo = 'типы контейнеров из БД прочитаны';
    this.logInfo = 'кэширование типов контейнеров в память ...';
    Resp.forEach(Item => {
      Item.tip = Item.tip.trim();
      this.cacheContTypes.insert(Item);

    }
    );
    this.logInfo = 'кэширование типов контейнеров в память завершено';
  }

  setSpecialMarksCache(Resp: ISpecMark[]) { // по умолчанию код 58
    this.logInfo = 'тарифные отметки из БД прочитаны';
    this.logInfo = 'кэширование тарифных отметок в память ...';
    Resp.forEach(Item => {
      Item.name = Item.name.trim();
      this.cacheSpecialMarks.insert(Item);
    }
    );
    this.logInfo = 'кэширование тарифных отметок в память завершено';
  }

  setSvoCache(Resp: ISvo[]) {
    this.logInfo = 'видов отправок из БД прочитаны ...';
    this.logInfo = 'кэширование видов отправок в память ...';
    Resp.forEach(Item => {
      Item.name = Item.name.trim();
      this.cacheSvo.insert(Item);
    }
    );
    this.logInfo = 'кэширование тарифных отметок в память завершено';
  }

  setCountriesCache(Resp: ICountry[]) {
    this.logInfo = 'страны из БД прочитаны ...';
    this.logInfo = 'кэширование стран в память ...';
    Resp.forEach(Item => { this.cacheCountries.insert(Item) });
    this.logInfo = 'кэширование стран в память завершено';
  }

  setIdCountriesCache(Resp: IIdCountry[]) {
    this.logInfo = 'идентификаторы стран из БД прочитаны ...';
    this.logInfo = 'кэширование идентификаторов стран в память ...';
    Resp.forEach(Item => this.cacheIdCountries.insert(Item));
    this.logInfo = 'кэширование идентификаторов стран в память завершено ...';
  }

  getCacheLabel(cacheType: enumCacheType): string {
    return this._cacheService.getLabel(cacheType);
  }

  closeProgress() {
    this._progressDialog.queryProgress = false;
    setTimeout(() => {
      this._progressDialog.close();
      this.detectChanges();
      this._mdlBlockUI = false;
      this.detectChanges();
    }, 3000);
  }

  setCache(cacheType: enumCacheType, resp: any) {
    let _Cache = this._cacheService.getCache(cacheType);
    switch (cacheType) {
      case enumCacheType.Stations: this.setStationsCache(resp); break;
      case enumCacheType.Gngs: this.setGngsCache(resp); break;
      case enumCacheType.Etsngs: this.setEtsngsCache(resp); break;
      case enumCacheType.Masks: this.setMasksCache(resp); break;
      case enumCacheType.Ownerships: this.setOwnershipsCache(resp); break;
      case enumCacheType.Kss: this.setKssCache(resp); break;
      case enumCacheType.WagTypes: this.setWagTypesCache(resp); break;
      case enumCacheType.ContTypes: this.setContTypesCache(resp); break;
      case enumCacheType.Svo: this.setSvoCache(resp); break;
      case enumCacheType.SpecialMarks: this.setSpecialMarksCache(resp); break;
      case enumCacheType.Countries: this.setCountriesCache(resp);
      case enumCacheType.idCountries: this.setIdCountriesCache(resp);
    }
    this._incCache++;
    if (this.enabledCacheNsi) {
      this.logInfo = `сохранение кэша НСИ на диск...`;
      _Cache.save(err => {
        if (!err) {
          this.logInfo = ` кэш ${this.getCacheLabel(cacheType)} сохранен на диск`;
          this._incCache++;
          if (this._incCache === CacheTypes.length) {
            this.destroyCacheSubscriptions();
            this.closeProgress();
            this._cacheService.defaultValues = true;
            this.setNsiView();
            this.logMsgAll('кэша НСИ сохранен на диск', '@AppComponent@setCache');
            this._finishMoment = Date.now();
            this.logInfo = `время загрузки и кэширования НСИ = ${(this._finishMoment - this._startMoment) / 1000} с`;
          }
        } else {
          this._progressDialog.display = false;
          this._progressDialog.queryProgress = false;
          this.detectChanges();

          this._errorDialog.show();
          this._errorDialog.mdlText = this._validService.errorMsgs.errorSaveCacheNsi;
          this.detectChanges();
          this.logInfo = ' ошибка сохранения кэша НСИ на диск';
        }
      });
    } else { // кэш в память 
      if (this._incCache === CacheTypes.length) {
        this.destroyCacheSubscriptions();
        this.closeProgress();
        this._cacheService.defaultValues = true;
        this.setNsiView();
        this.logMsgAll('НСИ DB->RAM завершено', '@AppComponent@setCache');
        this._finishMoment = Date.now();
        this.logInfo = `время загрузки и кэширования НСИ = ${(this._finishMoment - this._startMoment) / 1000} с`;
      }
    }
  }

  getCacheObservable(cacheType: enumCacheType): any {
    return this._cacheService.getObservable(cacheType);
  }

  cacheAllLoading() {
    this._cacheSubscriptions = [];
    CacheTypes.forEach(item => this.cacheLoading(item));
  }
  
  cacheLoading(cacheType: enumCacheType) {
    this._cacheService.getCache(cacheType).load((Error, tableStats, metaStats) => {
      if (!Error && tableStats.foundData && tableStats.rowCount > 0) {
        this.logInfo = 'кэш ' + this.getCacheLabel(cacheType) + ' загружен';
        this._incCache++;
        if (this._incCache === CacheTypes.length) {
          this.destroyCacheSubscriptions();
          this.logMsgAll('кэш НСИ загружен ', '@AppComponent@cacheLoading');
          this._cacheService.defaultValues = true;
          this.setNsiView();
          this.closeProgress();
          this._finishMoment = Date.now();
          this.logInfo = `время загрузки НСИ из кэша = ${(this._finishMoment - this._startMoment) / 1000} с`;
        }
      } else {
        this._cacheSubscriptions.push(this.getCacheObservable(cacheType).subscribe(Resp => { this.setCache(cacheType, Resp);} , error => this.showCacheError(cacheType)));
      }
    });
  }

  showCacheError(cacheType: enumCacheType) {
    switch (cacheType) {
      case enumCacheType.Stations: this.errorGetStation();
        break;
      case enumCacheType.Gngs: this.errorGetGng();
        break;
      case enumCacheType.Etsngs: this.errorGetEtsng();
        break;
      case enumCacheType.Masks: this.errorGetEtsngMask();
        break;
      case enumCacheType.Ownerships: this.errorGetOwnership();
        break;
      case enumCacheType.Kss: this.errorGetKss();
        break;
      case enumCacheType.WagTypes: this.errorGetWagType();
        break;
      case enumCacheType.ContTypes: this.errorGetContType();
        break;
      case enumCacheType.Svo: this.errorGetSvo();
        break;
      case enumCacheType.SpecialMarks: this.errorGetSpecialMark();
        break;
      case enumCacheType.Countries: this.errorGetCountry();
        break;
      case enumCacheType.idCountries: this.errorGetCountry();
    }
  }

  errorGetGng() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptyGngNsi;
  }

  errorGetEtsng() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptyEtsngNsi;
  }

  errorGetEtsngMask() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptyEtsngMasksNsi;
  }

  errorGetStation() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptyStationNsi;
  }

  errorGetOwnership() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptyOwnerships;
  }

  errorGetKss() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptyKss;
  }

  errorGetWagType() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptyWagTypes;
  }

  errorGetContType() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptyContTypes;
  }

  errorGetSvo() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptySvo;
  }

  errorGetSpecialMark() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptySpecialMarks;
  }

  errorGetCountry() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptyCountries;
  }

  errorUpdateDate(error: any ){
    this._nsiDateSubscription.unsubscribe(); 
    this.logInfo = 'подписка даты НСИ отписана';
    this.logInfo = 'ошибка чтения даты НСИ';
    this.logDebugValue = error;
  }

  setUpdateDate(resp: IUpdateDateDb) {
    this._nsiDateSubscription.unsubscribe(); 
    this.logInfo = 'подписка даты НСИ отписана';
    this.logInfo = 'дата обновления БД сервера = ' + resp.val;
    this.lastServerUpdateNsiDate = resp.val;
    this.cacheUpdateNsiDate.load((err, tableStats, metaStats) => {
      if (!err && tableStats.foundData && tableStats.rowCount > 0) {
        resp = this.cacheUpdateNsiDate.find({ '_id': 1 });
        this.logInfo = 'дата обновления НСИ из локального кэша ' + resp[0].value;
        this.lastCacheUpdateNsiDate = resp[0].value;
        if (this.lastCacheUpdateNsiDate === this.lastServerUpdateNsiDate) {
          this.logInfo = 'дата обновления НСИ <БД = кэш>';
          this.logInfo = 'загрузка НСИ из кэша ...';
          this.cacheAllLoading();

        } else { // грузим с сервера при несовпадении дат обновления базы
          this.logInfo = 'дата обновления НСИ в кэше существует';
          this.logInfo = 'дата обновления НСИ <кэш !== БД>';
          this.logInfo = 'загрузка НСИ из БД  ...';

          // читаем все из сервера БД
          this.loadAllCacheHttp();
        }
      } else {
        this.cacheAllLoading();
        this.cacheUpdateNsiDate.insert({ _id: 1, value: this.lastServerUpdateNsiDate })
        this.cacheUpdateNsiDate.save(Error => {
          if (!Error) {
            this.logInfo = 'локальный кэш с датой обновления НСИ из БД сохранен на диск';
          } else {
            this._errorDialog.show();
            this._errorDialog.mdlText = this._validService.errorMsgs.errorSaveCacheUpdateDbDate;
            this._progressDialog.display = false;
            this._mdlBlockUI = false;
            this.logInfo = 'ошибка сохранения локального кэша с датой обновления НСИ из БД на диск';
          }
        });
      }
    });
  }

  login() {
    this.logMsgAll('получение сессии...', '@AppComponent@Login');
    this._loginSubscription = this._loginService.get().subscribe(loginResp => { this.checkLogin(loginResp) }, error => this.loginError(error));
  }

  loginError(Error) {
    this._loginSubscription.unsubscribe();
    this.logInfo = 'подписка авторизации отписана';

    this._progressDialog.queryProgress = false;
    this._progressDialog.close();
    this.detectChanges();

    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.invalidRespAppServer;
    this.detectChanges();
    this.logInfo = 'сессия не получена';
    
    if (Error !== undefined) {
      this.logInfo = 'ответ сервера приложений = ';
      this.logDebugValue = Error;
    } else {
      this.logInfo = 'ответ сервера приложений пуст';
    }
  }

  checkLogin(Resp: any) {
    this._loginSubscription.unsubscribe();
    this.logInfo = 'подписка авторизации отписана';

    if (Resp.USER !== undefined) {
      if (environment.target === Target.KTC){ // пишем IP только в KТЦ
        this._statService.write();
      }
      this._loginService.session = Resp.USER[0].UUID;

      this.logMsgAll('сессия получена', '@AppComponent@checkLogin');
      this.loadNsi(event);
    } else {
      this.logMsgAll('сессия не получена', '@AppComponent@checkLogin');
      this._progressDialog.title = 'Не удалось соединиться с сервером приложений. ';
      this._progressDialog.text = 'Сбой сервера приложений. Функциональность приложения недоступна. Перезагрузите приложение. ';
      this._progressDialog.queryProgress = false;
      this.detectChanges();
      setTimeout(() => {
        this._progressDialog.queryProgress = false;
        this._progressDialog.close();
        this.detectChanges();
      }, 2000);
    }
  }

  getUrlApi() {
    console.log('чтение API URLs ...');
    this._progressDialog.show();
    this._progressDialog.title = 'Инициализация ...';
    this._progressDialog.queryProgress = true;
    this._mdlBlockUI = true;
    this.detectChanges();

    this._apiSubscription = this._apiService.getURLS().subscribe(confResp => {
      console.log('чтение API URLs успешно');
      this._apiService.setAPI(confResp);
      if (confResp.version !== this._VERSION){

        this._progressDialog.queryProgress = false;
        this._progressDialog.close();
        this._mdlBlockUI = false;
        this.detectChanges();

        this._isVariosBuilds = true;
        this._Router.navigate(['/versions']); 
        
        console.log('сборка на сервере = ' + confResp.version);
        console.log('сборка в работе (из кэша браузера?) = ' + this._VERSION);
        console.log('несовпадение сборок!');
        
      } else {
        this._showUI = true;
        console.log(`assets URL = ${this._apiService.urlAssets}`);
        console.log(`scripts URL = ${this._apiService.urlNsi}`);
        console.log(`servlets URL = ${this._apiService.urlCalc}`);

        this._versionBackendSubscription = this._backendVersionService.get().subscribe( resp => this.setVersionBackend(resp), error => this.errorVersionBackend(error));
        this._tariffPolicySubscription = this._tariffPolicyService.get().subscribe( resp => this.setTariffPolicyDate(resp), error => this.errorTariffPolicyDate(error));
        
        console.log(`таймаут запроса маршрута = ${this._apiService.routeTimeout}`);
        console.log(`таймаут запроса расчета = ${this._apiService.calcTimeout}`);
        this.handleLoadContinue();      
      }
    }, error => this.errorUrlApi(error), () => this.finishUrlApi() );
  }

  errorUrlApi(error){
    console.log('ошибка получения URL API');
    this.logDebugValue = error;
  }

  finishUrlApi(){
    this._apiSubscription.unsubscribe();
    console.log('подписка на получение URL API отписана');
  }

  setVersionBackend(resp: any){
    console.log('версия классов бэкенда = ' + resp.version);
    console.log('дата классов бэкенда = ' + resp.date);
    this._backendVersion = resp.version;
    this._backendDate = resp.date;
    this._versionBackendSubscription.unsubscribe();
    console.log('подписка на версию бэкенда отписана');
  }

  errorVersionBackend(error: any){
    console.log('ошибка чтения версии классов бэкенда');
    this.logDebugValue = error;
  }

  setTariffPolicyDate(resp: any){
    this._tariffPolicyDate = resp.computed.replace(/\//gi, '.');
    console.log(`дата тарифной политики = ${this._tariffPolicyDate}`);
    this._tariffPolicySubscription.unsubscribe();
    console.log(`подписка на дату тарифной политики отписана`);
  }

  errorTariffPolicyDate(error: any){
    console.log('ошибка чтения даты тарифной политики');
    this.logDebugValue = error;
  }

  handleLoadContinue(){
    this.detectChanges();
    console.log('чтение конфига логгирования...');
    this._configSubscription = this._logService.getConfig().subscribe(resp => this.setConfig(resp), error => this.errorConfig(error) );
  }

  errorConfig(error: any) {
    this._configSubscription.unsubscribe();
    this.logInfo = 'подписка конфигурации отписана';
  }  

  setConfig(resp: any) {
    this._configSubscription.unsubscribe();
    this.logInfo = 'подписка конфигурации отписана';

    this._logService.localFlag = resp.local;
    this._logService.remoteFlag = resp.remote;
    this._logService.URL = resp.logAPI;
    this._logService.actualPeriodStore = resp.period;
    this._statService.URL = resp.statAPI;

    console.log(`local log URL = ${resp.local}`);
    console.log(`remote log URL = ${resp.remote}`);
    console.log(`actual logs period store = ${resp.period}`);
    console.log(`log API = ${resp.logAPI}`);
    console.log(`stat API = ${resp.statAPI}`);

    if (this._logService.remoteFlag){
      this.logInfo = 'чистка неактуальных логов...';
      this._eraseLogsSubscription = this._logService.erase().subscribe(resp => this.finishEraseLogs(), 
                                        error => this.errorEraseLogs(error));
    }
    this.login();
  }

  finishEraseLogs(){
    this._eraseLogsSubscription.unsubscribe();
    this.logInfo = 'подписка на очистку логов отписана';
    this.logInfo = 'чистка неактуальных логов успешно завершена';
  } 

  errorEraseLogs(error: any){
    this._eraseLogsSubscription.unsubscribe();
    this.logInfo = 'подписка на очистку логов отписана';
    this.logInfo = 'ошибка очистки неактуальных логов'
  }  
  
  setNsiView() {
    this.setOwnershipsView();
    this.setSvoView();
    this.setWagTypeView();
    this.setContTypeView();
    this.setKsView();
    this.setSpecialMarksView();
    this._cacheService.defaultValues = false;
    this._visibleControlsService.subjectSvo.next();
  }

  setOwnershipsView() {
    let Resp: any;
    Resp = this.cacheOwnerships.find({ 'name': { $ne: '' } });
    this.Ownerships = [];
    Resp.forEach((Item, Index) => {
      if (Index < 3) {
        this.Ownerships.push({ label: '', value: { id: Item.kod, name: '', code: '' } });
      }
    }
    );
    // костыль            
    if (this.Ownerships.length > 0) {
      this.Ownerships[0].label = 'Инвентарный парк';
      this.Ownerships[1].label = 'Собственный';
      this.Ownerships[2].label = 'Арендованный';
      this.Ownerships[0].value.name = 'Инвентарный парк';
      this.Ownerships[1].value.name = 'Собственный';
      this.Ownerships[2].value.name = 'Арендованный';
      if (this._cacheService.defaultValues) {
        this.wagOwnershipItem = this.Ownerships[0].value;
        this.wagOwnershipCode = Number.parseInt(this.Ownerships[0].value.id);
        this.contOwnershipItem = this.Ownerships[0].value;
        this.contOwnershipCode = Number.parseInt(this.Ownerships[0].value.id);
      }

    }
  }

  setWagTypeView() {
    if (this._cacheService.defaultValues) {
      const Resp = this.cacheWagTypes.find({ 'name_web': { $ne: '' } });
      const defValue: any = Resp.filter(Item => Item.name_web === 'Крытый');
      this.wagTypeRow = defValue[0];
    }
  }

  setContTypeView() {
    if (this._cacheService.defaultValues) {
      const Resp = this.cacheContTypes.find({ 'kod': { $gte: 0 } });
      const defValue: any = Resp.filter(Item => Item.kod === 0);
      this.contTypeCode = defValue[0].kod;
      this.contType = defValue[0].tip;
    }
  }

  setKsView() {
    if (this._cacheService.defaultValues) {
      let Resp: any;
      Resp = this.cacheKss.find({ 'name': { $ne: '' } });
      const defValue: any = Resp.filter(Item => Item.kadm === 21);
      this.ksCode = defValue[0].kadm.toString();
      this.Ks = defValue[0].name;
    }
  }

  setSvoView() {
    let Resp: any = this.cacheSvo.find({ 'name': { $ne: '' } });
    this.Svos = [];
    Resp.forEach((Item) => {
      this.Svos.push({ label: Item.name, value: { id: Item.kod, name: Item.name, code: Item.kod } });
    }
    )
  }

  setSpecialMarksView() {
    let resp = this.cacheSpecialMarks.find({ 'name': { $ne: '' } });
    resp.forEach((item: ISpecMark) => {
      item.name = item.name.toLocaleLowerCase();
      this._specMarkListService.specMarkAllSuggestions.push(item);
    }
    );
  }

  handleChangeDate() {
    this.logDebug = '@CalcComponent @handleChangeDate';
    if (this.mdlDate === '' || this.mdlDate === undefined) {
      setTimeout(()=> { this._mdlDateFilled = '';
                        this.detectChanges();
                      }, 100);
    } else {
      setTimeout(()=> { this._mdlDateFilled = 'highlight';
                        this.detectChanges();
                      }, 100);

    }
  }

}
