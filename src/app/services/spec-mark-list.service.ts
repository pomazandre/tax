import { Injectable } from '@angular/core';
import { CacheService } from '../services/cache.service';
import { LogService } from '../services/log.service';
import { ISpecMark } from '../services/special-mark.service';
import { ValidService } from '../services/valid.service';

@Injectable()
export class SpecMarkListService {
  private _specMarkSuggestions: ISpecMark[];
  private _specMarkAllSuggestions: ISpecMark[];
  private _selectedSpecMarks: any[];
  private _specMarkChips: string = '';
  private _masks: number[] = [];
  private _allMasks: any = [
    { id: 1, label: 'БЧ' },
    { id: 2, label: 'УТИ' },
    { id: 4, label: 'ТП СНГ' },
    { id: 8, label: 'все тарифы' },
    { id: 16, label: 'РЖД' },
    { id: 32, label: 'расчетные' },
    { id: 64, label: 'груженые вагоны' },
    { id: 128, label: 'порожние вагоны' },
    { id: 256, label: 'повагонная отправка' },
    { id: 512, label: 'контейнерная отправка' },
  ];


  constructor(private _cacheService: CacheService, private _logService: LogService, private _validService: ValidService) {
    this._specMarkSuggestions = [];
    this._specMarkAllSuggestions = [];
    this._selectedSpecMarks = [];
  }

  public set logDebug(Msg: string) {
    this._logService.debug = Msg;
  }

  public set logDebugValue(Value: any) {
    this._logService.debugValue = Value;
  }


  public get specMarkSuggestions(): ISpecMark[] {
    return this._specMarkSuggestions;
  }

  public set specMarkSuggestions(value: ISpecMark[]) {
    this._specMarkSuggestions = value;
  }

  public get specMarkAllSuggestions(): ISpecMark[] {
    return this._specMarkAllSuggestions;
  }

  public set specMarkAllSuggestions(value: ISpecMark[]) {
    this._specMarkAllSuggestions = value;
  }

  public get selectedSpecMarks(): any[] {
    return this._selectedSpecMarks;
  }

  public set selectedSpecMarks(value: any[]) {
    this._selectedSpecMarks = value;
  }

  public get cacheSpecialMarks(): any {
    return this._cacheService.specialMarks;
  }

  public get specMarkChips(): string {
    return this._specMarkChips;
  }

  public set specMarkChips(value: string) {
    this._specMarkChips = value;
  }

  public setDefValue() {
    let resp: any = this.cacheSpecialMarks.find({ 'kod': { $eq: 58 } });
    this._selectedSpecMarks.push(resp[0]);
  }

  checkMark(codeMark: number, svoCode: string): boolean {
    let flag_: boolean = true;
    this._masks.forEach(mask => {
      flag_ = (mask & codeMark) !== 0;
    })
    if ((svoCode === '1' || svoCode === '2') && codeMark === 40) {
      flag_ = true;
    }
    return flag_;
  }


  formSpecMarkSuggestions(outCountryCode: string, inCountryCode: string, svoCode: string, etsngCode: string) {
    console.clear();
    this.logDebug = ' @formSpecMarkSuggestions';
    this._masks = [];

    // отправление 
    // СНГ = STATE_TARIFF_BCH.getState() | STATE_TARIFF_ALL.getState() | STATE_TARIFF_TP_SNG.getState() проверяется на неравенство 0, если 0 то отметка не вкл
    // иначе 
    // STATE_TARIFF_BCH.getState() | STATE_TARIFF_ALL.getState())
    // прибытие 
    // STATE_TARIFF_BCH.getState() |  STATE_TARIFF_ALL.getState()



    //Если вид работы = 10 (п/а) и вид док = СМГС или ЦИМ-СМГС , 
    //то Тариф БЧ (1) ,  все тарифы (8),  тариф ТП СНГ (4)
    // иначе:   Тариф БЧ (1) ,  все тарифы (8)
    if (outCountryCode !== '112' || inCountryCode !== '112') {// Если вид работы = 10 (п/а) и вид док = СМГС или ЦИМ-СМГС , 
      this._masks.push(this._allMasks[0].id | this._allMasks[3].id | this._allMasks[2].id);
    } else {
      this._masks.push(this._allMasks[0].id | this._allMasks[3].id);
    }

    switch (svoCode) {
      case '1':
      case '2':
        this._masks.push(this._allMasks[8].id); //   { id: 256, label: 'повагонная отправка' }

        if ((etsngCode.substr(0, 3) === '421' || etsngCode.substr(0, 3) === '422' || etsngCode.substr(0, 3) === '423') && etsngCode !== '421091') {
          this._masks.push(this._allMasks[7].id);;// { id: 128, label: 'порожние вагоны' }
        } else {
          this._masks.push(this._allMasks[6].id); // { id: 64, label: 'груженые вагоны' }
        }

        break;
      case '5':
      case '6':
        this._masks.push(this._allMasks[9].id);;// { id: 512, label: 'контейнерная отправка' }
        break;
    }

    this.logDebug = '--- выбранные маски ---';
    this.logDebugValue = this._masks;
    this._specMarkSuggestions = [];
    this._specMarkChips = '';
    this.logDebug = '------ отметки --------';
    this.specMarkAllSuggestions.forEach(mark => { // проход по всем значениям
      this.logDebug = 'отметка = ' + mark.name;
      this.logDebug = 'признак pr = ' + mark.pr;
      if (!this.checkMark(mark.pr, svoCode)) {
        this.logDebug = '= не добавляем отметку = ';
      } else {
        this.logDebug = '= добавляем отметку = ';
        this.specMarkSuggestions.push(mark);
      }
    });
    this.sort();
  }

  sort(){
    let firstItem : ISpecMark;
    this.logDebug = 'сортировка значений...';
    this.logDebug = this._specMarkSuggestions[0].name.substring(0,1);
    while (this._validService.isNumber(this._specMarkSuggestions[0].name.substring(0,1))) {
      firstItem = this._specMarkSuggestions.shift();
      this._specMarkSuggestions.push(firstItem);
    }
  }

}
