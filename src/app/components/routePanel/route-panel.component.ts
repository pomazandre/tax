import { Component, ViewChild } from '@angular/core';
import { RouteService, Station } from '../../services/route.service';
import { VisibleControlsService } from '../../services/visible.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-route',
  templateUrl: './route-panel.component.html',
})

export class RoutePanelComponent {
  private _mdlDisplay: boolean;
  private _displayJoints: boolean;

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

  get mdlStations(): Station[] {
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

  public get Url(): string {
    return this._apiService.urlAssets;
  }

  show() {
    console.log('@RoutePanelComponent @show');
    console.log(this._displayJoints);
    this._mdlDisplay = true;

  }

  hide() {
    this._mdlDisplay = false;
  }

}
