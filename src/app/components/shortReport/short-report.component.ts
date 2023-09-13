import { Component } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { Router } from '@angular/router';
import { CalcService } from '../../services/calc.service';
import { CacheService } from '../../services/cache.service';
import { LogService } from '../../services/log.service';
import print from 'print-js';
import { ApiService } from '../../services/api.service';

export interface IShortReportItem {
  Country: string;
  Dist: number;
  Pay: number;
  payView: string;
}

export class ShortReportItem implements IShortReportItem {
  Country: string;
  Dist: number;
  Pay: number;
  payView: string;

  constructor(Country: string, Dist: number, Pay: number) {
    this.Country = Country;
    this.Dist = Dist;
    this.Pay = Pay;
    this.payView = '';
  }
}

@Component({
  selector: 'app-shortrepPanel',
  templateUrl: './short-report.component.html',
})

export class ShortReportComponent {
  private _mdlView: IShortReportItem[];
  private _model: IShortReportItem[];
  private _display: boolean;

  constructor(private _routerService: Router, private _calcService: CalcService,
    private _cacheService: CacheService, private _logService: LogService, private _apiService: ApiService) {
  }

  public get Url(): string {
    return this._apiService.urlAssets;
  }

  public get mdlView(): IShortReportItem[] {
    return this._mdlView;
  }

  public set mdlView(value: IShortReportItem[]) {
    this._mdlView = value;
  }

  public get display(): boolean {
    return this._display;
  }

  public set display(value: boolean) {
    this._display = value;
  }


  public set logInfo(Value: any) {
    this._logService.info = Value;
  }

  public set logDebug(Msg: string) {
    this._logService.debug = Msg;
  }

  public set logDebugValue(Value: any) {
    this._logService.debugValue = Value;
  }

  public get Currency(): string {
    return this._calcService.Currency;
  }

  goBack() {
    this._routerService.navigate(['/params']);
  }

  Show(Event) {
    this._model = [];
    this._calcService.calcRespView.forEach((item: any, index: number) => {
      this.processItem(item.label, item.value, index)
    });
    this.prepareView();
    this._display = true;
  }

  processItem(ReportItemName: string, ReportItemValue: string, index: number) { // на входе строка из набора строк расчета
    let modelItem: ShortReportItem;
    if (ReportItemName !== undefined && ReportItemValue !== undefined) {
      if (ReportItemName.indexOf('Расстояние') >= 0) {
        modelItem = new ShortReportItem(this.getCountry(ReportItemName), this.parseFloat(ReportItemValue), 0);
        this._model.push(modelItem);
      }
      if (ReportItemName === '' && this._model.length > 0) {
        this._model[this._model.length - 1].Pay = this.parseFloat(this._calcService.calcRespView[index - 1].value);
      }
    }
  }

  prepareView() { // суммирование стран в общем случае
    let _Countries: string[] = [];
    let sumPay: number;
    let sumDist: number;
    let sumPayAll: number;
    let sumDistAll: number;
    let viewItem: ShortReportItem;
    this._mdlView = [];

    this._model.forEach(Item => {
      if (_Countries.indexOf(Item.Country) === -1) {
        _Countries.push(Item.Country)
      }
    }
    );

    // собираем расстояния и платы по странам
    sumPayAll = 0;
    sumDistAll = 0;
    _Countries.forEach(Item => {
      sumPay = 0;
      sumDist = 0;
      this._model.forEach(Obj => {
        if (Obj.Country === Item) {
          sumPay = sumPay + Obj.Pay;
          sumDist = sumDist + Obj.Dist;
        }
      }
      )
      viewItem = new ShortReportItem(Item, sumDist, sumPay);
      this._mdlView.push(viewItem);
      //sumPayAll = sumPayAll + sumPay;
      sumDistAll = sumDistAll + sumDist;
    }
    );
    viewItem = new ShortReportItem('ИТОГО', sumDistAll, Number.parseFloat(this._calcService.Pay));
    this._mdlView.push(viewItem);
    this.logDebug = 'чистое вью';
    this.logDebugValue = this._mdlView;

    //this.logDebug = 'замена суммы по РБ...'
    //this._mdlView.forEach(Item => {
    //  if (Item.Country === this._calcService.nativeCountry) {
    //    Item.Pay = this._calcService.payRB;
    //    this.logDebug = 'строка таблицы найдена';
    //    this.logDebug = 'новая сумма = ' + Item.Pay;
    //  }
    //});
    //this.logDebug = 'сумма по РБ заменена'

    let normaWagCapacity: number = Number.parseInt(this._calcService.wagCapacity) * 1000;
    let normaCargoWeight: number = Number.parseInt(this._calcService.cargoWeight);
    if (normaWagCapacity < normaCargoWeight) {
      this.logDebug = 'вес груза больше грузоподъемности вагона';
      let wagCount: number = Math.round(normaCargoWeight / normaWagCapacity);
      if (wagCount * normaWagCapacity < normaCargoWeight) {
        wagCount++;
      }
      this.logDebug = 'число вагонов = ' + wagCount;
      this.logDebug = 'корректируем расстояния таблицы...';
      this._mdlView.forEach(Item => { Item.Dist = Item.Dist / wagCount; });
      this.logDebug = 'коррекция расстояний завершена';
    }
    this.logDebug = 'округление сумм до двух знаков...'
    this._mdlView.forEach(Item => {
      this.logDebug = 'исходная сумма = ' + Item.Pay;
      this.logDebug = 'сумма 2 знака = ' + Item.Pay.toFixed(2);
      Item.payView = Item.Pay.toFixed(2);
      //if (Item.Pay.indexOf('.00') > 0) {
      //  Item.Pay = Item.Pay.substr(0, Item.Pay.length - 3);
      //  this.logDebug = 'сумма нули обрезаны = ' + Item.Pay;
      // }
    }
    );
    this.logDebug = 'округление сумм завершено'
  }

  getCountry(Lexem: string): string {
    let allCountries: any;
    let searchCountry: any;
    let searchCountryName: string = '';
    allCountries = this._cacheService.Countries.find({ 'name': { $ne: '' } });
    searchCountry = allCountries.filter(Item => Lexem.indexOf(Item.name) >= 0);
    if (searchCountry.length > 0 && searchCountry !== undefined) { // страна найдена
      searchCountryName = searchCountry[0].name;
    }
    return searchCountryName;
  }

  handleClose() {
    this._display = false;
  }

  parseFloat(Lexem: string) {
    let _Lexem = Lexem.replace(',', '.');
    return Number.parseFloat(_Lexem);
  }

  handlePrint() {
    let _printProps: any[] = [{ field: 'Country', displayName: 'Страна' },
    { field: 'Dist', displayName: 'Расстояние, км' },
    { field: 'Pay', displayName: 'Плата, BYN' },
    ];
    print({
      printable: this.mdlView, properties: _printProps, type: 'json',
      header: `<span>Сводный расчет платы за перевозку груза</span><br>
       <span style="font-size:16pt;">дата расчета: ${this._calcService.Date}</span>`,
      documentTitle: 'вебСАПОД',
      gridStyle: 'border: 1px solid lightgray; margin-bottom: -1px; text-align : center',
      headerStyle: 'font-weight: 300; text-align : center'

    });
  }

}
