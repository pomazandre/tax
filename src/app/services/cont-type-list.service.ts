import {Injectable} from '@angular/core';
import { IContType } from '../services/cont-types.service';

@Injectable()
export class ContTypeListService {
    private _List : IContType[]; // массив для подцепливания списка станций
    private _Row : IContType;
    private _Name : string;
    private _Code : number;

    constructor() {
    }
  
    public get Row(): IContType {
      return this._Row;
    }
  
    public set Row(value: IContType) {
      this._Row = value;
    }
  
    public get List(): IContType[] {
      return this._List;
    }
  
    public set List(value: IContType[]) {
      this._List = value;
    }
    
    public get Name(): string {
      return this._Name;
    }
  
    public set Name(value: string) {
      this._Name = value;
    }
    
    public get Code(): number {
      return this._Code;
    }
  
    public set Code(value: number) {
      this._Code = value;
    }
  

}
