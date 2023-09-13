import { Component, ViewChild } from '@angular/core';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
})

export class ErrorDialogComponent {
  public display : boolean = false;
  private _mdlText : string = '';

  constructor(private _apiService : ApiService) {
  }

  public get Url() : string
  { return this._apiService.urlAssets;
  }

  public set mdlText(value: string)
  {
    this._mdlText = value;
  }

  public get mdlText() : string
  {
    return this._mdlText;
  }

  public get Visible() : boolean
  {
    if (this._apiService.urlAssets !== '') {
      return true;
    } else {
      return false;
    }
  }

  show(){
    this.display = true;
  }

  close(){
    this.display = false;
  }

}
