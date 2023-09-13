import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-errorNsi',
  templateUrl: './errorNsi.component.html',
})

export class ErrorNsiDialogComponent {
  private _Display : boolean = false;
  private _mdlText : string = '';
  @Output() public onLoadNsi = new EventEmitter();

  constructor(private _apiService : ApiService) {
  }

  public get Url() : string
  {
   return this._apiService.urlAssets;

  }

  public set mdlText(value: string)
  {
    this._mdlText = value;
  }

  public get mdlText() : string
  {
    return this._mdlText;
  }

  public get Display() : boolean
  {
    return this._Display;
  }

  public set Display(value: boolean)
  {
    this._Display = value;
  }

  show(){
    this._Display = true;
  }

  loadNsi(){
    this._Display = false;
    this.onLoadNsi.emit();
  }

  public get Visible() : boolean
  {
    if (this._apiService.urlAssets !== '') {
      return true;
    } else {
      return false;
    }
  }

}
