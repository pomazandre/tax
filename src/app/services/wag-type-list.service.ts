import { Injectable } from '@angular/core';
import { IWagType } from '../services/wag-types.service';

@Injectable()
export class WagTypeListService {
  private _Suggestions: IWagType[];
  private _Row: IWagType;
  private _Name: string;

  constructor() {
    this._Name = 'Крытый';
  }

  public get Row(): IWagType {
    return this._Row;
  }

  public set Row(value: IWagType) {
    this._Row = value;
  }

  public get Name(): string {
    return this._Name;
  }

  public set Name(value: string) {
    this._Name = value;
  }

  public get Suggestions(): IWagType[] {
    return this._Suggestions;
  }

  public set Suggestions(value: IWagType[]) {
    this._Suggestions = value;
  }

}
