import {Injectable} from '@angular/core';
import {IKs} from '../services/ks.service';

@Injectable()
export class KsListService {
    private _List : IKs[]; // массив для подцепливания списка станций
    private _Row : IKs;
    private _Name : string;
    private _Code : string;

    constructor() {
    }

    public get Row(): IKs {
        return this._Row;
    }

    public set Row(value: IKs) {
        this._Row = value;
    }

    public get List(): IKs[] {
        return this._List;
    }

    public set List(value: IKs[]) {
        this._List = value;
    }

    public get Name(): string {
        return this._Name;
    }

    public set Name(value: string) {
        this._Name = value;
    }

    public get Code(): string {
        return this._Code;
    }

    public set Code(value: string) {
        this._Code = value;
    }

}
