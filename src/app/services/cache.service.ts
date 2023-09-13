import { Injectable } from '@angular/core';
import * as ForerunnerDB from 'forerunnerdb';
import { Observable } from 'rxjs/Observable';

import { WagTypesService, IWagType } from '../services/wag-types.service';
import { OwnershipService, IOwnership } from '../services/ownership.service';
import { KsService, IKs } from '../services/ks.service';
import { ContTypesService, IContType } from '../services/cont-types.service';
import { SvoService, ISvo } from '../services/svo.service';
import { SpecMarkService, ISpecMark } from '../services/special-mark.service';
import { GngService, IGng } from '../services/gng.service';
import { EtsngService, IEtsng } from '../services/etsng.service';
import { EtsngMasksService, IEtsngMask } from '../services/masks.service';
import { StationService, IStation } from '../services/station.service';
import { CountryService, ICountry, IIdCountry } from '../services/country.service';

import { LogService } from '../services/log.service';

export const enum enumCacheType { Stations, Gngs, Etsngs, Masks, Ownerships, Kss, WagTypes, ContTypes, Svo, SpecialMarks, Countries, idCountries };
export const CacheTypes = [enumCacheType.Stations, enumCacheType.Gngs, enumCacheType.Etsngs, enumCacheType.Masks,
enumCacheType.Ownerships, enumCacheType.Kss, enumCacheType.WagTypes, enumCacheType.ContTypes,
enumCacheType.Svo, enumCacheType.SpecialMarks, enumCacheType.Countries, enumCacheType.idCountries
];
type CacheObservable = Observable<IStation[] | IGng[] | IEtsng[] | IEtsngMask[] | IOwnership[] | IWagType[] | IContType[] | IKs[] | ISvo[] | ICountry[] | IIdCountry[] | ISpecMark[]>;

@Injectable()
export class CacheService {
     private _Db: ForerunnerDB;
     private _Cache: any;

     private _UpdateNsiDate: any;

     private _Stations: any;
     private _Gngs: any;
     private _Etsngs: any;
     private _Masks: any;

     private _Countries: any;
     private _idCountries: any;

     private _Ownerships: any;
     private _Kss: any;
     private _wagTypes: any;

     private _enableCacheNSI: boolean = false;

     /**
      * Getter setDefaultValues
      * @return {boolean}
      */
     public get defaultValues(): boolean {
          return this._defaultValues;
     }

     /**
      * Setter setDefaultValues
      * @param {boolean} value
      */
     public set defaultValues(value: boolean) {
          this._defaultValues = value;
     }

     private _contTypes: any;
     private _Svo: any;

     private _Version: any;

     private _lastServerUpdateNsiDate: string;
     private _lastCacheUpdateNsiDate: string;

     private _defaultValues: boolean;

     private _enabledCacheNSI: boolean;

     constructor(private _wagTypesService: WagTypesService, private _ownershipService: OwnershipService,
          private _ksService: KsService, private _contTypesService: ContTypesService, private _svoService: SvoService,
          private _specialMarkService: SpecMarkService, private _gngService: GngService, private _etsngService: EtsngService,
          private _stationService: StationService, private _countryService: CountryService, private _etsngMasksService: EtsngMasksService,
          private _logService: LogService) {
          this._Db = new ForerunnerDB();
          this._Cache = this._Db.db('cacheWebSapod093');
          this._UpdateNsiDate = this._Cache.collection('update');
          this._Stations = this._Cache.collection('Stations');
          this._Gngs = this._Cache.collection('Gngs');
          this._Etsngs = this._Cache.collection('Etsngs');
          this._Masks = this._Cache.collection('Masks');
          this._Ownerships = this._Cache.collection('Ownerships');
          this._Kss = this._Cache.collection('Kss');
          this._wagTypes = this._Cache.collection('wagonTypes');
          this._contTypes = this._Cache.collection('contTypes');
          this._Svo = this._Cache.collection('Svo');
          this._specialMarks = this._Cache.collection('specialMarks');
          this._idCountries = this._Cache.collection('idCountries');
          this._Countries = this._Cache.collection('Countries');
          this._Version = this._Cache.collection('Version');
          this._defaultValues = true;
     }

     public get Stations(): any {
          return this._Stations;
     }

     public get Gngs(): any {
          return this._Gngs;
     }

     public get Etsngs(): any {
          return this._Etsngs;
     }

     public get Masks(): any {
          return this._Masks;
     }

     public get Version(): any {
          return this._Version;
     }


     public get UpdateNsiDate(): any {
          return this._UpdateNsiDate;
     }

     /**
      * Getter lastServerUpdateNsiDate
      * @return {string}
      */
     public get lastServerUpdateNsiDate(): string {
          return this._lastServerUpdateNsiDate;
     }

     /**
      * Setter lastServerUpdateNsiDate
      * @param {string} value
      */
     public set lastServerUpdateNsiDate(value: string) {
          this._lastServerUpdateNsiDate = value;
     }

     /**
        * Getter lastLocalUpdateNsiDate
        * @return {string}
        */
     public get lastCacheUpdateNsiDate(): string {
          return this._lastCacheUpdateNsiDate;
     }

     /**
      * Setter lastLocalUpdateNsiDate
      * @param {string} value
      */
     public set lastCacheUpdateNsiDate(value: string) {
          this._lastCacheUpdateNsiDate = value;
     }


     /**
      * Getter Ownerships
      * @return {any}
      */
     public get Ownerships(): any {
          return this._Ownerships;
     }

     /**
      * Setter Ownerships
      * @param {any} value
      */
     public set Ownerships(value: any) {
          this._Ownerships = value;
     }

     /**
      * Getter Kss
      * @return {any}
      */
     public get Kss(): any {
          return this._Kss;
     }

     /**
      * Setter Kss
      * @param {any} value
      */
     public set Kss(value: any) {
          this._Kss = value;
     }

     /**
      * Getter wagonTypes
      * @return {any}
      */
     public get wagTypes(): any {
          return this._wagTypes;
     }

     /**
      * Setter wagonTypes
      * @param {any} value
      */
     public set wagTypes(value: any) {
          this._wagTypes = value;
     }

     /**
      * Getter contTypes
      * @return {any}
      */
     public get contTypes(): any {
          return this._contTypes;
     }

     /**
      * Setter contTypes
      * @param {any} value
      */
     public set contTypes(value: any) {
          this._contTypes = value;
     }

     /**
      * Getter Svo
      * @return {any}
      */
     public get Svo(): any {
          return this._Svo;
     }

     /**
      * Setter Svo
      * @param {any} value
      */
     public set Svo(value: any) {
          this._Svo = value;
     }

     /**
      * Getter specialMarks
      * @return {any}
      */
     public get specialMarks(): any {
          return this._specialMarks;
     }

     /**
      * Setter specialMarks
      * @param {any} value
      */
     public set specialMarks(value: any) {
          this._specialMarks = value;
     }
     private _specialMarks: any;

     /**
      * Getter Countries
      * @return {any}
      */
     public get Countries(): any {
          return this._Countries;
     }

     /**
      * Setter Countries
      * @param {any} value
      */
     public set idCountries(value: any) {
          this._idCountries = value;
     }

     /**
      * Getter Countries
      * @return {any}
      */
     public get idCountries(): any {
          return this._idCountries;
     }

     public get enabledCacheNSI() {
          return this._enabledCacheNSI;
     }

     public set enabledCacheNSI(value: boolean) {
          this._enabledCacheNSI = value;
     }


     public isFill(): boolean {
          let respStations: any = this._Stations.find({ 'name': { $ne: '' } });
          let respGngs: any = this._Gngs.find({ 'name': { $ne: '' } });
          let respEtsngs: any = this._Gngs.find({ 'name': { $ne: '' } });
          return (respStations.length > 0 && respGngs.length > 0 && respEtsngs.length > 0);
     }


     public getCache(cacheType: enumCacheType): any {
          let resCache: any;
          switch (cacheType) {
               case enumCacheType.Stations: resCache = this._Stations; break;
               case enumCacheType.Gngs: resCache = this._Gngs; break;
               case enumCacheType.Etsngs: resCache = this._Etsngs; break;
               case enumCacheType.Masks: resCache = this._Masks; break;
               case enumCacheType.Ownerships: resCache = this._Ownerships; break;
               case enumCacheType.Kss: resCache = this._Kss; break;
               case enumCacheType.WagTypes: resCache = this._wagTypes; break;
               case enumCacheType.ContTypes: resCache = this._contTypes; break;
               case enumCacheType.Svo: resCache = this._Svo; break;
               case enumCacheType.SpecialMarks: resCache = this._specialMarks; break;
               case enumCacheType.Countries: resCache = this._Countries; break;
               case enumCacheType.idCountries: resCache = this._idCountries; break;
          }
          return resCache;
     }

     public getLabel(cacheType: enumCacheType): string {
          let Label: string = '';
          switch (cacheType) {
               case enumCacheType.Stations: Label = 'справочника станций'; break;
               case enumCacheType.Gngs: Label = 'справочника ГНГ'; break;
               case enumCacheType.Etsngs: Label = 'справочника ЕТСНГ'; break;
               case enumCacheType.Masks: Label = 'справочника масок ЕТСНГ'; break;
               case enumCacheType.Ownerships: Label = 'справочника принадлежностей'; break;
               case enumCacheType.Kss: Label = 'справочника кодов собственника'; break;
               case enumCacheType.WagTypes: Label = 'справочника типов вагонов'; break;
               case enumCacheType.ContTypes: Label = 'справочника типов контейнеров'; break;
               case enumCacheType.Svo: Label = 'справочника видов отправки'; break;
               case enumCacheType.SpecialMarks: Label = 'справочника специальных отметок'; break;
               case enumCacheType.Countries: Label = 'справочника стран'; break;
               case enumCacheType.idCountries: Label = 'справочника идентификаторов стран';
          }
          return Label;
     }

     getObservable(cacheType: enumCacheType): CacheObservable {
          let resObservable: CacheObservable;
          switch (cacheType) {
               case enumCacheType.Stations: resObservable = this._stationService.get(); break;
               case enumCacheType.Gngs: resObservable = this._gngService.get(); break;
               case enumCacheType.Etsngs: resObservable = this._etsngService.get(); break;
               case enumCacheType.Masks: resObservable = this._etsngMasksService.get(); break;
               case enumCacheType.Ownerships: resObservable = this._ownershipService.get(); break;
               case enumCacheType.Kss: resObservable = this._ksService.get(); break;
               case enumCacheType.WagTypes: resObservable = this._wagTypesService.get(); break;
               case enumCacheType.ContTypes: resObservable = this._contTypesService.get(); break;
               case enumCacheType.Svo: resObservable = this._svoService.get(); break;
               case enumCacheType.SpecialMarks: resObservable = this._specialMarkService.get(); break;
               case enumCacheType.idCountries: resObservable = this._countryService.getIds(); break;
               case enumCacheType.Countries: resObservable = this._countryService.get(); break;
          }
          return resObservable;
     }

}
