import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-paragrafPanel',
  templateUrl: './paragraf.component.html',
})

export class ParagrafPanelComponent {
  private _display: boolean = false;
  private _mdlText: string[] = [];
  private _mdlHeader: string = '';

  constructor(private _apiService: ApiService) {
  }

  public set mdlText(value: string[]) {
    this._mdlText = value;
  }

  public get mdlText(): string[] {
    return this._mdlText;
  }

  public get display(): boolean {
    return this._display;
  }

  public set display(value: boolean) {
    this._display = value;
  }

  public get mdlHeader(): string {
    return this._mdlHeader;
  }

  public set mdlHeader(value: string) {
    this._mdlHeader = value;
  }

  public get Url(): string {
    return this._apiService.urlAssets;
  }

  show() {
    this._display = true;
    
  }

}
