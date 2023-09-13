import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ApiService } from './api.service';
import { SelectItem } from 'primeng/components/common/selectitem';

export interface IOwnership {
    id: number;
    kod: number;
    name: string;
}

@Injectable()
export class OwnershipListService {
    private _List: SelectItem[];
    private _wagOwnershipItem: SelectItem;
    private _wagOwnershipCode: number = 1;
    private _contOwnershipItem: any;
    private _contOwnershipCode: number = 1;

    public get List(): SelectItem[] {
        return this._List;
    }

    public set List(value: SelectItem[]) {
        this._List = value;
    }

    public get wagOwnershipItem(): any {
        return this._wagOwnershipItem;
    }

    public set wagOwnershipItem(value: any) {
        this._wagOwnershipItem = value;
    }

    public set contOwnershipItem(value: SelectItem) {
        this._contOwnershipItem = value;
    }

    public get contOwnershipItem(): SelectItem {
        return this._contOwnershipItem;
    }

    public get wagOwnershipCode(): number {
        return this._wagOwnershipCode;
    }

    public set wagOwnershipCode(value: number) {
        this._wagOwnershipCode = value;
    }

    public set contOwnershipCode(value: number) {
        this._contOwnershipCode = value;
    }

    public get contOwnershipCode(): number {
        return this._contOwnershipCode;
    }

    constructor() {
    }

}
