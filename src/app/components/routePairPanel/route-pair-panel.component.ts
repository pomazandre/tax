import { Component, ViewChild } from '@angular/core';
import { RouteService, Station } from '../../services/route.service';
import { VisibleControlsService } from '../../services/visible.service';
import { ApiService } from '../../services/api.service';

class RoutePair{
  country: string;
  station1: string;
  station2: string;
  dist: string;
}

@Component({
  selector: 'app-route-pair',
  templateUrl: './route-pair-panel.component.html',
})

export class RoutePairPanelComponent {
  private _mdlDisplay: boolean;
  private _displayJoints: boolean;
  private _routePairs: RoutePair[];

  constructor(private _routeService: RouteService, private _visibleControlsService: VisibleControlsService, 
             private _apiService: ApiService) {
  }

  get mdlDisplay(): boolean {
    return this._mdlDisplay;
  }

  set mdlDisplay(value: boolean) {
    this._mdlDisplay = value;
  }


  get mdlOutJointCode(): string {
    return this._routeService.route.outJointCode;
  }

  set mdlOutJointCode(value: string) {
  }

  get mdlOutJoint(): string {
    return this._routeService.route.outJoint;
  }

  set mdlOutJoint(value: string) {
  }

  get mdlInJoint(): string {
    return this._routeService.route.inJoint;
  }

  set mdlInJoint(value: string) {
  }

  get mdlInJointCode(): string {
    return this._routeService.route.inJointCode;
  }

  set mdlInJointCode(value: string) {
  }

  get mdlBelDist(): string {
    return this._routeService.route.belDist;
  }

  set mdlBelDist(value: string) {
  }

  get mdlTotalDist(): string {
    return this._routeService.route.totalDist;
  }

  set mdlTotalDist(value: string) {
  }

  get mdlRouteStationsStations(): Station[] {
    return this._routeService.route.stations;
  }

  get error(): string {
    return this._routeService.route.error;
  }

  get displayJoints(): boolean {
    if (this._visibleControlsService.visibleTransitPanel) {
      this._displayJoints = false;
    }
    return this._displayJoints;
  }

  set displayJoints(value: boolean) {
    this._displayJoints = value;
  }

  get mdlRoutePairs() {
    return this._routePairs;
  }

  public get Url(): string {
    return this._apiService.urlAssets;
  }

  show() {
    console.log('@RoutePanelComponent @show');
    this.formPairStations();
    this._mdlDisplay = true;
  }

  hide() {
    this._mdlDisplay = false;
  }

  formPairStations(){
     let _stations = this._routeService.route.stations;
     let _index : number = 0;
     this._routePairs = [];
     let routePair : RoutePair; 
     for (_index = 0; _index + 1 <= _stations.length ; _index = _index + 2 ){
      routePair = new RoutePair();
      console.log(_stations[_index]);  
      routePair.country = _stations[_index].country;
      routePair.station1 = _stations[_index].name;
      routePair.station2 = _stations[_index + 1].name;
      routePair.dist = String(Number.parseInt(_stations[_index + 1].dist) - Number.parseInt(_stations[_index].dist));
      this._routePairs.push(routePair);
     }


  }

}
