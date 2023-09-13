import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SelectItem } from 'primeng/primeng';
import * as moment from 'moment';
import { ApiService, QUERY_STATUS } from './api.service';
import { RouteService } from './route.service';
import { LogService } from './log.service';
import { LoginService } from './login.service';
import { OwnershipListService } from '../services/ownership-list.service';
import { SvoListService } from '../services/svo-list.service';
import { WagTypeListService } from '../services/wag-type-list.service';
import { ContTypeListService } from '../services/cont-type-list.service';
import { SpecMarkListService } from '../services/spec-mark-list.service';
import { ISpecMark } from '../services/special-mark.service';
import { KsListService } from '../services/ks-list.service';
import { IWagType } from '../services/wag-types.service';

export interface ICalcRepItem {
    label: string;
    value: string;
}

export interface ICalcRepItems {
    data: ICalcRepItem[];
}

export class CalcRepItem implements ICalcRepItem {
    label: string = '';
    value: string = '';

    constructor(label?, value?) {
        this.label = label;
        this.value = value;
    }
}

class ValueFormatter {
    private _label: string;
    private _posSpace: number;
    private _labelCutCurrency: string;
    private _posValue: number;
    private _cutCurrency: string;
    private _cutCurrencyValid: string;
    private _value: number;
    
    getLabel(lexem: string): string {
        this._label = lexem.substr(0, lexem.length - 4);
        this._posSpace = this._label.trim().lastIndexOf(' ');
        return this._label.substr(0, this._posSpace);
    }

    getValueCurrency(lexem: string): string {
        this._posSpace = lexem.trim().lastIndexOf(' '); // пробел до валюты
        this._labelCutCurrency = lexem.substr(0, this._posSpace - 1); // 
        this._posValue = this._labelCutCurrency.trim().lastIndexOf(' '); // пробел до значения
        return lexem.substr(this._posValue);
    }

    getValue(lexem: string): number {
        lexem = lexem.trim();
        this._cutCurrency = lexem.substr(0, lexem.length - 4);
        this._cutCurrencyValid = this._cutCurrency.replace(',', '.');
        this._value = Number.parseFloat(this._cutCurrencyValid);
        if (!Number.isNaN(this._value)) {
            return this._value;
        } else {
            return 0;
        }
    }
}

@Injectable()
export class CalcService {
    private _outStationCode: string = '';
    private _outStation: string = '';
    private _outCountryCode: string = '';
    private _outCountry: string = '';
    private _inStationCode: string = '';
    private _inStation: string = '';

    private _factInCountryCode: string;
    private _factInCountry: string;
    private _userInCountryCode: string;
    private _userInCountry: string;

    private _velocityIndex: number;
    private _wagCapacity: string = '68';
    private _FootItem: any;
    private _Foot: string;
    private _ndsFlag: boolean;
    private _cargoWeight: string = '0';
    private _Conductors: string = '0';
    private _Pivots: string = '4';
    private _contCol: string = '0';
    private _Gng: string;
    private _gngCode: string;
    private _etsngCode: string;
    private _Etsng: string;
    private _Date: string = moment().format('DD.MM.YYYY');
    private _contPayload: string = '0';
    private _tarifTypeItem: SelectItem;
    private _tarifType: string;
    private _tarifTypeCode: string;
    private _Pay: string;
    private _shadowEtsngCode: string = '';
    private _calcResp: CalcRepItem[] = [];
    private _calcRespView: CalcRepItem[] = [];
    private _currencyCode: number = 933;
    private _currencyItem: SelectItem;
    private _Currency: string;
    private _specMarkChips: string;

    private _Status: QUERY_STATUS;
    private _formatter: ValueFormatter;

    private _payRB: number = 0;
    private _nativeCountry: string = '';

    private _receptionJoint: string;
    private _receptionJointCode: string;
    private _surrenderJoint: string;
    private _surrenderJointCode: string;
    private _formPlanWagons: number;

    constructor(private _httpService: HttpClient, private _apiService: ApiService, private _routeService: RouteService,
        private _logService: LogService, private _loginService: LoginService,
        private _ownershipListService: OwnershipListService, private _svoListService: SvoListService,
        private _wagTypeListService: WagTypeListService, private _contTypeListService: ContTypeListService,
        private _specMarkListService: SpecMarkListService, private _ksListService: KsListService
    ) {
        this._Status = QUERY_STATUS.Null;
        this._formatter = new ValueFormatter();
    }

    /**
     * Getter typewagDisabled
     * @return {boolean}
     */
    public get typewagDisabled(): boolean {
        return this._typewagDisabled;
    }

    /**
     * Setter typewagDisabled
     * @param {boolean} value
     */
    public set typewagDisabled(value: boolean) {
        this._typewagDisabled = value;
    }
    private _typewagDisabled: boolean;

    /**
     * Getter outStationCode
     * @return {string }
     */
    public get outStationCode(): string {
        return this._outStationCode;
    }

    /**
     * Getter outStation
     * @return {string }
     */
    public get outStation(): string {
        return this._outStation;
    }

    /**
     * Getter outCountryCode
     * @return {string }
     */
    public get outCountryCode(): string {
        return this._outCountryCode;
    }

    /**
     * Getter outCountry
     * @return {string }
     */
    public get outCountry(): string {
        return this._outCountry;
    }

    /**
     * Getter inStationCode
     * @return {string }
     */
    public get inStationCode(): string {
        return this._inStationCode;
    }

    /**
     * Getter inStation
     * @return {string }
     */
    public get inStation(): string {
        return this._inStation;
    }

    /**
     * Getter inCountryCode
     * @return {string}
     */
    public get userInCountryCode(): string {
        return this._userInCountryCode;
    }

    /**
     * Getter inCountryName
     * @return {string}
     */
    public get userInCountry(): string {
        return this._userInCountry;
    }

    public get factInCountryCode(): string {
        return this._factInCountryCode;
    }

    /**
     * Getter inCountryName
     * @return {string}
     */
    public get factInCountry(): string {
        return this._factInCountry;
    }

    /**
     * Getter velocityIndex
     * @return {number}
     */
    public get velocityIndex(): number {
        return this._velocityIndex;
    }

    /**
     * Getter wagCapacity
     * @return {string }
     */
    public get wagCapacity(): string {
        return this._wagCapacity;
    }

    /**
     * Getter wagOwnershipCode
     * @return {number}
     */
    public get wagOwnershipCode(): number {
        return this._ownershipListService.wagOwnershipCode;
    }

    /**
     * Getter contOwnershipCode
     * @return {number}
     */
    public get contOwnershipCode(): number {
        return this._ownershipListService.contOwnershipCode;
    }

    /**
     * Getter Foot
     * @return {string }
     */
    public get FootItem(): any {
        return this._FootItem;
    }

    /**
     * Getter svoCode
     * @return {string }
     */
    public get svoCode(): string {
        return this._svoListService.code;
    }

    /**
     * Getter svoItem
     * @return {SelectItem}
     */
    public get svoItem(): SelectItem {
        return this._svoListService.item;
    }

    /**
     * Getter ndsFlag
     * @return {boolean}
     */
    public get ndsFlag(): boolean {
        return this._ndsFlag;
    }

    /**
     * Getter cargoWeight
     * @return {string }
     */
    public get cargoWeight(): string {
        return this._cargoWeight;
    }

    /**
     * Getter Conductors
     * @return {string }
     */
    public get Conductors(): string {
        return this._Conductors;
    }

    /**
     * Getter Pivots
     * @return {string }
     */
    public get Pivots(): string {
        return this._Pivots;
    }

    /**
     * Getter contCol
     * @return {string }
     */
    public get contCol(): string {
        return this._contCol;
    }

    /**
     * Getter Gng
     * @return {string}
     */
    public get Gng(): string {
        return this._Gng;
    }

    /**
     * Getter gngCode
     * @return {string}
     */
    public get gngCode(): string {
        return this._gngCode;
    }

    /**
     * Getter etsngCode
     * @return {string}
     */
    public get etsngCode(): string {
        return this._etsngCode;
    }

    /**
     * Getter Etsng
     * @return {string}
     */
    public get Etsng(): string {
        return this._Etsng;
    }
   
    /**
     * Getter typewag
     * @return {string}
     */
    public get wagTypeRow(): IWagType {
        return this._wagTypeListService.Row
    }

    public set wagType(value: IWagType) {
        this._wagTypeListService.Row = value;
    }

    /**
     * Getter wagOwnership
     * @return {string}
     */
    public get wagOwnershipItem(): SelectItem {
        return this._ownershipListService.wagOwnershipItem;
    }

    /**
     * Getter Ks
     * @return {string}
     */
    public get Ks(): string {
        return this._ksListService.Name;
    }

    /**
     * Getter ksCode
     * @return {string}
     */
    public get ksCode(): string {
        return this._ksListService.Code;
    }

    /**
     * Getter contType
     * @return {string}
     */
    public get contType(): string {
        return this._contTypeListService.Name;
    }

    /**
     * Getter contTypeCode
     * @return {number}
     */
    public get contTypeCode(): number {
        return this._contTypeListService.Code;
    }

    /**
     * Getter contOwnership
     * @return {string}
     */
    public get contOwnershipItem(): SelectItem {
        return this._ownershipListService.contOwnershipItem;
    }

    /**
     * Getter contPayload
     * @return {string }
     */
    public get contPayload(): string {
        return this._contPayload;
    }

    /**
 * Getter tarifTypeItem
 * @return {SelectItem}
 */
    public get tarifTypeItem(): SelectItem {
        return this._tarifTypeItem;
    }

    /**
     * Getter tarifType
     * @return {string}
     */
    public get tarifType(): string {
        return this._tarifType;
    }

    /**
     * Getter tarifTypeCode
     * @return {string}
     */
    public get tarifTypeCode(): string {
        return this._tarifTypeCode;
    }

    /**
     * Getter Pay
     * @return {string}
     */
    public get Pay(): string {
        return this._Pay;
    }

    /**
     * Getter calcResp
     * @return {RespElem[]}
     */
    public get calcResp(): ICalcRepItem[] {
        return this._calcResp;
    }

    /**
     * Setter outStationCode
     * @param {string } value
     */
    public set outStationCode(value: string) {
        this._outStationCode = value;
    }

    /**
     * Setter outStation
     * @param {string } value
     */
    public set outStation(value: string) {
        this._outStation = value;
    }

    /**
     * Setter outCountryCode
     * @param {string } value
     */
    public set outCountryCode(value: string) {
        this._outCountryCode = value;
    }

    /**
     * Setter outCountry
     * @param {string } value
     */
    public set outCountry(value: string) {
        this._outCountry = value;
    }

    /**
     * Setter inStationCode
     * @param {string } value
     */
    public set inStationCode(value: string) {
        this._inStationCode = value;
    }

    /**
     * Setter inStation
     * @param {string } value
     */
    public set inStation(value: string) {
        this._inStation = value;
    }

    /**
     * Setter inCountryCode
     * @param {string} value
     */
    public set userInCountryCode(value: string) {
        this._userInCountryCode = value;
    }

    /**
     * Setter inCountryName
     * @param {string} value
     */
    public set userInCountry(value: string) {
        this._userInCountry = value;
    }


    /**
     * Setter inCountryCode
     * @param {string} value
     */
    public set factInCountryCode(value: string) {
        this._factInCountryCode = value;
    }

    /**
     * Setter inCountryName
     * @param {string} value
     */
    public set factInCountry(value: string) {
        this._factInCountry = value;
    }


    /**
     * Setter velocityIndex
     * @param {number} value
     */
    public set velocityIndex(value: number) {
        this._velocityIndex = value;
    }

    /**
     * Setter wagCapacity
     * @param {string } value
     */
    public set wagCapacity(value: string) {
        this._wagCapacity = value;
    }

    /**
     * Setter wagKsCode
     * @param {string} value
     */
    public set wagKsCode(value: string) {
        this._ksListService.Code = value;
    }

    public get wagKsCode() {
        return this._ksListService.Code;
    }

    /**
     * Setter wagOwnershipCode
     * @param {number} value
     */
    public set wagOwnershipCode(value: number) {
        this._ownershipListService.wagOwnershipCode = value;
    }

    /**
     * Setter contOwnershipCode
     * @param {number} value
     */
    public set contOwnershipCode(value: number) {
        this._ownershipListService.contOwnershipCode = value;
    }

    /**
     * Setter Foot
     * @param {string } value
     */
    public set FootItem(value: any) {
        this._FootItem = value;
    }

    /**
     * Setter svoCode
     * @param {string } value
     */
    public set svoCode(value: string) {
        this._svoListService.code = value;
    }

    /**
     * Setter svoItem
     * @param {SelectItem} value
     */
    public set svoItem(value: SelectItem) {
        this._svoListService.item = value;
    }

    /**
     * Setter ndsFlag
     * @param {boolean} value
     */
    public set ndsFlag(value: boolean) {
        this._ndsFlag = value;
    }

    /**
     * Setter cargoWeight
     * @param {string } value
     */
    public set cargoWeight(value: string) {
        this._cargoWeight = value;
    }

    /**
     * Setter Conductors
     * @param {string } value
     */
    public set Conductors(value: string) {
        this._Conductors = value;
    }

    /**
     * Setter Pivots
     * @param {string } value
     */
    public set Pivots(value: string) {
        this._Pivots = value;
    }

    /**
     * Setter contCol
     * @param {string } value
     */
    public set contCol(value: string) {
        this._contCol = value;
    }

    /**
     * Setter Gng
     * @param {string} value
     */
    public set Gng(value: string) {
        this._Gng = value;
    }

    /**
     * Setter gngCode
     * @param {string} value
     */
    public set gngCode(value: string) {
        this._gngCode = value;
    }

    /**
     * Setter etsngCode
     * @param {string} value
     */
    public set etsngCode(value: string) {
        this._etsngCode = value;
    }

    /**
     * Setter Etsng
     * @param {string} value
     */
    public set Etsng(value: string) {
        this._Etsng = value;
    }
    
    /**
     * Setter wagOwnership
     * @param {string} value
     */
    public set wagOwnershipItem(value: SelectItem) {
        this._ownershipListService.wagOwnershipItem = value;
    }

    /**
     * Setter Ks
     * @param {string} value
     */
    public set Ks(value: string) {
        this._ksListService.Name = value;
    }

    /**
     * Setter ksCode
     * @param {string} value
     */
    public set ksCode(value: string) {
        this._ksListService.Code = value;
    }

    /**
     * Setter contType
     * @param {string} value
     */
    public set contType(value: string) {
        this._contTypeListService.Name = value;
    }

    /**
     * Setter contTypeCode
     * @param {number} value
     */
    public set contTypeCode(value: number) {
        this._contTypeListService.Code = value;
    }

    /**
     * Setter contOwnership
     * @param {string} value
     */
    public set contOwnershipItem(value: SelectItem) {
        this._ownershipListService.contOwnershipItem = value;
    }

    /**
     * Setter contPayload
     * @param {string } value
     */
    public set contPayload(value: string) {
        this._contPayload = value;
    }

    /**
     * Setter tarifTypeItem
     * @param {SelectItem} value
     */
    public set tarifTypeItem(value: SelectItem) {
        this._tarifTypeItem = value;
    }

    /**
     * Setter tarifType
     * @param {string} value
     */
    public set tarifType(value: string) {
        this._tarifType = value;
    }

    /**
     * Setter tarifTypeCode
     * @param {string} value
     */
    public set tarifTypeCode(value: string) {
        this._tarifTypeCode = value;
    }

    /**
     * Setter Pay
     * @param {string} value
     */
    public set Pay(value: string) {
        this._Pay = value;
    }

    /**
     * Setter calcResp
     * @param {RespElem[]} value
     */
    public set calcResp(value: ICalcRepItem[]) {
        this._calcResp = value;
    }

    /**
     * Getter Date
     * @return {string }
     */
    public get Date(): string {
        return this._Date;
    }

    /**
     * Getter svoType
     * @return {SelectItem}
     */
    public get svoType(): SelectItem {
        return this._svoListService.item;
    }

    /**
     * Getter shadowEtsngCode
     * @return {string }
     */
    public get shadowEtsngCode(): string {
        return this._shadowEtsngCode;
    }

    public get specMarkChips(): string {
        return this._specMarkChips;
    }

    public set specMarkChips(value: string) {
        this._specMarkChips = value;
    }

    /**
     * Setter Date
     * @param {string } value
     */
    public set Date(value: string) {
        this._Date = value;
    }

    /**
     * Setter svoType
     * @param {SelectItem} value
     */
    public set svoType(value: SelectItem) {
        this._svoListService.item = value;
    }

    public set shadowEtsngCode(value: string) {
        this._shadowEtsngCode = value;
    }

    public set logInfo(Msg: string) {
        this._logService.info = Msg;
    }

    public set logDebug(Msg: string) {
        this._logService.debug = Msg;
    }

    public set logDebugValue(Msg: any) {
        this._logService.debugValue = Msg;
    }

    /**
       * Getter calcRespView
       * @return {CalcRepItem[]}
       */
    public get calcRespView(): CalcRepItem[] {
        return this._calcRespView;
    }

    /**
     * Setter calcRespView
     * @param {CalcRepItem[]} value
     */
    public set calcRespView(value: CalcRepItem[]) {
        this._calcRespView = value;
    }

    public set currencyCode(value: number) {
        this._currencyCode = value;
    }

    public get currencyCode(): number {
        return this._currencyCode;
    }

    public set currencyItem(value: any) {
        this._currencyItem = value;
    }

    public get currencyItem(): any {
        return this._currencyItem;
    }

    public set Currency(value: string) {
        this._Currency = value;
    }

    public get Currency(): string {
        return this._Currency;
    }

    public set Status(value: QUERY_STATUS) {
        this._Status = value;
    }

    public get Status(): QUERY_STATUS {
        return this._Status;
    }

    public set Foot(value: string) {
        this._Foot = value;
    }

    public get Foot(): string {
        return this._Foot;
    }

    public get payRB(): number {
        return this._payRB;
    }

    public get nativeCountry(): string {
        return this._nativeCountry;
    }

    public get receptionJoint(): string {
        return this._receptionJoint;
    }

    public set receptionJoint(value: string) {
        this._receptionJoint = value;
    }

    public set surrenderJoint(value: string) {
        this._surrenderJoint = value;
    }

    public get surrenderJoint() : string {
        return this._surrenderJoint;
    }

    public set receptionJointCode(value: string) {
        this._receptionJointCode = value;
    }

    public get receptionJointCode(): string {
        return this._receptionJointCode;
    }
        
    public get surrenderJointCode(): string {
        return this._surrenderJointCode;
    }

    public set surrenderJointCode(value: string) {
        this._surrenderJointCode = value;
    }

    public get formPlanWagons(): number {
        return this._formPlanWagons;
    }

    public set formPlanWagons(value: number) {
        this._formPlanWagons = value;
    }

    copyTax(resp: any) {
        let label_: string = '';
        let _pay: number = 0;
        let _value: number;
        let flagCountPay: boolean = false;
        this._calcRespView = [];

        this.logDebug = 'формирование полного отчета таксировки...';
        this.logDebug = 'строк в ответе = ' + (resp.length - 1);
        
        resp.pop();
        this.logDebug = 'разделение блоков маршрута...';
        resp.forEach(item => {
            let _label = item.label;
            if (_label.indexOf('Расстояние') >= 0 || _label.indexOf('Станция отправления') >= 0) {
                this._calcRespView.push(new CalcRepItem('', ''));
            };
            if (item.value.trim() === 'null') {
                item.value = '';
            };
            this._calcRespView.push({ label: _label, value: item.value });
        });
       
        this._calcRespView.push(new CalcRepItem('', ''));
        this.logDebug = 'разделение блоков маршрута завершено';

        // выравнивание валют
        this.logDebug = 'форматирование валют...';
        
        this._calcRespView.forEach((item, index) => {
            if (item.label === '' && item.value === '') {

                if (this._calcRespView[index - 1] !== undefined && this._calcRespView[index - 1] !== null){
                if (this._calcRespView[index - 1].value === '') {
                    label_ = this._calcRespView[index - 1].label;
                    this._calcRespView[index - 1].label = this._formatter.getLabel(label_);
                    this._calcRespView[index - 1].value = this._formatter.getValueCurrency(label_);
                }}
            }
            
            if (item.label.indexOf('Стоимость') === 0) {
                
                label_ = this._calcRespView[index].label;
                this._calcRespView[index].label = this._formatter.getLabel(label_);
                this._calcRespView[index].value = this._formatter.getValueCurrency(label_);

            }
        });
        this.logDebug = 'форматирование валют завершено';

        // предобработка - добавление имен станций и ГНГ/ЕТСНГ
        this.logDebug = 'добавление имен станций и ГНГ-ЕТСНГ...';

        // поиск индекса начала блока станций и ГНГ-ЕТСНГ startIndexTransform
        let startIndexTransform = -1;
        for (let i = 0; i < resp.length; i++)
            if (resp[i].label.indexOf("Станция отправления") > -1) {
                startIndexTransform = i;
                break;
            }
        startIndexTransform++; // ответ сервера и вью расчета отличаются пустовй строкой после курсов валют @17.07.20
        this._calcRespView[startIndexTransform].value = this._calcRespView[startIndexTransform].value.substring(0, this._calcRespView[startIndexTransform].value.indexOf(' ') + 1) + this._outStation;
        startIndexTransform++;
        startIndexTransform++;
        this._calcRespView[startIndexTransform].value = this._calcRespView[startIndexTransform].value.substring(0, this._calcRespView[startIndexTransform].value.indexOf(' ') + 1) + this._inStation;
        startIndexTransform++;
        startIndexTransform++;
        this._calcRespView[startIndexTransform].value = this._gngCode + ' ' + this._Gng;
        startIndexTransform++;
        this._calcRespView[startIndexTransform].value = this._etsngCode + ' ' + this._Etsng;
        this.logDebug = 'добавление имен станций и ГНГ-ЕТСНГ завершено';

        this.logDebug = 'подсчет таксировки...';
        this.logDebug = 'страна отправления = ' + this._outCountry;
        this.logDebug = 'страна прибытия = ' + this._factInCountry;
        if (this._outCountryCode === '112') {
            this._nativeCountry = this._outCountry;
        }
        if (this._factInCountryCode === '112') {
            this._nativeCountry = this._factInCountry;
        }
        this.logDebug = 'родная страна = ' + this._nativeCountry;
        this.calcRespView.forEach((item: ICalcRepItem, index: number) => {
            if (item.label.indexOf('Расстояние') >= 0) { // начало блока таксировки
                //this.logDebug = 'индекс страны отправления = ' + item.label.indexOf(this._inCountry);
                //if (this._nativeCountry !== '' ) {
                //  flagCountPay = true;
                this.logDebug = 'начало блока таксировки(подсчет включен)...';
                this.logDebug = 'литерал = ' + item.label;
                //} 
            }
            // то идем дальше, до пустой строки 
            if (item.label === '' && item.value === '') { //&& flagCountPay
                if (this.calcRespView[index - 1] !== undefined && this.calcRespView[index - 1] !== null){
                    _value = this._formatter.getValue(this.calcRespView[index - 1].value);
                    _pay = _pay + _value;
                }
            }
        });
        this._Pay = parseFloat((_pay).toString()).toFixed(2);
        
        this.logDebug = 'общая таксировка = ' + this._Pay;
        this.logDebug = 'подсчет общей таксировки завершен';
        this.logDebug = 'полный отчет таксировки сформирован.';
    }

    normalizeParams() {    // блок закрытия проблемы инициализации и безопасной коррекции параметров
        if (this._velocityIndex === undefined) {
            this._velocityIndex = 0;
        }
        if (this._Conductors === undefined || this._Conductors === '') {
            this._Conductors = '0';
        }
        if (this._Pivots === undefined) {
            this._Pivots = '0';
        }
        if (this._cargoWeight === undefined) {
            this._cargoWeight = '0';
        }
        if (this.wagOwnershipCode === undefined) {
            this.wagOwnershipCode = 1;
        }
        if (this.contOwnershipCode === undefined) {
            this.contOwnershipCode = 1;
        }
        if (this._tarifTypeCode === undefined) {
            this.tarifTypeCode = '15';
        }
        if (this.contTypeCode === undefined) {
            this.contTypeCode = 0;
        }
        if (this._gngCode === undefined) {
            this._gngCode = '0';
        }
        if (this._Gng === undefined) {
            this._Gng = '';
        }
        if (this.svoCode !== '5' && this.svoCode !== '6') { // не контейнерная отправка
            //    this._contCol = '0';
        } else { // контейнерная отправка
            if (this._contCol === undefined || this._contCol === '') { // рекомендация Малаховой
                this._contCol = '1';
            }
        }
        if (this._contPayload === undefined || this._contPayload === '') {
            this._contPayload = '0';
        }
    }

    isStationRB(outCountryCode, inCountryCode): boolean {
        let flag: boolean = false;
        if (outCountryCode === '112' || inCountryCode === '112') {
            flag = true;
        }
        return flag;
    }

    get(): Observable<ICalcRepItems> {
        this.logDebug = '@CalcServise @get';
        let nextHttpParams: HttpParams;
        let prevHttpParams: HttpParams;
        let _foot_: string = this._Foot;
        let _contCol_: string = this._contCol;
        let _contPayload_: string = this._contPayload;
        let _receptionJointTransitCode = this._receptionJointCode;
        let _surrenderJointTransitCode = this._surrenderJointCode;
        let _httpParamsFinal;
        //if (this.svoCode === '1') {
        //    _foot_ = '0';
        //    _contCol_ = '0';
        //    _contPayload_ = '0';
        //}

        if (this.svoCode !== '5' && this.svoCode !== '6') { // не контейнерная отправка
            _foot_ = '0';
            _contCol_ = '0';
            _contPayload_ = '0';
        }
        if (this.isStationRB(this._outCountryCode, this._factInCountryCode)) {
            _receptionJointTransitCode = '';
            _surrenderJointTransitCode = '';
        }

        this.normalizeParams();
        let _httpParamsBase: HttpParams = new HttpParams().
            set('outstation', this._outStationCode).
            set('deststation', this._inStationCode).
            set('outcountry', this._outCountryCode).
            set('destcountry', this._factInCountryCode).
            set('inRW', _receptionJointTransitCode).
            set('outRW', _surrenderJointTransitCode).
            set('velocity', String(this._velocityIndex)).
            set('totaldist', String(this._routeService.route.totalDist)).
            set('beldist', String(this._routeService.route.belDist)).
            set('wagoncapacity', String(this._wagCapacity)).
            set('typewagon', String(this.wagTypeRow.nomv4)).
            set('ks', this.wagKsCode).
            set('conductors', this._Conductors).
            set('pivots', this._Pivots).
            set('cargoweight', this._cargoWeight).
            set('gng', this._gngCode).
            set('etsng', this._etsngCode).
            set('ownershipwagon', String(this.wagOwnershipCode)).
            set('contcol', _contCol_).
            set('foot', _foot_).
            set('ownershipcont', String(this.contOwnershipCode)).
            set('date', this._Date).
            set('svo', this.svoCode).
            //set('tarifftype', this._tarifTypeCode). по сетке идет константа - смысл ?
            set('typecont', String(this.contTypeCode)).
            set('currency', String(this._currencyCode)).
            set('tare', String(this._wagTypeListService.Row.tara)).
            set('waglen', String(this._wagTypeListService.Row.udl)).
            set('contpayload', _contPayload_).
            set('UUID', this._loginService.session);
        nextHttpParams = _httpParamsBase;
        if (this._specMarkListService.selectedSpecMarks.length > 0) {
            prevHttpParams = _httpParamsBase;
            this._specMarkListService.selectedSpecMarks.forEach((item: ISpecMark) => {
                prevHttpParams = nextHttpParams;
                nextHttpParams = prevHttpParams.append('specmark', String(item.kod));
            })
        }
        return this._httpService.get(this._apiService.urlCalc + 'calc', { params: nextHttpParams }) as Observable<ICalcRepItems>;
    }


    getTest(): Observable<ICalcRepItems> {
        let _Params: string[] = [];
        let _Query: string;
        this.normalizeParams();
        const _outStation = '150000';
        const _inStation = '720000';
        const _outCountry = '112';
        const _inCountry = '860';
        const _Velocity = '0';
        const _totalDist = '3699';
        const _belDist = '45';
        const _wagCapacity = this._wagCapacity;
        const _wagType = this.wagTypeRow.nomv4;
        const _wagKs = this.wagKsCode;
        const _Conductors = this._Conductors;
        const _Pivots = this._Pivots;
        const _cargoWeight = '3100';
        const _Gng = '04011090';
        const _Etsng = '552071';
        const _wagOwnership = this.wagOwnershipCode;
        const _contCol = this._contCol;
        const _Foot = this._Foot;
        const _contOwnership = this.contOwnershipCode;
        const _Date = this._Date;
        const _Svo = this.svoCode;
        const _tarifType = this._tarifTypeCode;
        const _contType = this.contTypeCode;
        const _Currency = this._currencyCode;
        const _tara = this._wagTypeListService.Row.tara;
        const _dl = this._wagTypeListService.Row.udl;
        const _session = this._loginService.session;
        _Params.push(`outstation = ${_outStation}`);
        _Params.push(`deststation = ${_inStation}`);
        _Params.push(`outcountry = ${_outCountry}`);
        _Params.push(`destcountry = ${_inCountry}`);
        _Params.push(`velocity = ${_Velocity}`);
        _Params.push(`totaldist = ${_totalDist}`);
        _Params.push(`beldist = ${_belDist}`);
        _Params.push(`wagoncapacity = ${_wagCapacity}`);
        _Params.push(`typewagon = ${_wagType}`);
        _Params.push(`ks = ${_wagKs}`);
        _Params.push(`conductors = ${_Conductors}`);
        _Params.push(`pivots = ${_Pivots}`);
        _Params.push(`cargoweight = ${_cargoWeight}`);
        _Params.push(`gng = ${_Gng}`);
        _Params.push(`etsng = ${_Etsng}`);
        _Params.push(`ownershipwagon = ${_wagOwnership}`);
        _Params.push(`contcol = ${_contCol}`);
        _Params.push(`foot = ${_Foot}`);
        _Params.push(`ownershipcont = ${_contOwnership}`);
        _Params.push(`date = ${_Date}`);
        _Params.push(`svo = ${_Svo}`);
        _Params.push(`tarifftype = ${_tarifType}`)
        _Params.push(`typecont = ${_contType}`);
        _Params.push(`currency = ${_Currency}`);
        _Params.push(`tara = ${_tara}`);
        _Params.push(`wagonlength = ${_dl}`);
        _Params.push(`goods = 0`);
        _Params.push(`UUID = ${_session}`);
        _Query = this._apiService.urlCalc + 'calc?' + _Params.join("&");
        return this._httpService.get(_Query) as Observable<ICalcRepItems>;
    }

}  
