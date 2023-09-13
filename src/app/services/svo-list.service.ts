import {Injectable} from '@angular/core';
import {SelectItem } from 'primeng/primeng';

@Injectable()
export class SvoListService {
    private _list : SelectItem[];
    private _code : string;
    private _item : SelectItem;

    public get list(): SelectItem[] {
        return this._list;
    }

    public set list(value: SelectItem[]) {
        this._list = value;
    }

    public set item(value: any)
    {
        this._item = value;
    }

    public get item() : any
    {
        return this._item;
    }

    public get code() : string
    {
        return this._code;
    }

    public set code(value: string)
    {
        this._code = value;
    }

    constructor() {
      this._code = '1';
      
    }

}
