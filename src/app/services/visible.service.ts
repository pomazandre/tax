import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class VisibleControlsService {
  private _subjectSvo: Subject<Object> = new Subject();
  private _countryDisabled: boolean;
  private _etsngDisabled: boolean;
  private _wagTypeDisabled: boolean;
  private _ownershipDisabled: boolean;
  private _ksDisabled: boolean;
  private _svoDisabled: boolean;
  private _dateDisabled: boolean;
  private _specMarkDisabled: boolean;
  private _calcDisabled: boolean;
  private _outCountryDisabled: boolean;
  private _inCountryDisabled: boolean;
  private _visibleTransitPanel: boolean;
  private _btnReportsDisplay: boolean;
  private _btnOutStationParagrafDisabled: boolean;
  private _btnDestStationParagrafDisabled: boolean;
  private _btnReverseStationsDisabled: boolean;
  private _belDistDisplay: boolean;
  private _mdlPivotsFilled : boolean;
  private _mdlKsFilled: string;
  private _mdlConductorsFilled: boolean;
  private _mdlContTypeFilled : string;
  private _mdlContPayloadFilled: boolean;
  private _mdlContColFilled: boolean;
  private _mdlSpecMarksFilled: boolean;
  private _mdlDateFilled: string;
  private _shadowTabContVisible : boolean = false;
  private _shadowTabWagVisible : boolean = false;
  private _tabWagVisible: boolean = false;
  private _tabContVisible: boolean = false;
  private _tabExtendVisible: boolean = false;
  
    /**
     * Getter mdlSpecMarksFilled
     * @return {boolean}

    /**
     * Getter mdlDateFilled
     * @return {boolean}
     */
	public get mdlDateFilled(): string {
		return this._mdlDateFilled;
	}

    /**
     * Setter mdlDateFilled
     * @param {boolean} value
     */
	public set mdlDateFilled(value: string) {
		this._mdlDateFilled = value;
	}
     

	public get mdlSpecMarksFilled(): boolean {
		return this._mdlSpecMarksFilled;
	}

    /**
     * Setter mdlSpecMarksFilled
     * @param {boolean} value
     */
	public set mdlSpecMarksFilled(value: boolean) {
		this._mdlSpecMarksFilled = value;
	}

    /**
     * Getter mdlContPayloadFilled
     * @return {boolean}
     */
	public get mdlContPayloadFilled(): boolean {
		return this._mdlContPayloadFilled;
	}

    /**
     * Setter mdlContPayloadFilled
     * @param {boolean} value
     */

    /**
     * Getter mdlContColFilled
     * @return {boolean}
     */
	public get mdlContColFilled(): boolean {
		return this._mdlContColFilled;
	}

    /**
     * Setter mdlContColFilled
     * @param {boolean} value
     */
	public set mdlContColFilled(value: boolean) {
		this._mdlContColFilled = value;
	}
	public set mdlContPayloadFilled(value: boolean) {
		this._mdlContPayloadFilled = value;
	}

  
    /**
     * Getter mdlContTypeFilled
     * @return {string}
     */
	public get mdlContTypeFilled(): string {
		return this._mdlContTypeFilled;
	}

    /**
     * Setter mdlContTypeFilled
     * @param {string} value
     */
	public set mdlContTypeFilled(value: string) {
		this._mdlContTypeFilled = value;
	}

    /**
     * Getter mdlConductorsFilled
     * @return {boolean}
     */
	public get mdlConductorsFilled(): boolean {
		return this._mdlConductorsFilled;
	}

    /**
     * Setter mdlConductorsFilled
     * @param {boolean} value
     */
	public set mdlConductorsFilled(value: boolean) {
		this._mdlConductorsFilled = value;
	}

    /**
     * Getter mdlKsFilled
     * @return {string}
     */
	public get mdlKsFilled(): string {
		return this._mdlKsFilled;
	}

    /**
     * Setter mdlKsFilled
     * @param {string} value
     */
	public set mdlKsFilled(value: string) {
		this._mdlKsFilled = value;
	}


    /**
     * Getter mdlWagTypeFilled
     * @return {string}
     */
	public get mdlWagTypeFilled(): string {
		return this._mdlWagTypeFilled;
	}

    /**
     * Setter mdlWagTypeFilled
     * @param {string} value
     */
	public set mdlWagTypeFilled(value: string) {
		this._mdlWagTypeFilled = value;
	}
  private _mdlWagTypeFilled : string;

    /**
     * Getter mdlWagCapacityFilled
     * @return {boolean}
     */
	public get mdlWagCapacityFilled(): boolean {
		return this._mdlWagCapacityFilled;
	}

    /**
     * Setter mdlWagCapacityFilled
     * @param {boolean} value
     */
	public set mdlWagCapacityFilled(value: boolean) {
		this._mdlWagCapacityFilled = value;
	}
  private _mdlWagCapacityFilled: boolean;

    /**
     * Getter mdlPivotsFilled
     * @return {boolean}
     */
	public get mdlPivotsFilled(): boolean {
		return this._mdlPivotsFilled;
	}

    /**
     * Setter mdlPivotsFilled
     * @param {boolean} value
     */
	public set mdlPivotsFilled(value: boolean) {
		this._mdlPivotsFilled = value;
	}
  
  public get countryDisabled(): boolean {
    return this._countryDisabled;
  }

  public set countryDisabled(value: boolean) {
    this._countryDisabled = value;
  }

  public get etsngDisabled(): boolean {
    return this._etsngDisabled;
  }

  public set etsngDisabled(value: boolean) {
    this._etsngDisabled = value;
  }

  public get wagTypeDisabled(): boolean {
    return this._wagTypeDisabled;
  }

  public set wagTypeDisabled(value: boolean) {
    this._wagTypeDisabled = value;
  }

  public get ownershipDisabled(): boolean {
    return this._ownershipDisabled;
  }

  public set ownershipDisabled(value: boolean) {
    this._ownershipDisabled = value;
  }

  public set svoDisabled(value: boolean) {
    this._svoDisabled = value;
  }

  public get svoDisabled(): boolean {
    return this._svoDisabled;
  }

  public set ksDisabled(value: boolean) {
    this._ksDisabled = value;
  }

  public get ksDisabled(): boolean {
    return this._ksDisabled;
  }

  public set specMarkDisabled(value: boolean) {
    this._specMarkDisabled = value;
  }

  public get specMarkDisabled(): boolean {
    return this._specMarkDisabled;
  }

  public set calcDisabled(value: boolean) {
    this._calcDisabled = value;
  }

  public get calcDisabled(): boolean {
    return this._calcDisabled;
  }

  public set tabWagVisible(value: boolean) {
    this._tabWagVisible = value;
  }

  public get tabWagVisible(): boolean {
    return this._tabWagVisible;
  }

  set tabContVisible(value: boolean) {
    this._tabContVisible = value;
  }

  get tabContVisible(): boolean {
    return this._tabContVisible;
  }

  public set tabExtendVisible(value: boolean) {
    this._tabExtendVisible = value;
  }

  public get tabExtendVisible(): boolean {
    return this._tabExtendVisible;
  }
    
  set shadowTabContVisible(value: boolean) {
    this._shadowTabContVisible = value;
  }

  get shadowTabContVisible(): boolean {
    return this._shadowTabContVisible;
  }

  set shadowTabWagVisible(value: boolean) {
    this._shadowTabWagVisible = value;
  }

  get shadowTabWagVisible() : boolean {
    return this._shadowTabWagVisible;
  }


  public get outCountryDisabled(): boolean {
    return this._outCountryDisabled;
  }

  public set outCountryDisabled(value: boolean) {
    this._outCountryDisabled = value;
  }

  public get inCountryDisabled(): boolean {
    return this._inCountryDisabled;
  }

  public set inCountryDisabled(value: boolean) {
    this._inCountryDisabled = value;
  }

  public get visibleTransitPanel(): boolean {
    return this._visibleTransitPanel;
  }

  public set visibleTransitPanel(value: boolean) {
    this._visibleTransitPanel = value;
  }

  public get btnReportsDisplay(): boolean {
    return this._btnReportsDisplay;
  }

  public set btnReportsDisplay(value: boolean) {
    this._btnReportsDisplay = value;
  }

  public get btnOutStationParagrafDisabled(): boolean {
    return this._btnOutStationParagrafDisabled;
  }

  public set btnOutStationParagrafDisabled(value: boolean) {
    this._btnOutStationParagrafDisabled = value;
  }

  public get btnDestStationParagrafDisabled(): boolean {
    return this._btnDestStationParagrafDisabled;
  }

  public set btnDestStationParagrafDisabled(value: boolean) {
    this._btnDestStationParagrafDisabled = value;
  }

  public get btnReverseStationsDisabled(): boolean {
    return this._btnReverseStationsDisabled;
  }

  public set btnReverseStationsDisabled(value: boolean) {
    this._btnReverseStationsDisabled = value;
  }

  public get belDistDisplay(): boolean {
    return this._belDistDisplay;
  }

  public set belDistDisplay(value: boolean) {
    this._belDistDisplay = value;
  }

  get subjectSvo() : Subject<Object>{
    return this._subjectSvo;
  }

  get dateDisabled() : boolean{
    return this._dateDisabled;
  }

  set dateDisabled(value : boolean){
    this._dateDisabled = value;
  }
  

}
