import { Component, OnInit } from '@angular/core';
import { CalcService, CalcRepItem } from '../../services/calc.service';

import { Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import print from 'print-js';
import { HtmlService } from '../../services/html.service';
import { ApiService } from '../../services/api.service';
import { VisibleControlsService } from '../../services/visible.service';

@Component({
  selector: 'app-fullrep',
  templateUrl: './full-report.component.html'
})

export class FullReportComponent {

  constructor(private _router: Router, private _calcService: CalcService, private _htmlService: HtmlService, 
             private _apiService: ApiService, private _visibleControlsService : VisibleControlsService) {
    this._visibleControlsService.dateDisabled = true;
    this._visibleControlsService.svoDisabled = true;
  }

  public get calcRespView(): CalcRepItem[] {
    return this._calcService.calcRespView;
  }

  public get Url(): string {
    return this._apiService.urlAssets;
  }

  notEmptyItem(label: string): boolean {
    return label !== '';
  }

  isCurrency(label: string): boolean {
    let _label :string = label.toLocaleLowerCase();
    let _isCurrency : boolean = false;
    if (_label.indexOf('курс') >= 0 || _label.indexOf('пересчет') >= 0){
      _isCurrency = true;
    }
    return _isCurrency;
  }


  handleBack() {
    this._router.navigate(['/']);
  }

  handlePrint() {
    let _gridStyle: string = `text-align : left;
                              border-top: 1px solid lightgray;
                              border-bottom: 1px solid lightgray;
                             `;
    let _headerStyle: string = `font-weight: 300;
                                text-align : center; 
                                `;
    let _gridHeaderStyle = `display:none;
                            border : hidden`;
    let _printProps: any[] = [{ field: 'label', displayName: 'параметр' }, { field: 'value', displayName: 'значение' }];
    print({
      printable: this.calcRespView, properties: _printProps, type: 'json', header: `<span>Детальный расчет платы за перевозку груза</span><br>
                                                                                    <span style="font-size:16pt;">дата расчета: ${this._calcService.Date}</span>`,
      documentTitle: 'вебСАПОД', gridStyle: _gridStyle, headerStyle: _headerStyle, gridHeaderStyle: _gridHeaderStyle
    });
  }

  handleSave() {
    this._htmlService.perform(this.calcRespView);
  }

}
