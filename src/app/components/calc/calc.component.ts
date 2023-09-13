import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer, 
         ChangeDetectionStrategy, ChangeDetectorRef, ViewRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SelectItem } from 'primeng/components/common/selectitem';
import { AutoComplete } from 'primeng/components/autocomplete/autocomplete';
import { Dropdown } from 'primeng/components/dropdown/dropdown';
import { ApiService, QUERY_STATUS } from '../../services/api.service';
import { RouteService, IRoute, RouteCalcParams, RouteType } from '../../services/route.service';
import { CalcService, ICalcRepItems } from '../../services/calc.service';
import { ValidService } from '../../services/valid.service';
import { KeyService } from '../../services/key.service';
import { HintService } from '../../services/hint.service';
import { LogService } from '../../services/log.service';
import { CacheService } from '../../services/cache.service';
import { LoginService } from '../../services/login.service';
import { StationType } from '../../services/station.service';
import { IWagType } from '../../services/wag-types.service';
import { OwnershipListService } from '../../services/ownership-list.service';
import { SvoListService } from '../../services/svo-list.service';
import { WagTypeListService } from '../../services/wag-type-list.service';
import { ContTypeListService } from '../../services/cont-type-list.service';
import { SpecMarkListService } from '../../services/spec-mark-list.service';
import { ISpecMark } from '../../services/special-mark.service';
import { KsListService } from '../../services/ks-list.service';
import { VisibleControlsService } from '../../services/visible.service';
import { ProgressDialogComponent } from '../progress/progress.component';
import { ErrorDialogComponent } from '../error/error.component';
import { RoutePanelComponent } from '../routePanel/route-panel.component';
import { RoutePairPanelComponent } from '../routePairPanel/route-pair-panel.component';
import { TestPanelComponent } from '../testPanel/test-panel.component';
import { ShortReportComponent } from '../shortReport/short-report.component';
import { HintPanel } from '../hint/hint.panel.component';
import { ParagrafPanelComponent } from '../paragraf/paragraf.component';
import { environment } from '../../../environments/environment.prod';
import * as cookies from 'js-cookie';

@Component({
  selector: 'app-calc',
  templateUrl: 'calc.component.html',
  styleUrls: ['calc.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CalcComponent implements OnInit, OnDestroy {
  ticks: number = 0;

  //------------------- фиксированные списки --------------------
  private _mdlVelocities: SelectItem[] = [
    { label: 'Грузовая', value: { id: 0, name: '', code: '' } },
    { label: 'Большая', value: { id: 1, name: '', code: '' } },
    { label: 'Пассажирская', value: { id: 2, name: '', code: '' } }
  ];

  private _mdlTarifTypes: SelectItem[] = [
    { label: 'Март №8', value: { id: 15, name: 'МЭ РБ №26', code: '' } },
    { label: '10-01 РЖД', value: { id: 1, name: '', code: '' } },
    { label: 'ТП СНГ', value: { id: 4, name: '', code: '' } }
  ];

  private _mdlFootItems: SelectItem[] = [
    { label: '', value: { id: 1, name: '', code: '0' } },
    { label: '10', value: { id: 2, name: '', code: '10' } },
    { label: '20', value: { id: 3, name: '', code: '20' } },
    { label: '30', value: { id: 4, name: '', code: '30' } },
    { label: '40', value: { id: 5, name: '', code: '40' } },
    { label: '45', value: { id: 6, name: '', code: '45' } }
  ];

  private _mdlCurrencyItems: SelectItem[] = [{ label: 'белорусский рубль (BYN)', value: { id: 933, name: 'BYN', code: '' } },
  { label: 'доллар США (USD)', value: { id: 840, name: 'USD', code: '' } },
  { label: 'швейцарский франк (CHF)', value: { id: 756, name: 'CHF', code: '' } }
  ];

  //------ параметры расчета ----------
  private _mdlGng: string = '';
  private _mdlGngCode: string = '';
  private _shadowEtsngCode: string = '';
  private _mdlEtsngCode: string = '';
  private _mdlEtsng: string = '';
  private _mdlCargoWeight: string = '0';
  private _mdlWagCapacity: string = '68'; // г/п вагона
  private _mdlConductors: string = '0';
  private _mdlPivots: string = '0';
  private _mdlContCol: string = '0';
  private _mdlFootItem: any;
  private _mdlFoot: string = '';
  private _mdlContPayload: string = '0';
  private _mdlVelocity: any;
  private _mdlVelocityIndex: number = 0;

  // исходная станция и страна
  private _mdlOutStationCode: string = '';
  private _mdlOutStation: string = '';
  private _mdlOutCountryCode: string = '';
  private _mdlOutCountry: string = '';

  // станция и страна назначения
  private _mdlDestStationCode: string = '';
  private _mdlDestStation: string = '';
  private _mdlDestCountryCode: string = '';
  private _mdlDestCountry: string = '';

  private _mdlPay: string;  // плата

  //------ видимость контролей -------
  private _etsngDisabled: boolean;
  private _prevCargoDisabled: boolean;
  private _ownershipDisabled: boolean;
  private _ksDisabled: boolean;
  private _wagTypeDisabled: boolean;
  private _svoDisabled: boolean;
  private _specMarkDisabled: boolean = false;
  private _calcDisabled: boolean;
  private _outStationDisabled: boolean;
  private _inStationDisabled: boolean;
  private _gngDisabled: boolean;
  private _footDisabled: boolean;
  private _btnReportsDisplay: boolean = false;
  private _btnRouteDisplay: boolean = false;
  private _btnPairRouteDisplay: boolean = false;
  private _tabExtendVisible: boolean = false;
  private _shadowTabExtendVisible: boolean = false;
  private _mdlBlockUI: boolean = false;
  private _mdlWagTypeReadOnly: boolean = false;
  private _belDistDisplay: boolean = false;
  private _btnOutStationParagrafDisabled: boolean = true;
  private _btnDestStationParagrafDisabled: boolean = true;
  private _btnReverseStationsDisabled = true;

  //------------- динамический поиск -----------------
  private _stationSuggestions: string[];
  private _countrySuggestions: string[];
  private _gngSuggestions: string[];
  private _etsngSuggestions: string[];
  private _ksSuggestions: string[];
  private _contTypeSuggestions: string[];
  private _mdlWagTypeTableSuggestions: IWagType[];
  private _mdlWagTypeSuggestions: string[];
  private _mdlWagTypePanelDisplay: boolean;
  private _mdlSpecMarkPanelDisplay: boolean;

  //-------------  тестирование ----------------
  private _curTest: number;
  private _performedTest: number;
  private _performedSession: number;
  private _startMoment: number;
  private _finishMoment: number;
  private _startMomentTest: number;
  private _finishMomentTest: number;

  //-----------------   DOM ------------------------------------
  @ViewChild("gng") private _gngRef: AutoComplete;
  @ViewChild("etsng") private _etsngRef: AutoComplete;
  @ViewChild("outStation") private _outStationRef: AutoComplete;
  @ViewChild("destStation") private _inStationRef: AutoComplete;
  @ViewChild("ks") private _ksRef: AutoComplete;;
  @ViewChild("contType") private _contTypeRef: AutoComplete;;
  @ViewChild("specialMarks") private _specialMarkRef: ElementRef;
  private _hintRefs: Map<string, any>;
  @ViewChild(RoutePanelComponent) private _routeComponent: RoutePanelComponent;
  @ViewChild(RoutePairPanelComponent) private _routePairComponent: RoutePairPanelComponent;
  @ViewChild(TestPanelComponent) private _testPanel: TestPanelComponent;
  @ViewChild(ShortReportComponent) private _shortrepPanel: ShortReportComponent;
  @ViewChild('wagType') private _wagTypeRef: AutoComplete;
  @ViewChild(ParagrafPanelComponent) private _paragrafPanelComponent: ParagrafPanelComponent;
  @ViewChild('wagOwnership') private _wagOwnershipRef: Dropdown;
  @ViewChild('contOwnership') private _contOwnershipRef: Dropdown;
  @ViewChild('foot') private _footRef: Dropdown;
  @ViewChild('svo') private _svo: Dropdown;
  @ViewChild('currency') private _currency: Dropdown;
  @ViewChild('velocity') private _velocity: Dropdown;
  private _isContTabHighlight : boolean;
    
  private _mdlHintEtsng: string;
  private _BufferMasks: any;

  //--- панели ввода данных -----
  private _headerWagTab: string;
  private _headerExtendTab: string;
  
  private _mdlOutCountryDisabled: boolean;
  private _mdlDestCountryDisabled: boolean;

  //--------  транзит  ----------------
  private _mdlFormPlanWagons: number;
  public formPlanWagons: any[] = [{ label: 'вагон', value: 0 },
  { label: 'контейнер', value: 1 }
  ];
  private _mdlReceptionJoint: string;
  private _mdlReceptionJointCode: string;
  private _mdlSurrenderJoint: string;
  private _mdlSurrenderJointCode: string;
  private _destStationIsJoint: boolean;
  private _outStationIsJoint: boolean;

  @ViewChild(HintPanel) private _hintPanel: HintPanel;

  // смена фона при заполненности полей ввода
  private _mdlOutStationFilled : string;
  private _mdlOutStationCodeFilled : boolean; //  также и для страны
  private _mdlDestStationFilled : string;
  private _mdlDestStationCodeFilled : boolean;
  private _mdlGngFilled: string; 
  private _mdlGngCodeFilled: boolean; 
  private _mdlEtsngFilled: string;
  private _mdlEtsngCodeFilled: boolean;
  private _mdlWeightCargoFilled : boolean;
  private _mdlPayFilled: string;
  private _mdlWagTypeFilled : string;
  private _mdlWagCapacityFilled: boolean;
  private _mdlPivotsFilled : boolean;
  private _mdlKsFilled: string;
  private _mdlWagOwnershipFilled: boolean;
  private _mdlConductorsFilled: boolean;
  private _mdlContTypeFilled : string;
  private _mdlContPayloadFilled: boolean;
  private _mdlContColFilled: boolean;
  private _mdlSpecMarksFilled: boolean;
  private _mdlReceptionJointFilled: string;
  private _mdlSurrenderJointFilled: string;

  private _routeSubscription: Subscription;
  private _taxSubscription: Subscription;
  private _svoSubscription: Subscription;
  
    /**
     * Getter shadowEtsngCode
     * @return {string }
     */
	public get shadowEtsngCode(): string  {
		return this._shadowEtsngCode;
	}

    /**
     * Getter mdlVelocityIndex
     * @return {number }
     */
	public get mdlVelocityIndex(): number  {
		return this._mdlVelocityIndex;
	}

    /**
     * Getter shadowTabExtendVisible
     * @return {boolean }
     */
	public get shadowTabExtendVisible(): boolean  {
		return this._shadowTabExtendVisible;
	}

    /**
     * Getter curTest
     * @return {number}
     */
	public get curTest(): number {
		return this._curTest;
	}

    /**
     * Getter performedTest
     * @return {number}
     */
	public get performedTest(): number {
		return this._performedTest;
	}

    /**
     * Getter performedSession
     * @return {number}
     */
	public get performedSession(): number {
		return this._performedSession;
	}

    /**
     * Getter startMoment
     * @return {number}
     */
	public get startMoment(): number {
		return this._startMoment;
	}

    /**
     * Getter finishMoment
     * @return {number}
     */
	public get finishMoment(): number {
		return this._finishMoment;
	}

    /**
     * Getter startMomentTest
     * @return {number}
     */
	public get startMomentTest(): number {
		return this._startMomentTest;
	}

    /**
     * Getter finishMomentTest
     * @return {number}
     */
	public get finishMomentTest(): number {
		return this._finishMomentTest;
	}

    /**
     * Getter gngRef
     * @return {AutoComplete}
     */
	public get gngRef(): AutoComplete {
		return this._gngRef;
	}

    /**
     * Getter etsngRef
     * @return {AutoComplete}
     */
	public get etsngRef(): AutoComplete {
		return this._etsngRef;
	}

    /**
     * Getter outStationRef
     * @return {AutoComplete}
     */
	public get outStationRef(): AutoComplete {
		return this._outStationRef;
	}

    /**
     * Getter inStationRef
     * @return {AutoComplete}
     */
	public get inStationRef(): AutoComplete {
		return this._inStationRef;
	}

    /**
     * Getter ksRef
     * @return {AutoComplete}
     */
	public get ksRef(): AutoComplete {
		return this._ksRef;
	}

    /**
     * Getter contTypeRef
     * @return {AutoComplete}
     */
	public get contTypeRef(): AutoComplete {
		return this._contTypeRef;
	}

    /**
     * Getter specialMarkRef
     * @return {ElementRef}
     */
	public get specialMarkRef(): ElementRef {
		return this._specialMarkRef;
	}

    /**
     * Getter hintRefs
     * @return {Map<string, any>}
     */
	public get hintRefs(): Map<string, any> {
		return this._hintRefs;
	}

    /**
     * Getter routeComponent
     * @return {RoutePanelComponent}
     */
	public get routeComponent(): RoutePanelComponent {
		return this._routeComponent;
	}

    /**
     * Getter routePairComponent
     * @return {RoutePairPanelComponent}
     */
	public get routePairComponent(): RoutePairPanelComponent {
		return this._routePairComponent;
	}

    /**
     * Getter testPanel
     * @return {TestPanelComponent}
     */
	public get testPanel(): TestPanelComponent {
		return this._testPanel;
	}

    /**
     * Getter shortrepPanel
     * @return {ShortReportComponent}
     */
	public get shortrepPanel(): ShortReportComponent {
		return this._shortrepPanel;
	}

    /**
     * Getter wagTypeRef
     * @return {AutoComplete}
     */
	public get wagTypeRef(): AutoComplete {
		return this._wagTypeRef;
	}

    /**
     * Getter paragrafPanelComponent
     * @return {ParagrafPanelComponent}
     */
	public get paragrafPanelComponent(): ParagrafPanelComponent {
		return this._paragrafPanelComponent;
	}

    /**
     * Getter BufferMasks
     * @return {any}
     */
	public get BufferMasks(): any {
		return this._BufferMasks;
	}

    /**
     * Getter mdlReceptionJointTransitCode
     * @return {string}
     */
	public get mdlReceptionJointCode(): string {
		return this._mdlReceptionJointCode;
	}

    /**
     * Getter mdlSurrenderJointTransitCode
     * @return {string}
     */
	public get mdlSurrenderJointCode(): string {
		return this._mdlSurrenderJointCode;
	}

    /**
     * Getter destStationIsJoint
     * @return {boolean}
     */
	public get destStationIsJoint(): boolean {
		return this._destStationIsJoint;
	}

    /**
     * Getter outStationIsJoint
     * @return {boolean}
     */
	public get outStationIsJoint(): boolean {
		return this._outStationIsJoint;
	}

    /**
     * Getter hintPanel
     * @return {HintPanel}
     */
	public get hintPanel(): HintPanel {
		return this._hintPanel;
	}
  
    /**
     * Getter mdlWagTypeFilled
     * @return {string}
     */
	public get mdlWagTypeFilled(): string {
		return this._mdlWagTypeFilled;
	}

    /**
     * Getter mdlWagCapacityFilled
     * @return {boolean}
     */
	public get mdlWagCapacityFilled(): boolean {
		return this._mdlWagCapacityFilled;
	}

    /**
     * Getter mdlPivotsFilled
     * @return {boolean}
     */
	public get mdlPivotsFilled(): boolean {
		return this._mdlPivotsFilled;
	}

    /**
     * Getter mdlKsFilled
     * @return {string}
     */
	public get mdlKsFilled(): string {
		return this._mdlKsFilled;
	}

    /**
     * Getter mdlConductorsFilled
     * @return {boolean}
     */
	public get mdlConductorsFilled(): boolean {
		return this._mdlConductorsFilled;
	}

    /**
     * Getter mdlContTypeFilled
     * @return {string}
     */
	public get mdlContTypeFilled(): string {
		return this._mdlContTypeFilled;
	}

    /**
     * Getter mdlContPayloadFilled
     * @return {boolean}
     */
	public get mdlContPayloadFilled(): boolean {
		return this._mdlContPayloadFilled;
	}

    /**
     * Getter mdlContColFilled
     * @return {boolean}
     */
	public get mdlContColFilled(): boolean {
		return this._mdlContColFilled;
	}

    /**
     * Getter mdlSpecMarksFilled
     * @return {boolean}
     */
	public get mdlSpecMarksFilled(): boolean {
		return this._mdlSpecMarksFilled;
	}

    /**
     * Getter progressDialog
     * @return {ProgressDialogComponent}
     */
	public get progressDialog(): ProgressDialogComponent {
		return this._progressDialog;
	}

    /**
     * Getter errorDialog
     * @return {ErrorDialogComponent}
     */
	public get errorDialog(): ErrorDialogComponent {
		return this._errorDialog;
	}

    /**
     * Setter mdlVelocities
     * @param {SelectItem[] } value
     */
	public set mdlVelocities(value: SelectItem[] ) {
		this._mdlVelocities = value;
	}

    /**
     * Setter mdlCurrencyItems
     * @param {SelectItem[] } value
     */
	public set mdlCurrencyItems(value: SelectItem[] ) {
		this._mdlCurrencyItems = value;
	}

    /**
     * Setter shadowEtsngCode
     * @param {string } value
     */
	public set shadowEtsngCode(value: string ) {
		this._shadowEtsngCode = value;
	}

    /**
     * Setter mdlVelocityIndex
     * @param {number } value
     */
	public set mdlVelocityIndex(value: number ) {
		this._mdlVelocityIndex = value;
	}


    /**
     * Setter etsngDisabled
     * @param {boolean} value
     */
	public set etsngDisabled(value: boolean) {
		this._etsngDisabled = value;
	}

    /**
     * Setter ownershipDisabled
     * @param {boolean} value
     */
	public set ownershipDisabled(value: boolean) {
		this._ownershipDisabled = value;
	}

    /**
     * Setter ksDisabled
     * @param {boolean} value
     */
	public set ksDisabled(value: boolean) {
		this._ksDisabled = value;
	}

    /**
     * Setter wagTypeDisabled
     * @param {boolean} value
     */
	public set wagTypeDisabled(value: boolean) {
		this._wagTypeDisabled = value;
	}

    /**
     * Setter svoDisabled
     * @param {boolean} value
     */
	public set svoDisabled(value: boolean) {
		this._svoDisabled = value;
	}

    /**
     * Setter specMarkDisabled
     * @param {boolean } value
     */
	public set specMarkDisabled(value: boolean ) {
		this._specMarkDisabled = value;
	}

    /**
     * Setter calcDisabled
     * @param {boolean} value
     */
	public set calcDisabled(value: boolean) {
		this._calcDisabled = value;
	}

    /**
     * Setter outStationDisabled
     * @param {boolean} value
     */
	public set outStationDisabled(value: boolean) {
		this._outStationDisabled = value;
	}

    /**
     * Setter inStationDisabled
     * @param {boolean} value
     */
	public set inStationDisabled(value: boolean) {
		this._inStationDisabled = value;
	}

    /**
     * Setter gngDisabled
     * @param {boolean} value
     */
	public set gngDisabled(value: boolean) {
		this._gngDisabled = value;
	}

    /**
     * Setter btnReportsDisplay
     * @param {boolean } value
     */
	public set btnReportsDisplay(value: boolean ) {
		this._btnReportsDisplay = value;
	}

    /**
     * Setter btnRouteDisplay
     * @param {boolean } value
     */
	public set btnRouteDisplay(value: boolean ) {
		this._btnRouteDisplay = value;
  }
  
    /**
     * Setter btnRouteDisplay
     * @param {boolean } value
     */
	public set btnPairRouteDisplay(value: boolean ) {
		this._btnPairRouteDisplay = value;
  }
  
    
    /**
     * Setter shadowTabExtendVisible
     * @param {boolean } value
     */
	public set shadowTabExtendVisible(value: boolean ) {
		this._shadowTabExtendVisible = value;
	}

    /**
     * Setter mdlBlockUI
     * @param {boolean } value
     */
	public set mdlBlockUI(value: boolean ) {
		this._mdlBlockUI = value;
	}

    /**
     * Setter mdlWagTypeReadOnly
     * @param {boolean } value
     */
	public set mdlWagTypeReadOnly(value: boolean ) {
		this._mdlWagTypeReadOnly = value;
	}

    /**
     * Setter belDistDisplay
     * @param {boolean } value
     */
	public set belDistDisplay(value: boolean ) {
		this._belDistDisplay = value;
	}

    /**
     * Setter btnOutStationParagrafDisabled
     * @param {boolean } value
     */
	public set btnOutStationParagrafDisabled(value: boolean ) {
		this._btnOutStationParagrafDisabled = value;
	}

    /**
     * Setter btnDestStationParagrafDisabled
     * @param {boolean } value
     */
	public set btnDestStationParagrafDisabled(value: boolean ) {
		this._btnDestStationParagrafDisabled = value;
	}

    /**
     * Setter curTest
     * @param {number} value
     */
	public set curTest(value: number) {
		this._curTest = value;
	}

    /**
     * Setter performedTest
     * @param {number} value
     */
	public set performedTest(value: number) {
		this._performedTest = value;
	}

    /**
     * Setter performedSession
     * @param {number} value
     */
	public set performedSession(value: number) {
		this._performedSession = value;
	}

    /**
     * Setter startMoment
     * @param {number} value
     */
	public set startMoment(value: number) {
		this._startMoment = value;
	}

    /**
     * Setter finishMoment
     * @param {number} value
     */
	public set finishMoment(value: number) {
		this._finishMoment = value;
	}

    /**
     * Setter startMomentTest
     * @param {number} value
     */
	public set startMomentTest(value: number) {
		this._startMomentTest = value;
	}

    /**
     * Setter finishMomentTest
     * @param {number} value
     */
	public set finishMomentTest(value: number) {
		this._finishMomentTest = value;
	}

    /**
     * Setter gngRef
     * @param {AutoComplete} value
     */
	public set gngRef(value: AutoComplete) {
		this._gngRef = value;
	}

    /**
     * Setter etsngRef
     * @param {AutoComplete} value
     */
	public set etsngRef(value: AutoComplete) {
		this._etsngRef = value;
	}

    /**
     * Setter outStationRef
     * @param {AutoComplete} value
     */
	public set outStationRef(value: AutoComplete) {
		this._outStationRef = value;
	}

    /**
     * Setter inStationRef
     * @param {AutoComplete} value
     */
	public set inStationRef(value: AutoComplete) {
		this._inStationRef = value;
	}

    /**
     * Setter ksRef
     * @param {AutoComplete} value
     */
	public set ksRef(value: AutoComplete) {
		this._ksRef = value;
	}

    /**
     * Setter contTypeRef
     * @param {AutoComplete} value
     */
	public set contTypeRef(value: AutoComplete) {
		this._contTypeRef = value;
	}

    /**
     * Setter specialMarkRef
     * @param {ElementRef} value
     */
	public set specialMarkRef(value: ElementRef) {
		this._specialMarkRef = value;
	}

    /**
     * Setter hintRefs
     * @param {Map<string, any>} value
     */
	public set hintRefs(value: Map<string, any>) {
		this._hintRefs = value;
	}

    /**
     * Setter routeComponent
     * @param {RoutePanelComponent} value
     */
	public set routeComponent(value: RoutePanelComponent) {
		this._routeComponent = value;
	}

    /**
     * Setter routePairComponent
     * @param {RoutePairPanelComponent} value
     */
	public set routePairComponent(value: RoutePairPanelComponent) {
		this._routePairComponent = value;
	}

    /**
     * Setter testPanel
     * @param {TestPanelComponent} value
     */
	public set testPanel(value: TestPanelComponent) {
		this._testPanel = value;
	}

    /**
     * Setter shortrepPanel
     * @param {ShortReportComponent} value
     */
	public set shortrepPanel(value: ShortReportComponent) {
		this._shortrepPanel = value;
	}

    /**
     * Setter wagTypeRef
     * @param {AutoComplete} value
     */
	public set wagTypeRef(value: AutoComplete) {
		this._wagTypeRef = value;
	}

    /**
     * Setter paragrafPanelComponent
     * @param {ParagrafPanelComponent} value
     */
	public set paragrafPanelComponent(value: ParagrafPanelComponent) {
		this._paragrafPanelComponent = value;
	}

    /**
     * Setter BufferMasks
     * @param {any} value
     */
	public set BufferMasks(value: any) {
		this._BufferMasks = value;
	}

    /**
     * Setter mdlOutCountryDisabled
     * @param {boolean} value
     */
	public set mdlOutCountryDisabled(value: boolean) {
		this._mdlOutCountryDisabled = value;
	}

    /**
     * Setter mdlDestCountryDisabled
     * @param {boolean} value
     */
	public set mdlDestCountryDisabled(value: boolean) {
		this._mdlDestCountryDisabled = value;
	}

    /**
     * Setter mdlReceptionJointTransitCode
     * @param {string} value
     */
	public set mdlReceptionJointCode(value: string) {
		this._mdlReceptionJointCode = value;
	}

    /**
     * Setter mdlSurrenderJointTransitCode
     * @param {string} value
     */
	public set mdlSurrenderJointTransitCode(value: string) {
		this._mdlSurrenderJointCode = value;
	}

    /**
     * Setter destStationIsJoint
     * @param {boolean} value
     */
	public set destStationIsJoint(value: boolean) {
		this._destStationIsJoint = value;
	}

    /**
     * Setter outStationIsJoint
     * @param {boolean} value
     */
	public set outStationIsJoint(value: boolean) {
		this._outStationIsJoint = value;
	}

    /**
     * Setter hintPanel
     * @param {HintPanel} value
     */
	public set hintPanel(value: HintPanel) {
		this._hintPanel = value;
	}

    /**
     * Setter mdlWagTypeFilled
     * @param {string} value
     */
	public set mdlWagTypeFilled(value: string) {
		this._mdlWagTypeFilled = value;
	}

    /**
     * Setter mdlWagCapacityFilled
     * @param {boolean} value
     */
	public set mdlWagCapacityFilled(value: boolean) {
		this._mdlWagCapacityFilled = value;
	}

    /**
     * Setter mdlPivotsFilled
     * @param {boolean} value
     */
	public set mdlPivotsFilled(value: boolean) {
		this._mdlPivotsFilled = value;
	}

    /**
     * Setter mdlKsFilled
     * @param {string} value
     */
	public set mdlKsFilled(value: string) {
		this._mdlKsFilled = value;
	}

    /**
     * Setter mdlConductorsFilled
     * @param {boolean} value
     */
	public set mdlConductorsFilled(value: boolean) {
		this._mdlConductorsFilled = value;
	}

    /**
     * Setter mdlContTypeFilled
     * @param {string} value
     */
	public set mdlContTypeFilled(value: string) {
		this._mdlContTypeFilled = value;
	}

    /**
     * Setter mdlContPayloadFilled
     * @param {boolean} value
     */
	public set mdlContPayloadFilled(value: boolean) {
		this._mdlContPayloadFilled = value;
	}

    /**
     * Setter mdlContColFilled
     * @param {boolean} value
     */
	public set mdlContColFilled(value: boolean) {
		this._mdlContColFilled = value;
	}

    /**
     * Setter mdlSpecMarksFilled
     * @param {boolean} value
     */
	public set mdlSpecMarksFilled(value: boolean) {
		this._mdlSpecMarksFilled = value;
	}

    
    /**
     * Setter progressDialog
     * @param {ProgressDialogComponent} value
     */
	public set progressDialog(value: ProgressDialogComponent) {
		this._progressDialog = value;
	}

    /**
     * Setter errorDialog
     * @param {ErrorDialogComponent} value
     */
	public set errorDialog(value: ErrorDialogComponent) {
		this._errorDialog = value;
	}
  
  @ViewChild(ProgressDialogComponent) private _progressDialog: ProgressDialogComponent;
  @ViewChild(ErrorDialogComponent) private _errorDialog: ErrorDialogComponent;
  public defLabel: string;

  public get stationSuggestions(): string[] {
    return this._stationSuggestions;
  }

  public set stationSuggestions(_stationSuggestions: string[]
  ) {
    this._stationSuggestions = _stationSuggestions;
  }

  public get countrySuggestions(): string[] {
    return this._countrySuggestions;
  }

  public set countrySuggestions(_countrySuggestions: string[]
  ) {
    this._countrySuggestions = _countrySuggestions;
  }


  public get gngSuggestions(): string[] {
    return this._gngSuggestions;
  }

  public set gngSuggestions(_gngSuggestions: string[]) {
    this._gngSuggestions = _gngSuggestions;
  }

  public get etsngSuggestions(): string[] {
    return this._etsngSuggestions;
  }

  public set etsngSuggestions(_etsngSuggestions: string[]
  ) {
    this._etsngSuggestions = _etsngSuggestions;
  }

  public get ksSuggestions(): string[] {
    return this._ksSuggestions;
  }

  public set ksSuggestions(_ksSuggestions: string[]
  ) {
    this._ksSuggestions = _ksSuggestions;
  }

  public get contTypeSuggestions(): string[] {
    return this._contTypeSuggestions;
  }

  public set contTypeSuggestions(_contTypeSuggestions: string[]
  ) {
    this._contTypeSuggestions = _contTypeSuggestions;
  }

  public get mdlWagTypeTableSuggestions(): IWagType[] {
    return this._mdlWagTypeTableSuggestions;
  }

  public set mdlWagTypeTableSuggestions(_value: IWagType[]
  ) {
    this._mdlWagTypeTableSuggestions = _value;
  }

  public get mdlWagTypeSuggestions(): string[] {
    return this._mdlWagTypeSuggestions;
  }

  public set mdlWagTypeSuggestions(_value: string[]
  ) {
    this._mdlWagTypeSuggestions = _value;
  }

  public get mdlWagTypePanelDisplay(): boolean {
    return this._mdlWagTypePanelDisplay;
  }

  public set mdlWagTypePanelDisplay(_mdlWagTypePanelDisplay: boolean) {
    this._mdlWagTypePanelDisplay = _mdlWagTypePanelDisplay;
  }

  public get mdlSpecMarkPanelDisplay(): boolean {
    return this._mdlSpecMarkPanelDisplay;
  }

  public set mdlSpecMarkPanelDisplay(value: boolean) {
    this._mdlSpecMarkPanelDisplay = value;
  }

  public get belDistDisplay() {
    return this._belDistDisplay;
  }

  public get mdlSpecMarkChips(): string {
    return this._specMarkListService.specMarkChips;
  }

  public set mdlSpecMarkChips(value: string) {
    this._specMarkListService.specMarkChips = value;
  }

  public get specMarkDisabled(): boolean {
    return (!this.enableSpecMarks());
  }

  public get mdlWagTypeReadOnly(): boolean {
    return this._mdlWagTypeReadOnly;
  }

  public get mdlOutParagraf(): string {
    return this._routeService.route.outParagraf;
  }

  public set mdlOutParagraf(value: string) {
    this._routeService.route.outParagraf = value;
  }

  public get mdlOutDetailParagraf(): string {
    return this._routeService.route.outDetailParagraf;
  }

  public set mdlOutDetailParagraf(value: string) {
    this._routeService.route.outDetailParagraf = value;
  }

  public get mdlDestParagraf(): string {
    return this._routeService.route.destParagraf;
  }

  public set mdlDestParagraf(value: string) {
    this._routeService.route.destParagraf = value;
  }

  public get mdlDestDetailParagraf(): string {
    return this._routeService.route.destDetailParagraf;
  }

  public set mdlDestDetailParagraf(value: string) {
    this._routeService.route.destDetailParagraf = value;
  }

  public get mdlOutCountryDisabled(): boolean {
    return this._mdlOutCountryDisabled;
  }

  public get mdlDestCountryDisabled(): boolean {
    return this._mdlDestCountryDisabled;;
  }

  public get mdlFormPlanWagons(): number {
    return this._mdlFormPlanWagons;
  }

  public set mdlFormPlanWagons(value: number) {
    this._mdlFormPlanWagons = value;
  }

  public get mdlReceptionJoint(): string {
    return this._mdlReceptionJoint;
  }

  public set mdlReceptionJoint(value: string) {
    this._mdlReceptionJoint = value;
  }

  public get mdlSurrenderJoint(): string {
    return this._mdlSurrenderJoint;
  }

  public set mdlSurrenderJoint(value: string) {
    this._mdlSurrenderJoint = value;
  }

  public get btnOutStationParagrafDisabled() {
    return this._btnOutStationParagrafDisabled;
  }

  public get btnDestStationParagrafDisabled() {
    return this._btnDestStationParagrafDisabled;
  }

  get visibleTransitPanel(): boolean {
    return this._visibleControlsService.visibleTransitPanel;
  }

  set visibleTransitPanel(value: boolean) {
    this._visibleControlsService.visibleTransitPanel = value;
  }

  get btnReverseStationsDisabled(): boolean {
    return this._btnReverseStationsDisabled;
  }
  
  public get mdlGng(): string {
    return this._mdlGng;
  }

  public set mdlGng(value: string) {
    this._mdlGng = value.trim();
  }

  public get mdlWagTypeRow(): IWagType {
    return this._wagTypeListService.Row;
  }

  public set mdlWagTypeRow(value: IWagType) {
    this._wagTypeListService.Row = value;
  }

  public get mdlWagType(): string {
    return this._wagTypeListService.Name;
  }

  public set mdlWagType(value: string) {
    this._wagTypeListService.Name = value;
  }

  public get mdlContType(): string {
    return this._contTypeListService.Name;
  }

  public set mdlContType(value: string) {
    this._contTypeListService.Name = value.trim();
  }

  public get mdlContTypeCode(): number {
    return this._contTypeListService.Code;
  }

  public set mdlContTypeCode(value: number) {
    this._contTypeListService.Code = value;
  }

  public set mdlContOwnershipItem(value: any) {
    this._ownershipListService.contOwnershipItem = value;
  }

  public get mdlContOwnershipItem(): any {
    return this._ownershipListService.contOwnershipItem;
  }

  public set mdlFootItem(value: any) {
    this._mdlFootItem = value;
  }

  public get mdlFootItem(): any {
    return this._mdlFootItem;
  }

  public set mdlFoot(value: string) {
    this._mdlFoot = value;
  }

  public get mdlFoot(): string {
    return this._mdlFoot;
  }

  public set mdlContPayload(value: string) {
    this._mdlContPayload = value;
  }

  public get mdlContPayload(): string {
    return this._mdlContPayload;
  }
  
  public set mdlOutStation(value: string) {
    this._mdlOutStation = value.trim();
  }

  public get mdlOutStation(): string {
    return this._mdlOutStation.trim();
  }

  public set mdlOutStationCode(value: string) {
    this._mdlOutStationCode = value.trim();
  }

  public get mdlOutStationCode(): string {
    this.enabledGngEtsng();
    return this._mdlOutStationCode;
  }

  public get mdlOutCountry(): string {
    return this._mdlOutCountry;
  }

  public set mdlOutCountryCode(value: string) {
    this._mdlOutCountryCode = value.trim();
  }

  public get mdlOutCountryCode(): string {
    return this._mdlOutCountryCode;
  }

  public set mdlOutCountry(value: string) {
    this._mdlOutCountry = value;
  }

  public set mdlDestStation(value: string) {
    this._mdlDestStation = value.trim();
  }

  public get mdlDestStation(): string {
    return this._mdlDestStation;
  }

  public set mdlDestStationCode(value: string) {
    this._mdlDestStationCode = value;
  }

  public get mdlDestStationCode(): string {
    this.enabledGngEtsng();
    return this._mdlDestStationCode;
  }

  public set mdlDestCountry(value: string) {
    this._mdlDestCountry = value.trim();
  }

  public get mdlDestCountry(): string {
    return this._mdlDestCountry;
  }

  public set mdlDestCountryCode(value: string) {
    this._mdlDestCountryCode = value.trim();
  }

  public get mdlDestCountryCode() {
    return this._mdlDestCountryCode;
  }

  public set mdlGngCode(value: string) {
    this._mdlGngCode = value.trim();
  }

  public get mdlGngCode(): string {
    return this._mdlGngCode;
  }

  public set mdlEtsng(value: string) {
    this._mdlEtsng = value.trim();
  }

  public get mdlEtsng(): string {
    return this._mdlEtsng;
  }

  public set mdlEtsngCode(value: string) {
    this._mdlEtsngCode = value.trim();
  }

  public get mdlEtsngCode(): string {
    return this._mdlEtsngCode;
  }

  public set mdlCargoWeight(value: string) {
    this._mdlCargoWeight = value;
  }

  public get mdlCargoWeight(): string {
    return this._mdlCargoWeight;
  }
  
  get svoItem(): any {
    return this._svoListService.item;
  }

  set svoItem(value : any) {
    this._svoListService.item = value;
  }

  public set mdlKs(value: string) {
    this._ksListService.Name = value.trim();
  }

  public get mdlKs(): string {
    return this._ksListService.Name;
  }

  public set mdlKsCode(value: string) {
    this._ksListService.Code = value;
  }

  public get mdlKsCode(): string {
    return this._ksListService.Code;
  }

  public set mdlWagCapacity(value: string) {
    this._mdlWagCapacity = value;
  }

  public get mdlWagCapacity(): string {
    return this._mdlWagCapacity;
  }

  public set mdlPivots(value: string) {
    this._mdlPivots = value;
  }

  public get mdlPivots(): string {
    return this._mdlPivots;
  }

  public set mdlConductors(value: string) {
    this._mdlConductors = value;
  }

  public get mdlConductors(): string {
    return this._mdlConductors;
  }

  public set prevCargoDisabled(value: boolean) {
    this._prevCargoDisabled = value;
  }

  public get prevCargoDisabled(): boolean {
    return this._prevCargoDisabled;
  }

  public set footDisabled(value: boolean) {
    this._footDisabled = value;
  }

  public get footDisabled(): boolean {
    return this._footDisabled;
  }
    
  public set tabExtendVisible(value: boolean) {
    this._tabExtendVisible = value;
  }

  public get tabExtendVisible(): boolean {

    return this._tabExtendVisible;
  }

  public set mdlTarifTypes(value: SelectItem[]) {
    this._mdlTarifTypes = value;
  }

  public get mdlTarifTypes(): SelectItem[] {
    return this._mdlTarifTypes;
  }

  public get etsngDisabled(): boolean {
    return this._etsngDisabled;
  }

  public set mdlContCol(value: string) {
    this._mdlContCol = value;
  }

  public get mdlContCol(): string {
    return this._mdlContCol;
  }

  public get mdlPay(): string {
    return this._mdlPay;
  }

  public set mdlPay(value: string) {
    if (value !== '' && value !== undefined) {
      this._btnReportsDisplay = true;
    } else {
      this._btnReportsDisplay = false;
    }
    this._mdlPay = value;
  }

  public get mdlTotalDist(): string {
    if (this._routeService.route.totalDist !== '' && this._routeService.route.totalDist !== undefined) {
      this._btnRouteDisplay = true;
    } else {
      this._btnRouteDisplay = false;
    }
    return this._routeService.route.totalDist;
  }

  public set mdlTotalDist(value: string) {
    this._routeService.route.totalDist = value;
  }

  public get mdlBelDist(): string {
    return this._routeService.route.belDist;
  }

  public set mdlBelDist(value: string) {
    this._routeService.route.belDist = value;
  }

  public get mdlBlockUI(): boolean {
    return this._mdlBlockUI;
  }

  public get ownershipDisabled(): boolean {
    return this._ownershipDisabled;
  }

  public get ksDisabled(): boolean {
    return this._ksDisabled;
  }

  public get wagTypeDisabled(): boolean {
    return this._wagTypeDisabled;
  }

  public get svoDisabled(): boolean {
    return this._svoDisabled;
  }

  public get mdlVelocities(): SelectItem[] {
    return this._mdlVelocities;
  }
  
  public get calcDisabled(): boolean {
    return this._calcDisabled;
  }

  public set mdlVelocity(value: string) {
    this._mdlVelocity = value;
  }

  public get mdlVelocity(): string {
    return this._mdlVelocity;
  }

  /**
     * Getter outStationDisabled
     * @return {boolean }
     */
  public get outStationDisabled(): boolean {
    return this._outStationDisabled;
  }

  /**
 * Getter InStationDisabled
 * @return {boolean }
 */
  public get inStationDisabled(): boolean {
    return this._inStationDisabled;
  }

  /**
   * Getter gngDisabled
   * @return {boolean }
   */
  public get gngDisabled(): boolean {
    return this._gngDisabled;
  }

  public set logInfo(value: any) {
    this._logService.info = value;
  }

  public set logDebug(msg: string) {
    this._logService.debug = msg;
  }

  public set logDebugValue(value: any) {
    this._logService.debugValue = value;
  }

  set svoCode(value: string) {
    this._svoListService.code = value;
  }

  get svoCode() {
    return this._svoListService.code;
  }

  /**
     * Getter mdlHintEtsng
     * @return {string}
     */
  public get mdlHintEtsng(): string {
    return this._mdlHintEtsng;
  }

  public set mdlHintEtsng(Value: string) {
    if (Value === '') {
      this._mdlHintEtsng = "код или наименование груза по справочнику ЕТСНГ";
    } else {
      this._mdlHintEtsng = Value;
    }
  }

  public get cacheStations(): any {
    return this._cacheService.Stations;
  }

  public get cacheGngs(): any {
    return this._cacheService.Gngs;
  }

  public get cacheEtsngs(): any {
    return this._cacheService.Gngs;
  }

  public get cacheMasks(): any {
    return this._cacheService.Masks;
  }

  public get cacheOwnerships(): any {
    return this._cacheService.Ownerships;
  }

  public get cacheKss(): any {
    return this._cacheService.Kss;
  }

  public get cacheWagTypes(): any {
    return this._cacheService.wagTypes;
  }

  public get cacheContTypes(): any {
    return this._cacheService.contTypes;
  }

  public get cacheSpecialMarks(): any {
    return this._cacheService.specialMarks;
  }

  public get cacheSvo(): any {
    return this._cacheService.Svo;
  }

  public get cacheCountries(): any {
    return this._cacheService.Countries;
  }

  public get cacheIdCountries(): any {
    return this._cacheService.idCountries;
  }

  public get cacheUpdateNsiDate(): any {
    return this._cacheService.UpdateNsiDate;
  }

  public get cacheVersion(): any {
    return this._cacheService.Version;
  }

  public get lastServerUpdateNsiDate(): string {
    return this._cacheService.lastServerUpdateNsiDate;
  }

  public set lastServerUpdateNsiDate(value: string) {
    this._cacheService.lastServerUpdateNsiDate = value;
  }

  public get lastCacheUpdateNsiDate(): string {
    return this._cacheService.lastCacheUpdateNsiDate;
  }

  public set lastCacheUpdateNsiDate(value: string) {
    this._cacheService.lastCacheUpdateNsiDate = value;
  }

  public get testMode() {
    return environment.testMode;
  }

  public get btnReportsDisplay(): boolean {
    return this._btnReportsDisplay;
  }

  public get btnRouteDisplay(): boolean {
    return this._btnRouteDisplay;
  }

  public get btnPairRouteDisplay(): boolean {
    return this._btnPairRouteDisplay;
  }

  public get mdlWagOwnershipCode() {
    return this._ownershipListService.wagOwnershipCode;
  }

  public set mdlWagOwnershipCode(value: number) {
    this._ownershipListService.wagOwnershipCode = value;
  }

  public get mdlWagOwnershipItem(): any {
    return this._ownershipListService.wagOwnershipItem;
  }

  public set mdlWagOwnershipItem(value: any) {
    this._ownershipListService.wagOwnershipItem = value;
  }

  public get mdlContOwnershipCode() {
    return this._ownershipListService.contOwnershipCode;
  }

  public set mdlContOwnershipCode(value: number) {
    this._ownershipListService.contOwnershipCode = value;
  }

  public get mdlHeaderWagTab(): string {
    this.setHeaderWagTab();
    return this._headerWagTab;
  }

  private setHeaderWagTab() {
    let _header: string = 'Вагон';
    if (!this.shadowTabWagVisible && this.mdlWagType !== undefined && this.mdlWagOwnershipItem !== undefined) {
      _header = `Вагон/ ${this.mdlWagType.toLowerCase()} ${this.mdlWagOwnershipItem.name.toLowerCase()}`;
    }
    this._headerWagTab = _header;
  }

  public get mdlHeaderExtendTab(): string {
    this.setHeaderExtendTab();
    return this._headerExtendTab;
  }
  
  public get mdlCurrencyItems(): SelectItem[] {
    return this._mdlCurrencyItems;
  }

  public get mdlCurrencyItem(): any {
    return this._calcService.currencyItem;
  }

  public set mdlCurrencyItem(value: any) {
    this._calcService.currencyItem = value;
  }

  public set currencyCode(value: number) {
    this._calcService.currencyCode = value;
  }

  public get currencyCode(): number {
    return this._calcService.currencyCode;
  }

  public set Currency(value: string) {
    this._calcService.Currency = value;
  }

  public get Currency(): string {
    return this._calcService.Currency;
  }

  public set queryRouteStatus(value: QUERY_STATUS) {
    this._routeService.status = value;
  }

  public get queryRouteStatus(): QUERY_STATUS {
    return this._routeService.status;
  }

  public set queryCalcStatus(value: QUERY_STATUS) {
    this._calcService.Status = value;
  }

  public get queryCalcStatus(): QUERY_STATUS {
    return this._calcService.Status;
  }

  public get calcTimeout(): number {
    return this._apiService.calcTimeout;;
  }

  public get routeTimeout(): number {
    return this._apiService.routeTimeout;;
  }

  public get mdlOwnershipItems(): SelectItem[] {
    return this._ownershipListService.List;
  }

  public get specMarkSuggestions(): ISpecMark[] {
    return this._specMarkListService.specMarkSuggestions;
  }

  public set specMarkSuggestions(value: ISpecMark[]) {
    this._specMarkListService.specMarkSuggestions = value;
  }

  public get specMarkAllSuggestions(): ISpecMark[] {
    return this._specMarkListService.specMarkAllSuggestions;
  }

  public get mdlSpecMarkSuggestions(): ISpecMark[] {
    return this._specMarkListService.specMarkSuggestions;
  }

  public set mdlSpecMarkSuggestions(value: ISpecMark[]) {
    this._specMarkListService.specMarkSuggestions = value;
  }

  public get mdlSelectedSpecMarks(): ISpecMark[] {
    return this._specMarkListService.selectedSpecMarks;
  }

  public set mdlSelectedSpecMarks(value: ISpecMark[]) {
    this._specMarkListService.selectedSpecMarks = value;
  }

  public get mdlFootItems(): SelectItem[] {
    return this._mdlFootItems;
  }

  public set mdlFootItems(value: SelectItem[]) {
    this._mdlFootItems = value;
  }

  public get enabledCacheNSI(): boolean {
    return this._cacheService.enabledCacheNSI;
  }

  public get disabledReverseStations(): boolean {
    let flagIn: boolean = false;
    let flagOut: boolean = false;
    if (this._mdlOutCountry !== undefined)
      if (this._mdlOutCountry.length > 0) {
        flagOut = true;
      }
    if (this._mdlDestCountry !== undefined)
      if (this._mdlDestCountry.length > 0) {
        flagIn = true;
      }
    return !(flagIn && flagOut);
  }

  public set enabledCacheNSI(value: boolean) {
    this._cacheService.enabledCacheNSI = value;
    let flag_: number = value ? 1 : 0;
    cookies.set('cacheNSI', flag_, { expires: 3650 });
  }

  get mdlOutStationFilled(): string {
    return this._mdlOutStationFilled;
  }

  get mdlOutStationCodeFilled(): boolean {
    return this._mdlOutStationCodeFilled;
  }

  get mdlOutCountryFilled(): string {
    return this._mdlOutStationFilled;
  }

  get mdlOutCountryCodeFilled(): boolean {
    return this._mdlOutStationCodeFilled;
  }

  get mdlDestStationFilled(): string {
    return this._mdlDestStationFilled;
  }

  get mdlDestStationCodeFilled(): boolean {
    return this._mdlDestStationCodeFilled;
  }

  get mdlDestCountryFilled(): string {
    return this._mdlDestStationFilled;
  }

  get mdlDestCountryCodeFilled(): boolean {
    return this._mdlDestStationCodeFilled;
  }
  
  get mdlGngFilled(): string {
    return this._mdlGngFilled;
  }

  get mdlGngCodeFilled(): boolean {
    return this._mdlGngCodeFilled;
  }

  get mdlEtsngFilled(): string {
    return this._mdlEtsngFilled;
  }

  get mdlEtsngCodeFilled(): boolean {
    return this._mdlEtsngCodeFilled;
  }
  
  get mdlWeightCargoFilled(): boolean {
    return this._mdlWeightCargoFilled;
  }
    
  get mdlPayFilled(): string {
    return this._mdlPayFilled;
  }

  get mdlWagOwnershipFilled(): boolean {
    return this._mdlWagOwnershipFilled;
  }

  get isWagonSvo() : boolean {
    let _res : boolean = true; 
    if (this.svoCode === '5' || this.svoCode === '6'){
      _res = false;  
    }
    return _res;
  }
  
  get isLightbackWagonPanel(): boolean {
    return this.isWagonSvo;
  }

  get isLightbackContPanel(): boolean {
    return !this.isWagonSvo;
  }

  get date(): string {
    return this._calcService.Date;
  }

  public get svos(): SelectItem[] {
    return this._svoListService.list;
  }

  get shadowTabWagonVisible(): boolean {
    return this._visibleControlsService.shadowTabWagVisible;
  }

  set shadowTabWagonVisible(value : boolean){
    this._visibleControlsService.shadowTabWagVisible = value;
  }
  
	get shadowTabContVisible(): boolean  {
		return this._visibleControlsService.shadowTabContVisible;
  }
  
  set shadowtabContVisible(value: boolean) {
    this._visibleControlsService.shadowTabContVisible = value;
  }

  get tabContVisible(): boolean {
    return this._visibleControlsService.tabContVisible;
  }

  set tabContVisible(value : boolean) {
    this._visibleControlsService.tabContVisible = value;
  }

  set tabWagVisible(value: boolean) {
    this._visibleControlsService.tabWagVisible = value;
  }

  get tabWagVisible(): boolean {
    return this._visibleControlsService.tabWagVisible;
  }

  public get Url(): string {
    return this._apiService.urlAssets;
  }

  public get mdlReceptionJointFilled(): string {
    return this._mdlReceptionJointFilled;
  }

  public set mdlReceptionJointFilled(value: string) {
    this._mdlReceptionJointFilled = value;
  }
  
  public get mdlSurrenderJointFilled(): string {
    return this._mdlSurrenderJointFilled;
  }

  public set mdlSurrenderJointFilled(value: string) {
    this._mdlSurrenderJointFilled = value;
  }
  
  constructor(private _router: Router, private _routeService: RouteService, private _calcService: CalcService,
    private _validService: ValidService, private _keyService: KeyService,
    private _hintService: HintService, private _loginService: LoginService,
    private _logService: LogService, private _cacheService: CacheService, private _apiService: ApiService,
    private _ownershipListService: OwnershipListService, private _svoListService: SvoListService,
    private _wagTypeListService: WagTypeListService, private _contTypeListService: ContTypeListService,
    private _specMarkListService: SpecMarkListService, private _ksListService: KsListService,
    private _visibleControlsService: VisibleControlsService, private _changeDetectorRef: ChangeDetectorRef,
    private _renderer : Renderer
  ) {
    this._mdlContCol = '0';
    this.mdlHintEtsng = '';
    if (this._cacheService.defaultValues) {
      this.mdlCurrencyItem = this.mdlCurrencyItems[0];
      this.currencyCode = this.mdlCurrencyItems[0].value.id;
      this.Currency = this.mdlCurrencyItems[0].value.name;
    }
    this._mdlSpecMarkPanelDisplay = false;
    this._etsngDisabled = false;
    this._gngDisabled = false;
    this.mdlPivots = '4';
    this._shadowTabExtendVisible = false;
    this._mdlVelocity = this._mdlVelocities[0].value;

    // панель Контейнер - дефолт значения
    this._mdlFootItem = this._mdlFootItems[2].value;
    this._mdlFoot = this.mdlFootItem.code;
    this._mdlContCol = '1';
    this._mdlContPayload = '20';

    this._mdlOutCountryDisabled = true;
    this._mdlDestCountryDisabled = true;

    this._mdlReceptionJoint = '';
    this._mdlSurrenderJoint = '';
    this._mdlReceptionJointCode = '';
    this._mdlSurrenderJointCode = '';
    this._mdlFormPlanWagons = 0;

    // стили заполненности контролей
    this._mdlOutStationFilled = '';
    this._mdlOutStationCodeFilled = false;
    this._mdlDestStationFilled = '';
    this._mdlDestStationCodeFilled = false;
    this._mdlGngFilled = '';
    this._mdlGngCodeFilled = false;
    this._mdlEtsngFilled = '';
    this._mdlEtsngCodeFilled = false;
    this._mdlWeightCargoFilled = false;
    this._mdlWagTypeFilled = '';
    this._mdlWagCapacityFilled = false;
    this._mdlPivotsFilled = false;
    this._mdlKsFilled = '';
    this._mdlConductorsFilled = false;
    this._mdlContTypeFilled = '';
    this._mdlContPayloadFilled = false;
    this._mdlContColFilled = false;
    this._mdlSpecMarksFilled = false;

    this._visibleControlsService.dateDisabled = false;
    this._visibleControlsService.svoDisabled = false;
  }

  ngOnInit() {
    this._svoSubscription = this._visibleControlsService.subjectSvo.subscribe(() => this.handleChangeSvo());
    this.initHintRefs();
    if (!this._cacheService.defaultValues) {
      this.restoreParams();
    }
    this.setNsiView();
  }

  ngOnDestroy() {
    this._changeDetectorRef.detach(); // do this
    this._svoSubscription.unsubscribe();
  }

  detectChanges() {
    if (!(<ViewRef>this._changeDetectorRef).destroyed) {
      this._changeDetectorRef.detectChanges();
    }
  }

  logMsgAll(event, proc: string) {
    this._logService.logMsgAll(event, proc);
  }

  restoreParams() {// переброс кэшированных данных из компонента расчета
    this.logDebug = '@restoreParams()';

    this._mdlGng = this._calcService.Gng;
    this._mdlGngCode = this._calcService.gngCode;
    this._mdlEtsngCode = this._calcService.etsngCode;
    this._mdlEtsng = this._calcService.Etsng;
    this._mdlCargoWeight = this._calcService.cargoWeight;
    this._mdlWagCapacity = this._calcService.wagCapacity;
    this._mdlConductors = this._calcService.Conductors;
    this._mdlPivots = this._calcService.Pivots;
    this._mdlContCol = this._calcService.contCol;
    this._mdlFootItem = this._calcService.FootItem;
    this._mdlFoot = this._calcService.Foot;
    this._mdlVelocityIndex = this._calcService.velocityIndex;

    this._mdlOutStationCode = this._calcService.outStationCode;
    this._mdlOutStation = this._calcService.outStation;
    this._mdlOutCountryCode = this._calcService.outCountryCode;
    this._mdlOutCountry = this._calcService.outCountry;

    this._mdlDestStationCode = this._calcService.inStationCode;
    this._mdlDestStation = this._calcService.inStation;
    this._mdlDestCountryCode = this._calcService.userInCountryCode;
    this._mdlDestCountry = this._calcService.userInCountry;

    this._mdlContPayload = this._calcService.contPayload;
    this.mdlPay = this._calcService.Pay;
    this.mdlSpecMarkChips = this._calcService.specMarkChips;

    this._mdlReceptionJoint = this._calcService.receptionJoint;
    this._mdlSurrenderJoint = this._calcService.surrenderJoint;
    this._mdlReceptionJointCode = this._calcService.receptionJointCode;
    this._mdlSurrenderJointCode = this._calcService.surrenderJointCode;
    this._mdlFormPlanWagons = this._calcService.formPlanWagons;

    this.restoreDisabledControls();
    this.restoreVisiblePanels();

    this.checkFillOutStation();    
    this.checkFillDestStation();    
    this.checkFillGng();    
    this.checkFillEtsng();
    this.checkFillCargoWeight();

    this.fillSurrenderJoint();
    this.fillReceptionJoint();

    this.payChanged();
    this.restoreBacklightControls();
  }

  restoreDisabledControls() {// видимости контролей
    this.logDebug = '@CalcComponent @restoreDisabledControls()';
    this._mdlOutCountryDisabled = this._visibleControlsService.outCountryDisabled;
    this._mdlDestCountryDisabled = this._visibleControlsService.inCountryDisabled;
    this._etsngDisabled = this._visibleControlsService.etsngDisabled;
    this._wagTypeDisabled = this._visibleControlsService.wagTypeDisabled;
    this._ownershipDisabled = this._visibleControlsService.ownershipDisabled;
    this._ksDisabled = this._visibleControlsService.ksDisabled;
    this._svoDisabled = this._visibleControlsService.svoDisabled;
    this._specMarkDisabled = this._visibleControlsService.specMarkDisabled;
    this._calcDisabled = this._visibleControlsService.calcDisabled;
    this._btnReportsDisplay = this._visibleControlsService.btnReportsDisplay;

    this._btnOutStationParagrafDisabled = this._visibleControlsService.btnOutStationParagrafDisabled;
    this._btnDestStationParagrafDisabled = this._visibleControlsService.btnDestStationParagrafDisabled;
    this._btnReverseStationsDisabled = this._visibleControlsService.btnReverseStationsDisabled;
    this._belDistDisplay = this._visibleControlsService.belDistDisplay;
  }

  restoreVisiblePanels() { // видимости панелей
    this.logDebug = '@CalcComponent @restoreVisiblePanels';
    this._tabExtendVisible = this._visibleControlsService.tabExtendVisible;
    this._shadowTabExtendVisible = this._visibleControlsService.tabExtendVisible;
    this.logDebug = ''+this.tabContVisible;
    this.logDebug = ''+this.tabWagVisible;
  }

  restoreBacklightControls(){
    this._mdlWagTypeFilled = this._visibleControlsService.mdlWagTypeFilled;
    this._mdlWagCapacityFilled = this._visibleControlsService.mdlWagCapacityFilled;
    this._mdlPivotsFilled = this._visibleControlsService.mdlPivotsFilled;
    this._mdlKsFilled = this._visibleControlsService.mdlKsFilled;
    this._mdlConductorsFilled = this._visibleControlsService.mdlConductorsFilled;
    this._mdlContTypeFilled = this._visibleControlsService.mdlContTypeFilled;
    this._mdlContPayloadFilled = this._visibleControlsService.mdlContPayloadFilled;
    this._mdlContColFilled = this._visibleControlsService.mdlContColFilled;
    this._mdlSpecMarksFilled = this._visibleControlsService.mdlSpecMarksFilled;
  }

  backupBacklightControls(){
    this._visibleControlsService.mdlWagTypeFilled = this._mdlWagTypeFilled;
    this._visibleControlsService.mdlWagCapacityFilled = this._mdlWagCapacityFilled;
    this._visibleControlsService.mdlPivotsFilled = this._mdlPivotsFilled;
    this._visibleControlsService.mdlKsFilled = this._mdlKsFilled;
    this._visibleControlsService.mdlConductorsFilled = this._mdlConductorsFilled;
    this._visibleControlsService.mdlContTypeFilled = this._mdlContTypeFilled;
    this._visibleControlsService.mdlContPayloadFilled = this._mdlContPayloadFilled;
    this._visibleControlsService.mdlContColFilled = this._mdlContColFilled;
    this._visibleControlsService.mdlSpecMarksFilled = this._mdlSpecMarksFilled;
  }

  backupParams() {
    this.logDebug = '@CalcComponent @backupParams()';

    this._calcService.Gng = this._mdlGng;
    this._calcService.gngCode = this._mdlGngCode;
    this._calcService.etsngCode = this._mdlEtsngCode;
    this._calcService.Etsng = this._mdlEtsng;
    this._calcService.cargoWeight = this._mdlCargoWeight;
    this._calcService.wagCapacity = this._mdlWagCapacity;
    this._calcService.Conductors = this._mdlConductors;
    this._calcService.Pivots = this._mdlPivots;
    this._calcService.contCol = this._mdlContCol;
    this._calcService.FootItem = this._mdlFootItem;
    this._calcService.Foot = this._mdlFoot;
    
    this._calcService.velocityIndex = this._mdlVelocityIndex;

    this._calcService.outStationCode = this._mdlOutStationCode;
    this._calcService.outStation = this._mdlOutStation;
    this._calcService.outCountryCode = this._mdlOutCountryCode;
    this._calcService.outCountry = this._mdlOutCountry;

    this._calcService.inStationCode = this._mdlDestStationCode;
    this._calcService.inStation = this._mdlDestStation;
    this._calcService.userInCountry = this._mdlDestCountry;
    this._calcService.userInCountryCode = this._mdlDestCountryCode;
    this._calcService.factInCountryCode = this._mdlDestCountryCode;

    if (this._destStationIsJoint){
      let Country = this.getCountry(this._mdlDestStationCode);
      this._calcService.factInCountryCode = String(Country.kod);
      this._calcService.factInCountry = String(Country.name);
    } else {
      this._calcService.factInCountry = this._mdlDestCountry;
      this._calcService.factInCountryCode = this._mdlDestCountryCode;
    }
    this._calcService.contPayload = this._mdlContPayload;

    this._calcService.receptionJoint = this._mdlReceptionJoint;
    this._calcService.receptionJointCode = this._mdlReceptionJointCode;
    this._calcService.surrenderJoint = this._mdlSurrenderJoint;
    this._calcService.surrenderJointCode = this._mdlSurrenderJointCode;
    this._calcService.formPlanWagons = this._mdlFormPlanWagons;

    this._calcService.Pay = this._mdlPay;
    this._calcService.shadowEtsngCode = this._shadowEtsngCode;
    this._calcService.specMarkChips = this.mdlSpecMarkChips;
    this.backupBacklightControls();
  }

  backupDisabledControls() {// видимости контролей
    this.logDebug = '@CalcComponent @backupDisabledControls()';
    this._visibleControlsService.outCountryDisabled = this._mdlOutCountryDisabled;
    this._visibleControlsService.inCountryDisabled = this._mdlDestCountryDisabled;
    this._visibleControlsService.etsngDisabled = this._etsngDisabled;
    this._visibleControlsService.wagTypeDisabled = this._wagTypeDisabled;
    this._visibleControlsService.ownershipDisabled = this._ownershipDisabled;
    this._visibleControlsService.ksDisabled = this._ksDisabled;
    this._visibleControlsService.svoDisabled = this._svoDisabled;
    this._visibleControlsService.specMarkDisabled = this._specMarkDisabled;
    this._visibleControlsService.calcDisabled = this._calcDisabled;
    this._visibleControlsService.btnReportsDisplay = this._btnReportsDisplay;

    this._visibleControlsService.btnOutStationParagrafDisabled = this._btnOutStationParagrafDisabled;
    this._visibleControlsService.btnDestStationParagrafDisabled = this._btnDestStationParagrafDisabled;
    this._visibleControlsService.btnReverseStationsDisabled = this._btnReverseStationsDisabled;
    this._visibleControlsService.belDistDisplay = this._belDistDisplay;
  }

  backupVisiblePanels() { // видимости панелей
    this._visibleControlsService.tabExtendVisible = this._shadowTabExtendVisible;
  }

  handleClear() {
    this.clearStations();
    this.clearCargo();
    this.clearWagon();
    this.clearContainer();
    this.clearExtend();
    this.clearHightlightControls();
  }

  clearHightlightControls(){
    this._mdlPayFilled = '';
  }

  clearStations() {
    this._mdlOutStationCode = '';
    this._mdlOutStation = '';
    this._mdlOutCountry = '';
    this._mdlOutCountryCode = '';
    this._mdlDestStationCode = '';
    this._mdlDestStation = '';
    this._mdlDestCountryCode = '';
    this._mdlDestCountry = '';
    setTimeout(()=> { this._mdlOutStationFilled = '';
                      this._mdlOutStationCodeFilled = false;
                      this._mdlDestStationFilled = '';
                      this._mdlDestStationCodeFilled = false;
                    }, 100);

    this.mdlTotalDist = '';
    this.mdlBelDist = '';
    this._belDistDisplay = false;
    this._btnDestStationParagrafDisabled = true;
    this._btnOutStationParagrafDisabled = true;
    this._routeService.clear();

    this._mdlReceptionJoint = '';
    this._mdlSurrenderJoint = '';
    this.visibleTransitPanel = false;
  }

  clearCargo() {
    setTimeout(()=> { this._mdlWeightCargoFilled = false;
                      this._mdlCargoWeight = '0';
                    }, 100);
    this.handleClearGng()
  }  
 
  handleClearGng() {
    this._mdlGngCode = '';
    this._mdlGng = '';
    this._mdlEtsngCode = '';
    this._mdlEtsng = '';
     this.mdlHintEtsng = '';
    this.mdlPay = '';
    setTimeout(()=> { this._mdlGngFilled = '';
                      this._mdlGngCodeFilled = false;
                      this._mdlEtsngFilled = '';
                      this._mdlEtsngCodeFilled = false;
                    }, 100);
  }

  clearWagon() {
    const respWagType = this.cacheWagTypes.find({ 'name_web': { $ne: '' } });
    const respWagTypes = respWagType.filter(Item => Item.name_web === 'Крытый');
    this.mdlWagTypeRow = respWagTypes[0];
    this.copyWagType(undefined);

    this._mdlConductors = '0';

    this.mdlWagOwnershipItem = this.mdlOwnershipItems[0].value;
    this.mdlWagOwnershipCode = Number.parseInt(this.mdlOwnershipItems[0].value.id);

    const respKs = this.cacheKss.find({ 'name': { $ne: '' } });
    const defKs: any = respKs.filter(item => item.kadm === 21);

    this.mdlKsCode = defKs[0].kadm;
    this.mdlKs = defKs[0].name.trim();
  }

  clearContainer() {
    const respContTypes = this.cacheContTypes.find({ 'kod': { $gte: 0 } });
    const defContType: any = respContTypes.filter(Item => Item.kod === 0);
    this.mdlContTypeCode = defContType[0].kod;
    this.mdlContType = defContType[0].tip;
    this.mdlContOwnershipItem = this.mdlOwnershipItems[0].value;
    this.mdlContOwnershipCode = Number.parseInt(this.mdlOwnershipItems[0].value.id);
    this._mdlFootItem = this._mdlFootItems[2].value;
    this._mdlContPayload = '20';
    this._mdlContCol = '1';
  }

  clearExtend() {
    this.svoItem = this.svos[0].value;
    this.svoCode = String(this.svoItem.id);
    this._calcService.svoCode = this.svoCode;
    this._calcService.svoItem = this.svoItem;
    this.mdlSpecMarkChips = '';
    this.mdlSelectedSpecMarks = [];
    this.mdlCurrencyItem = this.mdlCurrencyItems[0].value;
    this.currencyCode = this.mdlCurrencyItems[0].value.id;
    this.Currency = this.mdlCurrencyItems[0].value.name;
    this.mdlVelocity = this.mdlVelocities[0].value;
    this.mdlPay = '';
  }

  handleHelp() {
    this.backupParams();
    this._router.navigate(['/help']);
  }

  handleBrowsers() {
    this.backupParams();
    this._router.navigate(['/browsers']);
  }

  handleTax() {
    if (this.validCalcParams()) {
      this.logMsgAll('tax parameters is valid', '@CalcComponent@ghandleTax');
      this.logMsgAll('cargo tax ...', '@CalcComponent@ghandleTax');
      this.backupParams();

      this._progressDialog.show();
      this._progressDialog.title = 'Расчет тарифа ...';
      this._progressDialog.queryProgress = true;
      this._progressDialog.width = 200;
      this._mdlBlockUI = true;
      this.detectChanges();
            
      this.queryCalcStatus = QUERY_STATUS.Running;
      this._startMoment = Date.now();
      this._taxSubscription = this._calcService.get().subscribe((calcResp: ICalcRepItems) => this.setTax(calcResp), error => this.errorTax(error), () => this.finishTax());

      setTimeout(() => {
        if (this.queryCalcStatus === QUERY_STATUS.Running) {
          this._taxSubscription.unsubscribe();
          this.logDebug = 'подписка получения таксировки отписана';          
          this.queryCalcStatus = QUERY_STATUS.Error;
          this.logMsgAll('превышен интервал ожидания ожидания результатов расчета платы', '@CalcComponent@ghandleTax');
          this._errorDialog.show();
          this._errorDialog.mdlText = this._validService.errorMsgs.timeoutExceededRoute;
          this._progressDialog.display = false;
          this._mdlBlockUI = false;
          this.detectChanges();
        }
      }, this.calcTimeout);

    } else { // выдача сообщения если неправильные параметры
      this.logMsgAll('невалидны параметры расчета платы за перевозку груза', '@CalcComponent@ghandleTax');
      this._errorDialog.mdlText = this._validService.getErrorMsg();
      this._errorDialog.show();
    }
  }

  errorTax(error: any) {
    this.queryCalcStatus = QUERY_STATUS.Error;
    this.logDebug = 'ошибка таксировки груза'
    this.logDebugValue = error; 
    
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.invalidCalc;
    this._progressDialog.display = false;
    this._mdlBlockUI = false;
  }

  finishTax(){
    this.logMsgAll('cargo tax finished', '@CalcComponent @ghandleTax');
    this._taxSubscription.unsubscribe();
    this.logDebug = 'подписка получения таксировки отписана'; 
    this._finishMoment = Date.now();
    this.logMsgAll(`time cargo tax = ${(this._finishMoment - this._startMoment) / 1000}s`, '@CalcComponent@setCalcRes');
    this._progressDialog.queryProgress = false;
    this._progressDialog.close();
    this._mdlBlockUI = false;
    this.detectChanges();
  }

  validCalcParams(): boolean {
    this._validService.clearValidCalcParams();
    if (this._validService.isEmptyCode(this._mdlOutStationCode)) {
      this._validService.validCalcParams.outStation = false;
    }
    if (this._validService.isEmptyCode(this._mdlDestStationCode)) {
      this._validService.validCalcParams.inStation = false;
    }
    if (this._mdlOutCountryCode !== '112' || this._mdlDestCountryCode !== '112') {
      if (this._validService.isEmptyCode(this._mdlGngCode)) {
        this._validService.validCalcParams.Gng = false;
      }
    }
    if (this._validService.isEmptyCode(this._mdlEtsngCode)) {
      this._validService.validCalcParams.Etsng = false;
    }
    if (this._validService.isNegative(this._mdlCargoWeight)) {
      this._validService.validCalcParams.cargoWeight = false;
    }
    if (this._validService.isNegative(this._mdlWagCapacity)) {
      this._validService.validCalcParams.wagCapacity = false;
    }
    // если выбрана порожняя контейнерная отправка то вес груза в 0

    // ЕТСНГ и вес груза 
    // для  грузов  421,422,423 кроме 421091   вес = 0
    // для остальных грузов и 421091   всегда  вес > 0
    if ((this._mdlEtsngCode.startsWith('421') || this._mdlEtsngCode.startsWith('422') || this._mdlEtsngCode.startsWith('423')) && this._mdlEtsngCode !== '421091') {
      if (Number.parseFloat(this._mdlCargoWeight) > 0) {
        this._validService.validCalcParams.cargoWeight = false;
      }
    } else {
      if (this.svoCode === '6') {
        this._mdlCargoWeight = '0';
      } else {
        if (Number.parseFloat(this._mdlCargoWeight) === 0) {
          this._validService.validCalcParams.cargoWeight = false;
        }
      }
    }

    if ((this.svoCode === '5' || this.svoCode === '6') // проверка корректности данных контейнерной отправки
      && (this._mdlFoot === '0' || this._mdlContCol === '' || this._mdlContCol === '0')) {
      this._validService.validCalcParams.foot = false;
    }
    if ((this.svoCode === '5' || this.svoCode === '6') // проверка корректности данных контейнерной отправки
      && (this._mdlContPayload === undefined || this._mdlContPayload === '' || this._mdlContPayload === '0')) {
      this._validService.validCalcParams.contPayload = false;
    }
    if ((this.svoCode === '5' || this.svoCode === '6') // проверка корректности данных контейнерной отправки
      && (this._mdlContCol === '' || this._mdlContCol === '0')) {
      this._validService.validCalcParams.contCol = false;
    }
    if (this._validService.validCalcParams.foot && this._validService.validCalcParams.contPayload) {
      this._validService.validCalcParams.footContPayload = false;
    }
    return this._validService.isValidCalcParams();
  }

  enableSpecMarks(): boolean {
    this._validService.clearValidCalcParams();
    if (this._validService.isEmptyCode(this._mdlOutStationCode)) {
      this._validService.validCalcParams.outStation = false;
    }
    if (this._validService.isEmptyCode(this._mdlDestStationCode)) {
      this._validService.validCalcParams.inStation = false;
    }
    if (this._mdlOutCountryCode !== '112' || this._mdlDestCountryCode !== '112') {
      if (this._validService.isEmptyCode(this._mdlGngCode)) {
        this._validService.validCalcParams.Gng = false;
      }
    }
    if (this._validService.isEmptyCode(this._mdlEtsngCode)) {
      this._validService.validCalcParams.Etsng = false;
    }
    return this._validService.isValidCalcParams();
  }

  setTax(resp: any) {
    this.logDebug = 'ответ расчета...';
    this.logDebugValue = resp;
   
    this.queryCalcStatus = QUERY_STATUS.Completed;
    this._cacheService.defaultValues = false;
    if (resp !== undefined && resp.length > 0) { // есть результаты расчета
      this._calcService.copyTax(resp);
      this.mdlPay = this._calcService.Pay;
      this.payChanged();
      this.detectChanges();
    } else { // ответ расчета пришел пустым объектом
      this._errorDialog.show();
      this._errorDialog.mdlText = this._validService.errorMsgs.emptyCalc;
    }
  }

  payChanged(){
    if (this._mdlPay === '' || this._mdlPay === '0' || this._mdlPay === undefined){
      this._mdlPayFilled = '';
    } else {
      this._mdlPayFilled = 'highlight';
    }
  }

  handleFullRep() {
    this._calcService.Pay = this._mdlPay;
    this.backupVisiblePanels();
    this.backupDisabledControls();
    this._router.navigate(['/rep']);
  }

  //=== вспомогательные функции ===

  isPureWord(s: string, lex: string) {  // поиск в имени ГНГ лексемы пользователя или что-то близкое
    let pure_: boolean = false;
    var buf_ = s.split(/[ .,-;:]/);
    for (let i = 0; i < buf_.length; i++) {
      if (buf_[i].toLocaleLowerCase() === lex.toLocaleLowerCase()) {
        pure_ = true;
      }
    }
    if (!pure_) { // ищем близость к чистому слову
      let buff: string = buf_[0].toLocaleLowerCase();
      let lexx: string = lex.toLocaleLowerCase();

      if (buff.indexOf(lexx) == 0 && ((buff.length - lexx.length) <= 1)) {
        pure_ = true;
      }
    }
    return pure_;
  }

  closeProgress() {
    this._progressDialog.queryProgress = false;
    setTimeout(() => {
      this._progressDialog.close();
      this._mdlBlockUI = false;
    }, 2000);
  }


  validRouteParams() {
    if (this._mdlOutCountryCode !== undefined && this._mdlDestCountryCode !== undefined) {

      if (this._mdlOutStationCode.length === 6 && this._mdlDestStationCode.length === 6 &&
        this._mdlDestStationCode !== '999999' && this._mdlOutStationCode !== '999999'
        && this._mdlOutCountryCode.length > 0 && this._mdlDestCountryCode.length > 0) {
        return true;

      } else {
        return false;
      }
    }
  }


  performCreateRoute(outStationCode: string, destStationCode: string, inRW?: string, outRW?: string) { // расчет маршрута
    this.logDebug = '@CalcComponent @performCreateRoute'

    let _destCountryCode: string = this._mdlDestCountryCode; // подмена страны в форме
    this.logDebug = '';
    if (inRW === undefined) {
      inRW = '';
    }
    if (outRW === undefined) {
      outRW = '';
    }
    if (this._mdlContCol === undefined) {
      this._mdlContCol = '0';
    }
    if (this._destStationIsJoint) {// если станция стык, наплевтаь на страну в форме
      this.logDebug = 'станция назначения = стык';
      let Country = this.getCountry(destStationCode);
      this.logDebug = 'country = ' + Country;
      _destCountryCode = String(Country.kod);
    } 
    if (this.validRouteParams()) {
      let selectedSpecMarks: number = 0;
      if (this.mdlSelectedSpecMarks.length > 0) {
        selectedSpecMarks = this.mdlSelectedSpecMarks[0].id;
      }

      this.logDebug = 'inRW = ' + inRW;
      this.logDebug = 'outRW = ' + outRW;

      let _Params: RouteCalcParams = new RouteCalcParams(outStationCode, destStationCode, this._mdlOutCountryCode, _destCountryCode,
        this._mdlContCol, this._mdlFoot, this._mdlContPayload, selectedSpecMarks, this.svoCode, inRW, outRW, this.date, String(this.currencyCode));
      
      this.logMsgAll('form route ...', '@CalcComponent@performCreateRoute');
      this.queryRouteStatus = QUERY_STATUS.Running;
      this._startMoment = Date.now();
      this._progressDialog.show();
      this._progressDialog.title = 'Формирование маршрута ...';
      this._progressDialog.queryProgress = true;
      this._progressDialog.width = 300;
      this._mdlBlockUI = true;
      this.detectChanges();

      let _query = this._routeService.get(_Params);
      this._routeSubscription = _query.subscribe(respRoute => this.setRoute(respRoute), error => this.errorRoute(error), () => this.finishRoute() );

      setTimeout(() => {
        if (this.queryRouteStatus === QUERY_STATUS.Running) {
          this.logMsgAll('превышен интервал ожидания результата формирования маршрута', '@CalcComponent@performCreateRoute');
          this._routeSubscription.unsubscribe();
          this.queryRouteStatus = QUERY_STATUS.Error;
          this._errorDialog.show();
          this._errorDialog.mdlText = this._validService.errorMsgs.timeoutExceededRoute;
          this._progressDialog.display = false;
          this._mdlBlockUI = false;
          this.detectChanges();
        }
      }, this.routeTimeout);
    } else {
      this.logInfo = 'параметры формирования маршрута невалидны';
      this.logInfo = 'формирование маршрута произведено не будет';
    }
  }

  finishRoute(){
    this._routeSubscription.unsubscribe();
    this.logDebug = 'подписка на формирование маршрута отписана';
    this.logMsgAll('form route finished', '@CalcComponent@performCreateRoute');
    this._progressDialog.queryProgress = false;
    this.queryRouteStatus = QUERY_STATUS.Completed;
    this._progressDialog.close();
    this._mdlBlockUI = false;
    this.detectChanges();
    this._finishMoment = Date.now();
    this.logMsgAll(`time form route = ${(this._finishMoment - this._startMoment) / 1000}s`, '@CalcComponent@setRoute');
  }

  errorRoute(Error) {
    this.queryRouteStatus = QUERY_STATUS.Error;
    this.logMsgAll('ошибка формирования маршрута: ' + Error, '@CalcComponent@errorRoute');
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.errorRoute;
    this._progressDialog.display = false;
    this._mdlBlockUI = false;
  }

  setRoute(respRoute: IRoute | any) { // подцепливаем стыки, расстояние и маршрут по выходной станции
    this.logDebug = '@CalcComponent @setRoute';
    this.logDebug = 'чистый ответ сервера';
    this.logDebugValue = respRoute;

    if (respRoute === undefined || respRoute === null || respRoute.error !== '') {
      this._errorDialog.show();
      this._errorDialog.mdlText = this._validService.errorMsgs.invalidRouteQuery;
    } else {
      if (respRoute.totalDist === '') { // маршрут пустой вернулся
        this._errorDialog.show();
        this._errorDialog.mdlText = this._validService.errorMsgs.emptyRoute;
      } else {
        this._btnRouteDisplay = true;

        if (this.mdlOutCountryCode !== '112' && this.mdlDestCountryCode === '112') { // если перевозка не БЧ - БЧ, то гасим выходной стык
          respRoute.outJointCode = '';
          respRoute.outJoint = '';
        }
        if (this.mdlOutCountryCode === '112' && this.mdlDestCountryCode === '112') { // перевозка БЧ - показываем расстояние по БЧ
          this._belDistDisplay = false;
        } else {
          this._belDistDisplay = true;
        }
        if (respRoute.outParagraf !== '' && respRoute.outParagraf !== undefined) {
          this._btnOutStationParagrafDisabled = false;
        } else {
          this._btnOutStationParagrafDisabled = true;
        }
        if (respRoute.destParagraf !== '' && respRoute.destParagraf !== undefined) {
          this._btnDestStationParagrafDisabled = false;
        } else {
          this._btnDestStationParagrafDisabled = true;
        }
        if (this.visibleTransitPanel) {
          this._btnReverseStationsDisabled = true;
        } else {
          this._btnReverseStationsDisabled = false;
        }
        this._routeService.copyRespRoute(respRoute);
        this.mdlPay = '';

        // если станций нечетно в маршруте
        // блокируем кнопку парного маршрута
        if (this._validService.isEven(respRoute.stations.length)){
          this._btnPairRouteDisplay = true;
        } else {
          this._btnPairRouteDisplay = false;
        }
    
        if (this._mdlSurrenderJoint == '' || this._mdlSurrenderJoint == undefined){
          if (respRoute.outJoint !== undefined && respRoute.outJoint !== '') { // для транзита пишем второй стык в панель, но не всегда
            this._mdlSurrenderJoint = respRoute.outJoint;
            this._mdlSurrenderJointCode = respRoute.outJointCode;
            this.fillSurrenderJoint();
          }
        }
      }
    }
  }

  getEtsngWithGng() {
    this.logDebug = '@CalcComponent @getEtsngWithGng()';

    let respEtsng: any;
    let regExp2: RegExp;
    let regExp3: RegExp;
    this.etsngSuggestions = [];
    this.logDebugValue = this._mdlEtsng;
    if (this._validService.isNumber(this._mdlEtsng)) {
      this.logDebug = 'маски ...';
      this.logDebugValue = this._BufferMasks;
      this._BufferMasks.forEach(maskItem => {
        this.logDebug = 'итерация по маскам ...';
        this.logDebugValue = maskItem;

        regExp2 = new RegExp(`^(?=^${maskItem.kod_etsng})\\S{6}$`);
        this.logDebugValue = regExp2;
        respEtsng = this.cacheEtsngs.find({ '_id': regExp2 });
        this.logDebugValue = respEtsng;

        respEtsng.forEach(item2 => {
          if (item2._id.indexOf(this.mdlEtsng) === 0) {
            this.logDebug = 'добавляем = ';
            this.logDebugValue = item2;
            let buf: string = `${item2._id} ${item2.name.trim()}`;
            this.etsngSuggestions.push(buf);
          }
        }
        );
      })
    } else {
      this._BufferMasks.forEach((item: any) => {
        regExp2 = new RegExp(`^(?=^${item.kod_etsng})\\S{6}$`);
        regExp3 = new RegExp(`^${this._mdlEtsng.charAt(0).toLocaleUpperCase()}${this._mdlEtsng.substr(1, this._mdlEtsng.length - 1)}`);
        respEtsng = this.cacheEtsngs.find({ '_id': regExp2, 'name': regExp3 });
        this.logDebugValue = regExp2;
        this.logDebugValue = regExp3;
        this.logDebugValue = respEtsng;
        respEtsng.forEach(Item2 => {
          let obj = { kod: Item2._id, name: Item2.name.trim() };
          let lexem = `${obj.kod} ${obj.name.trim()}`;
          if (this.etsngSuggestions.indexOf(lexem) === -1) {
            this.etsngSuggestions.push(`${Item2._id} ${Item2.name.trim()}`);
          }
        }
        );
      })
    }
  }

  getEtsngNoGng() {
    let RespEtsng: any;
    let regExp: RegExp;
    if (this._mdlOutCountryCode === '112' && this._mdlDestCountryCode == '112') {
      this.etsngSuggestions = [];
      if (this._validService.isNumber(this._mdlEtsng)) {
        regExp = new RegExp('^' + this._mdlEtsng);
        RespEtsng = this.cacheEtsngs.find({ '_id': regExp });
        RespEtsng.forEach(Item => {
          if (Item._id.indexOf(this.mdlEtsng) === 0) {
            this.etsngSuggestions.push(`${Item._id} ${Item.name.trim()}`);
          }
        }
        );
      } else {
        regExp = new RegExp('^' + this._mdlEtsng.charAt(0).toLocaleUpperCase() + this._mdlEtsng.substr(1, this._mdlEtsng.length - 1));
        RespEtsng = this.cacheEtsngs.find({ 'name': regExp });
        RespEtsng.forEach(Item => {
          let lexem = `${Item._id} ${Item.name.trim()}`;
          if (this.etsngSuggestions.indexOf(lexem) === -1) {
            this.etsngSuggestions.push(lexem);
          }
        }
        );
      }
    } else {
      this._errorDialog.show();
      this._errorDialog.mdlText = this._validService.errorMsgs.Gng;
      setTimeout(() => { // непонятный глупый прием
        this._mdlEtsng = '';
        this._mdlEtsngCode = '';
      }, 1000);
    }
  }

  filterEtsng() {
    if (this._mdlGng !== '' && this._mdlGng !== undefined) {
      this.getEtsngWithGng();
    } else { // ГНГ не задали
      this.getEtsngNoGng();
    }
  }

  handleSelectEtsng() {
    let _posSpace = this._mdlEtsng.indexOf(' ');
    this._mdlEtsngCode = this._mdlEtsng.substr(0, _posSpace).trim();
    this._mdlEtsng = this._mdlEtsng.substr(_posSpace).trim();
    this._calcService.etsngCode = this._mdlEtsngCode;
    this._calcService.Etsng = this._mdlEtsng;
    if (this._mdlEtsngCode === '691005') { // ввели ЕТСНГ домашние вещи без ГНГ
      this._mdlGngCode = '99010000';       // ГНГ подставляем
      this._mdlGng = 'Вещи при переезде';
    }
    if (this._mdlEtsng !== '') {
      setTimeout(()=> { this._mdlEtsngFilled = 'highlight';
                        this._mdlEtsngCodeFilled = true;
                      }, 100);
    }
  }

  handleChangeEtsng() {
    this._mdlEtsngCode = '';
    this.mdlPay = '';
    if (this._mdlEtsng === '') {
      setTimeout(()=> { this._mdlEtsngFilled = '';
                        this._mdlEtsngCodeFilled = false;
                      }, 100);
    }
  }

  checkFillEtsng(){
    if (this._mdlEtsng !== '' && this._mdlEtsng !== undefined) {
      setTimeout(()=> { this._mdlEtsngFilled = 'highlight';
                        this._mdlEtsngCodeFilled = true;
                      }, 100);
    }
  }

  handleFocusEtsng() {
    if (this._mdlGng !== '' && this._mdlGng !== undefined && this._mdlEtsng === '') {
      this.getEtsngWithGng();
      this._etsngRef.show();
    }
  }

  handleChangeCargoWeight() {
    this.logDebug = '@CalcComponent @handleCargoWeightChange';
    this.mdlPay = '';
    if (this.svoCode === '6') {
      if (Number.parseInt(this._mdlCargoWeight) !== 0) {
        this._errorDialog.mdlText = this._validService.errorMsgs.cargoWeightEmptyContSvo;
        this._errorDialog.show();
        setTimeout(() => { // непонятный глупый прием
          this._mdlCargoWeight = '0';
        }, 1000);
      }
    }
    this.checkFillCargoWeight();
  }

  checkFillCargoWeight() {
    if (this.mdlCargoWeight === '' || this.mdlCargoWeight === '0' || this.mdlCargoWeight === undefined ) {
      setTimeout(()=> { this._mdlWeightCargoFilled = false; }, 100);
    } else {
      setTimeout(()=> { this._mdlWeightCargoFilled = true; }, 100);
    }
  }

  filterGng(event) {
    let Resp: any;
    let regExp: RegExp;
    if (this._validService.isNumber(this._mdlGng)) {
      regExp = new RegExp('^' + this._mdlGng);
      Resp = this.cacheGngs.find({ '_id': regExp });
    } else {
      // tslint:disable-next-line:max-line-length
      regExp = new RegExp('^' + this._mdlGng.charAt(0).toLocaleUpperCase() + this._mdlGng.substr(1, this._mdlGng.length - 1));
      Resp = this.cacheGngs.find({ 'name': regExp });
    }
    this.gngSuggestions = [];
    Resp.forEach(Item => {
      if (Item.kod !== undefined && Item.bh1 !== null) {
        this.gngSuggestions.push(`${Item._id} ${Item.name}`)
      }
    });
  }

  handleSelectGng() {
    this.logDebug = 'handleSelectGng()';

    this._mdlGngCode = this._mdlGng.substr(0, 8).trim();
    this._mdlGng = this._mdlGng.substr(8).trim();
    let respGngs: any = this.cacheGngs.find({ '_id': this._mdlGngCode });
    this._shadowEtsngCode = respGngs[0].bh1.toString();
    this.logDebug = 'this._shadowEtsngCode = ' + respGngs[0].bh1.toString();

    this._calcService.gngCode = this._mdlGngCode;
    this._calcService.Gng = this._mdlGng;

    this.setEtsngHint();
    //this._etsngDisabled = false;
    if (this._mdlGng !== '') {
      setTimeout(()=> { this._mdlGngFilled = 'highlight';
                        this._mdlGngCodeFilled = true;
                      }, 100);
    }
  }

  setEtsngHint() { // формируем подсказку
    this.logDebug = 'setEtsngHint()';
    let regExp: RegExp = new RegExp('^' + this._mdlGngCode);
    this._BufferMasks = this.cacheMasks.find({ 'kod_gng': regExp });
    this._mdlHintEtsng = '';
    this.logDebug = 'проход по маскам...';
    this._BufferMasks.forEach(item => {
      this.logDebugValue = item;
      if (this._mdlHintEtsng.indexOf(item.kod_etsng) === -1) {
        this._mdlHintEtsng = this._mdlHintEtsng + `${item.kod_etsng}* `;
      }
    }
    );
    this.logDebug = 'буферные маски...';
    this.logDebugValue = this._BufferMasks;
    this._mdlHintEtsng = `позиции ${this._mdlHintEtsng.trim()}`;
  }

  handleFootChange(event) {
    this.logDebug = '@CalcComponent @handleFootChange()';
    if (event !== undefined) {
      this._mdlFoot = event.value.code;
    } else {
      this._mdlFoot = this.mdlFootItem.code;
    }
    this.mdlPay = '';
    switch (this._mdlFoot) {
      case '0': {
        const Resp = this.cacheContTypes.find({ 'kod': { $gte: 0 } });
        const defValue: any = Resp.filter(Item => Item.kod === 0);
        this.mdlContTypeCode = defValue[0].kod;
        this.mdlContType = defValue[0].tip;
        break;
      }
      case '20': {
        this.mdlContPayload = '20';
        break;
      }
    }

  }
  
  getCountry(stationCode: string): any {
    this.logDebug = '@CalcComponent @getCountry'
    let idResp: any = this.cacheIdCountries.find({ $and: [{ low_range: { "$lte": stationCode } }, { up_range: { "$gte": stationCode } }] });
    let idCountry = idResp[0].id;
    let regExp: RegExp = new RegExp('^' + idCountry);
    //let resp: any = this.cacheCountries.find({ 'id': regExp }); // поиск страны
    let resp: any = this.cacheCountries.find({ 'id': { $eeq: idCountry } }); // поиск страны
    this.logDebugValue  = resp;
    return resp[0];
  }

  isStationRB() : boolean {
    return this._calcService.isStationRB(this._mdlOutCountryCode, this._mdlDestCountryCode);
  }

  getOutCountry(code: string) {
    this.logDebug = '@CaclComponent @getOutCountry';

    this.mdlBelDist = '';
    this.mdlTotalDist = '';
    this.mdlOutParagraf = '';
    this.mdlDestParagraf = '';
    this._routeService.route.stations = [];

    let Country = this.getCountry(code);
    this._mdlOutCountry = String(Country.name);
    this._mdlOutCountryCode = String(Country.kod);
    
    if (this.isStationRB()) {
      this._visibleControlsService.visibleTransitPanel = false;
      this._routeService.type = RouteType.Standart;
      this._btnReverseStationsDisabled = false;
      this.visibleTransitPanel = false;
      this.performCreateRoute(this._mdlOutStationCode, this._mdlDestStationCode);
    } else {
      this.logDebug = 'станции не БЧ, маршрут не формируем';
      this.visibleTransitPanel = true;
      this._btnReverseStationsDisabled = true;

      // сброс стыков
      this._mdlReceptionJoint = '';
      this._mdlReceptionJointCode = '';
      this._mdlSurrenderJoint = '';
      this._mdlSurrenderJointCode = '';
    }
  }

  getDestCountry(code: string) {
    this.logDebug = '@CalcCokmponent @getDestCountry';
    this.mdlBelDist = '';
    this.mdlTotalDist = '';
    this.mdlOutParagraf = '';
    this.mdlDestParagraf = '';
    this._routeService.route.stations = [];

    let Country = this.getCountry(code);
    this.logDebug = 'country = ' + Country;

    this._mdlDestCountry = String(Country.name);
    this._mdlDestCountryCode = String(Country.kod);
    
    if (this.isStationRB()) {
      this.visibleTransitPanel = false;
      this._routeService.type = RouteType.Standart;
      this.visibleTransitPanel = false;
      this._btnReverseStationsDisabled = false;
      this.performCreateRoute(this._mdlOutStationCode, this._mdlDestStationCode);
    } else {
      this.logDebug = 'станции не БЧ, маршрут не формируем';
      this.visibleTransitPanel = true;
      this._btnReverseStationsDisabled = true;

      this._mdlReceptionJoint = '';
      this._mdlReceptionJointCode = '';
      this._mdlSurrenderJoint = '';
      this._mdlSurrenderJointCode = '';
    }
    this.logDebugValue = this._mdlDestCountryCode;
  }

  getReceptionJointCountry(code: string) {
    this.logDebug = '@CalcCokmponent @getReceptionJointCountry';
    if ((this._mdlReceptionJointCode.length === 0 && this._mdlSurrenderJointCode.length === 0) ||
      (this._mdlReceptionJointCode.length === 0 && this._mdlSurrenderJointCode.length === 6)) {
      this.logInfo = 'стыки заданы некорректно';
      this.logInfo = 'формирование маршрута произведено не будет';
    } else {
            //this.performCreateRoute(this._mdlOutStationCode, this._mdlDestStationCode, this._mdlReceptionJointCode);
    }

  }

  getSurrenderJointCountry(code: string) {
    this.logDebug = '@CalcCokmponent @getSurrenderJointCountry';
    if ((this._mdlReceptionJointCode.length === 0 && this._mdlSurrenderJointCode.length === 0) ||
      (this._mdlReceptionJointCode.length === 0 && this._mdlSurrenderJointCode.length === 6)) {
      this.logInfo = 'стыки заданы некорректно';
      this.logInfo = 'формирование маршрута произведено не будет';
    } else {
      // this.performCreateRoute(this._mdlOutStationCode, this._mdlDestStationCode, this._mdlReceptionJointCode, this._mdlSurrenderJointCode);
    }
  }
  

  filterStations(event) {
    let Resp: any;
    let regExp: RegExp;
    if (this._validService.isNumber(event.query)) {
      if (event.query > 5) {
        event.query = event.query.substr(0, 5);
      }
      regExp = new RegExp('^' + event.query);
      Resp = this.cacheStations.find({ '_id': regExp });

    } else {
      // tslint:disable-next-line:max-line-length
      regExp = new RegExp('^' + event.query.charAt(0).toLocaleUpperCase() + event.query.substr(1, event.query.length - 1));
      Resp = this.cacheStations.find({ 'name': regExp });
    }
    this.stationSuggestions = [];
    Resp.forEach(Item => this.stationSuggestions.push(`${Item._id} ${Item.name}`));
  }

  filterDestStations(event) {
    this._mdlReceptionJoint = '';
    this._mdlReceptionJointCode = '';
    this._mdlSurrenderJoint = '';
    this._mdlSurrenderJointCode = '';
    this.filterStations(event);
    if (this.stationSuggestions.length > 0) {
      this.mdlDestCountry = '';
      this.mdlDestCountryCode = '';
      this.mdlDestStationCode = '';
      this.visibleTransitPanel = false;
      this.mdlTotalDist = '';
      this.mdlBelDist = '';
      this.mdlOutParagraf = '';
      this.mdlDestParagraf = '';
    }
  }

  filterOutStations(event) {
    this._mdlReceptionJoint = '';
    this._mdlReceptionJointCode = '';
    this._mdlSurrenderJoint = '';
    this._mdlSurrenderJointCode = '';
    this.filterStations(event);
    if (this.stationSuggestions.length > 0) {
      this.mdlOutCountry = '';
      this.mdlOutCountryCode = '';
      this.mdlOutStationCode = '';
      this.visibleTransitPanel = false;
      this.mdlTotalDist = '';
      this.mdlBelDist = '';
      this.mdlOutParagraf = '';
      this.mdlDestParagraf = '';
    }
  }

  filterCountries(event) {
    let resp: any;
    let regExp: RegExp;
    this.logDebug = '@CalcComponent @filterCountries';
    if (this._validService.isNumber(event.query)) {
      if (event.query > 3) {
        event.query = event.query.substr(0, 3);
      }
      regExp = new RegExp('^' + event.query);
      resp = this.cacheCountries.find({ 'kod': regExp });
    } else {
      // tslint:disable-next-line:max-line-length
      regExp = new RegExp('^' + event.query.substr(0, event.query.length - 1).toLocaleUpperCase());
      resp = this.cacheCountries.find({ 'name': regExp });
      this.logDebug = 'regExp = ' + regExp;
      this.logDebugValue = resp;
    }
    this.countrySuggestions = [];
    resp.forEach(item => this.countrySuggestions.push(`${item.kod} ${item.name}`));
  }

  filterOutCountries(event) {
    this.filterCountries(event);
  }

  filterDestCountries(event) {
    this.filterCountries(event);
  }

  filterJoints(event) {
    let resp: any = undefined;
    let regExp: RegExp;
    if (this._validService.isNumber(event.query)) {
      if (event.query > 5) {
        event.query = event.query.substr(0, 5);
      }
      regExp = new RegExp('^' + event.query);
      resp = this.cacheStations.find({ $and: [{ _id: regExp }, { _id: { "$gte": "130000" } }, { _id: { "$lt": "170000" } }, { type: { "$ne": 0 } }] });
    } else {
      try {
        regExp = new RegExp('^' + event.query.charAt(0).toLocaleUpperCase() + event.query.substr(1, event.query.length - 1));
        resp = this.cacheStations.find({ $and: [{ 'name': regExp }, { _id: { "$gte": "130000" } }, { _id: { "$lt": "170000" } }, { type: { "$ne": 0 } }] });
      }
      catch (error){
        this.logInfo = 'регулярное выражение поиска некорректно';
        this.logInfo = 'поиск стыка не будет произведен';
      }
    }
    this.stationSuggestions = [];
    if (resp !== undefined){
      resp.forEach(item => this.stationSuggestions.push(`${item._id} ${item.name}`));
    }
  }

  fillAllJointsSuggestions(){
    let resp: any = this.cacheStations.find({ $and: [{ _id: { "$gte": "130000" } }, { _id: { "$lt": "170000" } }, { type: { "$ne": 0 } }] });
    if (resp !== undefined){
      resp.forEach(item => this.stationSuggestions.push(`${item._id} ${item.name}`));
    }
  }

  handleReceptionJointDropdown(receptionJoint){
    this._stationSuggestions = [];
    setTimeout(() => { this.fillAllJointsSuggestions();
                       receptionJoint.focusInput(); 
                       receptionJoint.show();
                      } , 100);
  }                    

  handleSelectReceptionJoint() {
    this._mdlReceptionJointCode = this._mdlReceptionJoint.substr(0, 6);
    this._mdlReceptionJoint = this._mdlReceptionJoint.substr(6, this._mdlReceptionJoint.length - 6);
    this.fillReceptionJoint();
    this.getReceptionJointCountry(this._mdlReceptionJointCode);
    this.performCreateRoute(this._mdlOutStationCode, this._mdlDestStationCode, this._mdlReceptionJointCode, '');
  }

  fillReceptionJoint() {
    let style: string = '';
    if (this._mdlReceptionJoint !== '') {
      style = 'highlight';
    } else {
      this.mdlTotalDist = '';
      this.mdlBelDist = '';
    } 
    setTimeout( ()=> { this._mdlReceptionJointFilled = style; this.detectChanges(); }, 100);
  }
  
  handleReceptionJointChange(){
    this.logDebug = '@CalcComponent handleReceptionJointChange';
    this.fillReceptionJoint();
  }

 
  handleSelectSurrenderJoint() {
    this.logDebug = '@CalcComponent @setSurrenderJoint';

    this._mdlSurrenderJointCode = this._mdlSurrenderJoint.substr(0, 6);
    this._mdlSurrenderJoint = this._mdlSurrenderJoint.substr(6, this._mdlSurrenderJoint.length - 6);
    this.fillSurrenderJoint();
    this.getSurrenderJointCountry(this._mdlSurrenderJointCode);

    //if ((this._mdlReceptionJointCode.length === 0 && this._mdlSurrenderJointCode.length === 0) ||
    //  (this._mdlReceptionJointCode.length === 0 && this._mdlSurrenderJointCode.length === 6)) {
    //  this.logInfo = 'стыки заданы некорректно';
    //  this.logInfo = 'формирование маршрута произведено не будет';
    //} else {

    this.performCreateRoute(this._mdlOutStationCode, this._mdlDestStationCode, this._mdlReceptionJointCode, this._mdlSurrenderJointCode);
  }

  fillSurrenderJoint() {
    this.logDebug = '@CalcComponent @fillSurrenderJoint';
    let style: string = '';
    if (this._mdlSurrenderJoint !== '') {
      style = 'highlight';
    } else {
      this.mdlTotalDist = '';
      this.mdlBelDist = '';
    }
    setTimeout( ()=> { this._mdlSurrenderJointFilled = style; this.detectChanges(); }, 100);
  }

  handleSurrenderJointChange(){
    this.logDebug = '@CalcComponent handleSurrenderJointChange';
    this.fillSurrenderJoint();
  }
  
  handleSurrenderJointDropdown(surrenderJoint){
    this._stationSuggestions = [];
    setTimeout(() => { this.fillAllJointsSuggestions();
                       surrenderJoint.focusInput(); 
                       surrenderJoint.show();
                      } , 100);

  }

  handleSelectOutStation() {
    this.logDebug = '@CalcComponent @setOutStation';
    let regExp: RegExp;
    let resp;
    this._mdlOutStationCode = this._mdlOutStation.substr(0, 6);
    this._mdlOutStation = this._mdlOutStation.substr(6, this._mdlOutStation.length - 6);
    regExp = new RegExp('^' + this._mdlOutStationCode);
    resp = this.cacheStations.find({ '_id': regExp });
    this.logDebug = 'тип станции = ' + resp[0].type;
    this._outStationIsJoint = resp[0].type == 2;
    if (this._outStationIsJoint) {
      this.logDebug = 'станция = стык ';
      this._mdlOutCountryDisabled = false;
    } else {
      this.logDebug = 'станция = не стык ';
      this.getOutCountry(this._mdlOutStationCode);
      this._mdlOutCountryDisabled = true;
    }
    this.checkFillOutStation();    
  }

  checkFillOutStation(){
    if (this.mdlOutStation !== '') {
      setTimeout(()=> { this._mdlOutStationFilled = 'highlight';
                        this._mdlOutStationCodeFilled = true;
                      }, 100);
    }
  }

  handleOutStationChange(){
    this.logDebug = '@CalcComponent @handleOutStationChange';
    if (this.mdlOutStation === '') {
      setTimeout( ()=> { this._mdlOutStationFilled = '';
                         this._mdlOutStationCodeFilled = false;

                         this._mdlOutStationCode = '';
                         this._mdlOutCountry = '';
                         this._mdlOutCountryCode = '';
                        } ,100);
    } 
  }

  handleSelectDestStation() {
    let regExp: RegExp;
    let resp;
    this._mdlDestStationCode = this._mdlDestStation.substr(0, 6);
    this._mdlDestStation = this._mdlDestStation.substr(6, this._mdlDestStation.length - 6);
    regExp = new RegExp('^' + this._mdlDestStationCode);
    resp = this.cacheStations.find({ '_id': regExp });
    if (resp[0].type == 2) {
      this._destStationIsJoint = true;
    } else {
      this._destStationIsJoint = false;
    }
    this.getDestCountry(this._mdlDestStationCode);
    if (this._destStationIsJoint) {
      this.logDebug = 'выходная станция = стык';
      this._mdlDestCountryDisabled = false;
    } else {
      this.logDebug = 'выходная станция = не стык';
      this._mdlDestCountryDisabled = true;
    }
    this.checkFillDestStation();
  }

  checkFillDestStation(){
    if (this.mdlDestStation !== '') {
      setTimeout(()=> { this._mdlDestStationFilled = 'highlight';
                        this._mdlDestStationCodeFilled = true;
                        this.detectChanges();
                      }, 100);
    }
  }

  handleDestStationChange(){
    this.logDebug = '@CalcComponent @handleDestStationChange';
    if (this.mdlDestStation === '') {
      setTimeout( ()=> { this._mdlDestStationFilled = '';
                         this._mdlDestStationCodeFilled = false;

                         this._mdlDestStationCode = '';
                         this._mdlDestCountry = '';
                         this._mdlDestCountryCode = '';
                        } ,100);
    }
  }

  handleSelectOutCountry() {
    this.logDebug = 'handleSelectOutCountry';
    this._mdlOutCountryCode = this._mdlOutCountry.substr(0, 3);
    this._mdlOutCountry = this._mdlOutCountry.substr(3, this._mdlOutCountry.length - 3);
    this.logDebug = 'OutCountryCode = ' + this._mdlOutCountryCode;
    this.logDebug = 'OutCountry = ' + this._mdlOutCountry;
    if (this._outStationIsJoint || this._destStationIsJoint) {
      if (this.isStationRB) { // перерасчет маршрута
        this.performCreateRoute(this._mdlOutStationCode, this._mdlDestStationCode);
      } else {
        this.performCreateRoute(this._mdlOutStationCode, this._mdlDestStationCode, this._mdlReceptionJointCode, this._mdlSurrenderJointCode);
      }
    }
  }

  handleSelectDestCountry() {
    this.logDebug = '@CalcComponent @setInCountry';
    this._mdlDestCountryCode = this._mdlDestCountry.substr(0, 3);
    this._mdlDestCountry = this._mdlDestCountry.substr(3, this._mdlDestCountry.length - 3);
    this.logDebug = 'inCountryCode = ' + this._mdlDestCountryCode;
    this.logDebug = 'inCountry = ' + this._mdlDestCountry;
    if (this._outStationIsJoint || this._destStationIsJoint) {
      if (this.isStationRB) { // перерасчет маршрута
        this.performCreateRoute(this._mdlOutStationCode, this._mdlDestStationCode);
      } else {
        this.performCreateRoute(this._mdlOutStationCode, this._mdlDestStationCode, this._mdlReceptionJointCode, this._mdlSurrenderJointCode);
      }
    }
  }

  onVelocityChange(event) {
    this._mdlVelocityIndex = event.value.id;
  }

  onDiscountChange() {
    this.mdlPay = '';
  }
  
  clearContHightlight(){
    this._mdlContTypeFilled = '';
    this._mdlContPayloadFilled = false;
    this._mdlContColFilled = false;
    this._contOwnershipRef.isHighlight = false;
    this._footRef.isHighlight = false;
    this._contOwnershipRef.setHighlight();
    this._contOwnershipRef.setHighlight();
  }


  onSpecialMarkChange() {
    this.mdlPay = '';
  }

  searchLexemIndex(values, value): number { // выдача из массива индекса полной строки по лексеме
    for (let i: number = 0; i < values.length; i++) {
      if (values[i].indexOf(value.toUpperCase()) === 0 ||
        values[i].indexOf(value) === 0) {
        return i;
      }
    }
    return -1;
  }

  handleWagTypeRowSelect(event) {
    this.copyWagType(event);
    this.mdlPay = '';
    this.mdlWagTypePanelDisplay = false;
    this._mdlWagTypeReadOnly = false;
    if (this.mdlWagType !== '') {
      setTimeout(()=> { this.mdlWagTypeFilled = 'highlight';
                        this.mdlWagCapacityFilled = true;
                        this.mdlPivotsFilled = true;
                        this.detectChanges();
                      }, 100);
                    }                  
  }

  handleCompleteKs() {
    let Resp;
    let regExp: RegExp;
    if (this._validService.isNumber(this.mdlKs)) {
      regExp = new RegExp(this.mdlKs);
      Resp = this.cacheKss.find({ 'kadm': regExp });
    } else {
      regExp = new RegExp(this.mdlKs.toLocaleUpperCase());
      Resp = this.cacheKss.find({ 'name': regExp });
    }
    this.ksSuggestions = [];
    Resp.forEach(item => this.ksSuggestions.push(`${item.name}`));
  }

  handleSelectKs() {
    this.logDebug = '@CalcComponent @handleSelectKs';
    let resp = this.cacheKss.find({ 'name': { $eeq: this.mdlKs } });
    this.mdlKsCode  = resp[0].kadm;
    this.logDebug = 'кс = ' + this.mdlKsCode;
    if (this.mdlKs !== '') {
      setTimeout(()=> { this.mdlKsFilled = 'highlight';
                        this.detectChanges(); 
                      }, 100);
    };
  }
  
  fillAllKsValues(){
    let Resp = this.cacheKss.find({ 'name': { $ne: '' } });
    Resp.forEach(Item => this.ksSuggestions.push(`${Item.name}`));
  }
  
  handleKsDropdown(ks) {
    this._ksSuggestions = [];
    setTimeout(() => { this.fillAllKsValues();
                        ks.focusInput(); 
                        ks.show();
                      } , 100);
  }

  onStationChange(Type: StationType) {
    switch (Type) {
      case StationType.Out: this._mdlOutStationCode = '';
        this._mdlOutCountryCode = '';
        this._mdlOutCountry = '';
        break;
      case StationType.In: this._mdlDestStationCode = '';
        this._mdlDestCountryCode = '';
        this._mdlDestCountry = '';

    }
    this.mdlPay = '';
  }

  onCountryChange(Type: StationType) {
    switch (Type) {
      case StationType.Out: this._mdlOutCountryCode = '';
        break;
      case StationType.In: this._mdlDestCountryCode = '';
    }
    this.mdlPay = '';
  }

  handleChangeGng() {
    this._mdlGngCode = '';
    this._mdlEtsngCode = '';
    this._mdlEtsng = '';
    setTimeout(()=> { this._mdlEtsngFilled = '';
                        this._mdlEtsngCodeFilled = false;
                      }, 100);
    this.mdlPay = '';
    this.mdlHintEtsng = '';
    if (this._mdlGng === '') {
      setTimeout(()=> { this._mdlGngFilled = '';
                        this._mdlGngCodeFilled = false;
                      }, 100);
    }
  }

  checkFillGng(){
    if (this._mdlGng !== '' && this._mdlGng !== undefined) {
      setTimeout(()=> { this._mdlGngFilled = 'highlight';
                        this._mdlGngCodeFilled = true;
                      }, 100);
    }

  }

  handleCompleteContTypes() {
    let Resp: any;
    let regExp: RegExp;
    this.contTypeSuggestions = [];
    if (this.mdlContType.length <= 6) {
      if (this._validService.isNumber(this.mdlContType)) {
        regExp = new RegExp('^' + this.mdlContType);
        Resp = this.cacheContTypes.find({ 'kod': regExp });
      } else {
        regExp = new RegExp('^' + this.mdlContType.toLocaleUpperCase());
        Resp = this.cacheContTypes.find({ 'tip': regExp });
      }
      Resp.forEach(Item => this.contTypeSuggestions.push(`${Item.tip}`));
    }

  }

  handleContTypeDropdown(contType) {
    let univItem, specItem;
    let Resp = this.cacheContTypes.find({ 'kod': { '$gte': 0 } });
    setTimeout(() => {
                        this.contTypeSuggestions = [];
                        Resp.forEach(item => this.contTypeSuggestions.push(`${item.tip}`));
                    
                        // ставим впереди УНИВЕРСАЛЬНЫЙ контейнер
                        univItem = this.contTypeSuggestions[this.contTypeSuggestions.length - 1];
                        this.contTypeSuggestions.unshift(univItem);
                        this.contTypeSuggestions.pop();
                        contType.focusInput();
                        contType.show();
                      }, 100)
  }

  handleSelectContType() {
    this.logDebug = '@CalcComponent @setContType';
    let Resp = this.cacheContTypes.find({ 'tip': { '$eeq': this.mdlContType } });
    this.mdlContTypeCode = Number(Resp[0].kod);
    this.mdlPay = '';
    if (this.mdlContType !== '' && this._isContTabHighlight) {
      setTimeout(()=> { this.mdlContTypeFilled = 'highlight';
                        this.detectChanges();
                      }, 100);
    };
  }

  handleRoute() {
    if (this._mdlOutCountryCode === '112' && this._mdlDestCountryCode === '112') { // скрытие стыков при БЧ
      this._routeComponent.displayJoints = false;
    } else {
      this._routeComponent.displayJoints = true;
    }
    this._routeComponent.show();
  }

  handlePairRoute(){
    if (this._mdlOutCountryCode === '112' && this._mdlDestCountryCode === '112') { // скрытие стыков при БЧ
      this._routePairComponent.displayJoints = false;
    } else {
      this._routePairComponent.displayJoints = true;
    }
    this._routePairComponent.show();
  }

  handleCurrencyChange(event: any) {
    this.currencyCode = event.value.id;
    this.Currency = event.value.name;
    this.mdlPay = '';
  }

  handleWagOwnershipChange(event) {
    this.logDebug = '@CalcComponent @handleWagOwnershipChange'
    this.mdlWagOwnershipCode = event.value.id;
    this.mdlPay = '';
    setTimeout(()=> { 
      this.detectChanges();
    }, 100);
  }

  onContOwnershipChange(event) {
    this.mdlContOwnershipCode = event.value.id;
    this.mdlPay = '';
  }

  handleFilteredWagTypes() {
    let filterValues: IWagType[] = [];
    this.mdlWagTypeSuggestions = [];
    //if (this.mdlWagType.length <= 5) {
    let regExp = new RegExp('^' + this.mdlWagType.substr(0, 1).toUpperCase() + this.mdlWagType.substr(1));
    const Resp = this.cacheWagTypes.find({ 'name_web': regExp });
    this.mdlWagTypeSuggestions = [];
    if (this.svoCode === '1') {
      Resp.forEach((Item: IWagType) => filterValues.push(Item));
    } else {
      filterValues = Resp.filter((item: IWagType) => item.pr_knt);
    }
    filterValues.forEach((item: IWagType) => { this.mdlWagTypeSuggestions.push(item.name_web) });
    //}
  }

  handleWagTypeSelect() {
    this.logDebug = '@CalcComponent @handleWagTypeSelect';
    const resp = this.cacheWagTypes.find({ 'name_web': { '$eeq': this.mdlWagType } });
    this.logDebugValue = resp[0];
    this.mdlWagCapacity = resp[0].grp.toString();
    this.mdlPivots = resp[0].osi.toString();
    this._wagTypeListService.Row = resp[0];
    this.mdlPay = '';
    setTimeout(()=> { 
                      this.mdlWagTypeFilled = 'highlight'; 
                      this.detectChanges();
                    }, 100);
  }

  handleWagTypeDropdown() {
    this.logDebug = '@CalcComponent @handleWagTypeDropdown';
    let filterValues: IWagType[] = [];
    this.mdlWagTypeSuggestions = [];
    const resp = this.cacheWagTypes.find({ 'name_web': { $ne: '' } });
    this.logDebugValue = resp;

    this._mdlWagTypeReadOnly = true;
    this.mdlWagTypeTableSuggestions = [];

    if (this.svoCode === '1') {
      resp.forEach((item: IWagType) => filterValues.push(item));
    } else {
      filterValues = resp.filter((item: IWagType) => item.pr_knt);
    }

    
    filterValues.forEach((item: IWagType) => { this.mdlWagTypeTableSuggestions.push(item) });
    this.mdlWagTypePanelDisplay = true;
  }
  
  //------------------------- валидация -------------------------------

  checkCargoWeight(event) {
    if (this._keyService.nonDigitPressed(event)) { // ввели не цифру
      if (!this._keyService.keyIsEnter(event)) {
        this._errorDialog.mdlText = this._validService.errorMsgs.cargoWeight;
        this._errorDialog.show();
        setTimeout(() => { // непонятный глупый прием
          this._mdlCargoWeight = '0';
        }, 1000);
      }
    }
  }

  checkWagCapacity(event) {
    if (this._keyService.nonDigitPressed(event)) { // ввели не цифру
      if (!this._keyService.keyIsEnter(event)) {
        this._errorDialog.mdlText = this._validService.errorMsgs.wagCapacity;
        this._errorDialog.show();
        setTimeout(() => { // непонятный глупый прием
          this._mdlWagCapacity = '0';
        }, 1000);
      }
    }
  }

  checkPivots(event): void {
    if (this._keyService.nonDigitPressed(event)) { // ввели не цифру
      if (!this._keyService.keyIsEnter(event)) {
        this._errorDialog.mdlText = this._validService.errorMsgs.Pivots;
        this._errorDialog.show();
        setTimeout(() => { // непонятный глупый прием
          this._mdlPivots = '0';
        }, 1000);
      }
    }
  }

  checkConductors(event): void {
    if (this._keyService.nonDigitPressed(event)) { // ввели не цифру
      if (!this._keyService.keyIsEnter(event)) {
        this._errorDialog.mdlText = this._validService.errorMsgs.Conductors;
        this._errorDialog.show();
        setTimeout(() => { // непонятный глупый прием
          this._mdlConductors = '0';
        }, 1000);
      }
    }
  }

  handleKeyPressContPayload(event): void {
    if (this._keyService.nonDigitPressed(event)) { // ввели не цифру
      if (!this._keyService.keyIsEnter(event)) { // ввели не цифру
        this._errorDialog.mdlText = this._validService.errorMsgs.ContPayload;
        this._errorDialog.show();
        setTimeout(() => { // непонятный глупый прием
          this._mdlContPayload = '0';
        }, 1000);
      }
    }
  }

  handleKeyPressContCol(event): void {
    if (this._keyService.nonDigitPressed(event)) { // ввели не цифру
      if (!this._keyService.keyIsEnter(event)) { // ввели не цифру
        this._errorDialog.mdlText = this._validService.errorMsgs.contCol;
        this._errorDialog.show();
        setTimeout(() => { // непонятный глупый прием
          this._mdlContCol = '0';
        }, 1000);
      }
    }
  }

  errorGetGng() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptyGngNsi;
  }

  errorGetEtsng() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptyEtsngNsi;
  }

  errorGetEtsngMask() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptyEtsngMasksNsi;
  }

  errorGetStation() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptyStationNsi;
  }

  errorGetOwnership() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptyOwnerships;
  }

  errorGetKss() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptyKss;
  }

  errorGetWagType() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptyWagTypes;
  }

  errorGetContType() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptyContTypes;
  }

  errorGetSvo() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptySvo;
  }

  errorGetSpecialMark() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptySpecialMarks;
  }

  errorGetCountry() {
    this._errorDialog.show();
    this._errorDialog.mdlText = this._validService.errorMsgs.emptyCountries;
  }

  onTest() {
    this._testPanel.show();
  }

  runTests() {
    this._performedTest = 0;
    this._performedSession = 0;
    this.logInfo = '$ старт нагрузочного тестирования...';
    this._startMomentTest = Date.now();
    for (this._curTest = 0; this._curTest < this._testPanel.mdlRunCount; this._curTest++) {
      this.logInfo = `$ старт теста ${this._curTest} ...`;
      this._loginService.get().subscribe(Resp => this.testRun(Resp));
    }
  }

  testRun(Resp) {
    if (Resp.USER !== undefined) { // сесссия получена
      this._loginService.session = Resp.USER[0].UUID;
      this.logInfo = `$ сессия ${this._performedSession} на сервере приложений получена`;
      this._performedSession++;
      this._calcService.getTest().subscribe((calcResp: ICalcRepItems) => this.setTestCalcRes(calcResp), error => this.errorTax(error));
    } else {
      this.logInfo = `$ сессия на сервере ${this._performedTest} приложений не получена`;
    }
  }

  setTestCalcRes(Resp) {
    this.logInfo = `$ тест ${this._performedTest} завершен`;
    if (this._performedTest === this._testPanel.mdlRunCount - 1) {
      this._finishMomentTest = Date.now();
      let testInterval = (this._finishMomentTest - this._startMomentTest) / 1000;
      this.logInfo = `$ длительность нагрузочного тестирования = ${testInterval} с`;
      this.logInfo = `$ среднее время теста  = ${testInterval / this._testPanel.mdlRunCount} с`;
      this.logInfo = '$ тестирование нагрузки завершено';
    }
    this._performedTest++;
  }

  handleShortRep(Event) {
    this._calcService.Pay = this._mdlPay;
    this._shortrepPanel.Show(Event);
  }

  handleClearEtsng() {
    this.setEtsngHint();
    this._mdlEtsng = '';
    this._mdlEtsngCode = '';
    setTimeout(()=> { this._mdlEtsngFilled = '';
                        this._mdlEtsngCodeFilled = false;
                      }, 100);
  }

  setNsiView() {
    this.setOwnershipsView();
    this.setSvoView();
    this.setWagTypeView();
    this.setKsView();
    this.setSpecialMarksView();
    this.detectChanges();
  }

  setOwnershipsView() {
    this._ownershipDisabled = false;
  }

  setWagTypeView() {
    this._wagTypeDisabled = false;
  }
  
  copyWagType(event) {
    this.logDebug = '@CalcComponent copyWagType()';
    if (event !== undefined){
      const dataObj = event.data;
      this.mdlWagType = dataObj.name_web;
      this.mdlWagCapacity = dataObj.grp.toString();
      this.mdlPivots = dataObj.osi.toString();
    } else {
      this.mdlWagType = this.mdlWagTypeRow.name_web;
      this.mdlWagCapacity = this.mdlWagTypeRow.grp.toString();
      this.mdlPivots = this.mdlWagTypeRow.osi.toString();
    }
  }

  setKsView() {
    this._ksDisabled = false;
  }

  setSvoView() {
    this._svoDisabled = false;
  }

  setSpecialMarksView() {
    this._specMarkDisabled = false;
  }

  handleOpenWagTab() {
    this.shadowTabWagonVisible = true;
    this.tabWagVisible = true;
    this._headerWagTab = 'Вагон';
  }

  handleCloseWagTab() {
    this.shadowTabWagonVisible = false;
    this.tabWagVisible = false;
    this.setHeaderWagTab();
  }

  public get mdlSvo(): any {
    return this._svoListService.item  
  }

  public set mdlSvo(value : any) {
    this._svoListService.item = value; 
  }
  
  handleOpenContTab() {
    this.shadowTabContVisible = true;
    this.tabContVisible = true;
  }

  handleCloseContTab() {
    this.shadowTabContVisible = false;
    this.tabContVisible = false;
  }
  
  set shadowTabContVisible(value : boolean){
    this._visibleControlsService.shadowTabContVisible = value; 
  }

  get shadowTabWagVisible() : boolean{
    return this._visibleControlsService.shadowTabWagVisible; 
   }
 
   set shadowTabWagVisible(value : boolean){
     this._visibleControlsService.shadowTabWagVisible = value; 
   }
 

  handleOpenExtendTab(event) {
    this._shadowTabExtendVisible = true;
    this._headerExtendTab = 'Дополнительно';
  }

  handleCloseExtendTab(event) {
    this._shadowTabExtendVisible = false;
    this.setHeaderExtendTab();
  }

  private setHeaderExtendTab() {
    let header = 'Дополнительно';
    /*
    if (!this._shadowTabExtendVisible) {
      if (this.svoItem === undefined) {
        if (this.svos !== undefined) {
          if (this.svos.length >= 0) {
            header = `Дополнительно/ ${this.svos[0].value.name.toLowerCase()}`;
          }
        }
      } else {
       header = `Дополнительно/ ${this.svoItem.name.toLowerCase()}`;
      }
    }*/
    this._headerExtendTab = header;
  }

  formSpecMarkChips() {
    this.mdlSpecMarkChips = '';
    this.mdlSelectedSpecMarks.forEach((item: ISpecMark) => this.mdlSpecMarkChips = this.mdlSpecMarkChips + ', ' + item.name);
    this.mdlSpecMarkChips = this.mdlSpecMarkChips.substr(2);
    if (this.mdlSpecMarkChips === '' || this.mdlSpecMarkChips === undefined) {
      setTimeout(()=> { this.mdlSpecMarksFilled = false;
                        this.mdlPay = '';
                        this.detectChanges();
                      }, 100);
    } else {
      setTimeout(()=> { this.mdlSpecMarksFilled = true;
                        this.mdlPay = '';
                        this.detectChanges();
                      }, 100);

    }
  }

  handleSpecMarkClick() {
    this._specMarkListService.formSpecMarkSuggestions(this._mdlOutCountryCode, this._mdlDestCountryCode, this.svoCode, this.mdlEtsngCode);
    this._mdlSpecMarkPanelDisplay = true;
  }

  handleHideSpecMarkPanel() {
    this.mdlSpecMarkPanelDisplay = false;
    if (this.mdlSelectedSpecMarks.length > 1 && this.mdlSelectedSpecMarks[0].kod === 58 && this.mdlSelectedSpecMarks[1].kod === 58) {
      this.mdlSelectedSpecMarks.shift();
    }
    this.formSpecMarkChips();
  }

  enabledGngEtsng() {
    if (this._mdlOutCountryCode !== '' && this._mdlDestCountryCode !== '') {
      if (this._mdlOutCountryCode === '112' && this._mdlDestCountryCode === '112') {
        this._etsngDisabled = false;
        this._gngDisabled = false;
      } else {
        this._gngDisabled = false;
        this._etsngDisabled = this._mdlGng === '';
      }
    }
  }

  initHintRefs() {
    this._hintRefs = new Map<string, any>();
    this._hintRefs.set('outStation', this._outStationRef);
    this._hintRefs.set('inStation', this._inStationRef);
    this._hintRefs.set('gng', this._gngRef);
    this._hintRefs.set('etsng', this._etsngRef);
    this._hintRefs.set('ks', this._ksRef);
    this._hintRefs.set('contType', this._contTypeRef);
    this._hintRefs.set('specialMarks', this._specialMarkRef);
  }

  getHintElementRef(target: string): any {
    return this._hintRefs.get(target);
  }

  handleMouseEnter(event, target, hint) {
    this.logDebug = '@CalcComponent @handleMouseEnter';
    if (hint !== undefined) {
      if (hint.length > 0) {
        let elementRef: any = target.inputEL;
        let _hint = this._hintService.getHint(elementRef, hint);
        if (_hint.length > 0) {
          this._hintPanel.show(event, _hint);
        }
      }
    }
  }

  handleMouseLeave() {
    this.logDebug = '@CalcComponent @handleMouseLeave';
    this._hintPanel.close();
  }

  handleReverseStations() {
    let bufOutStation: string = this._mdlOutStation;
    let bufOutStationCode: string = this._mdlOutStationCode;
    let bufOutCountryCode: string = this._mdlOutCountryCode;
    let bufOutCountry: string = this._mdlOutCountry;
    this._mdlOutCountry = this._mdlDestCountry;
    this._mdlOutCountryCode = this._mdlDestCountryCode;
    this._mdlOutStation = this._mdlDestStation;
    this._mdlOutStationCode = this._mdlDestStationCode;
    this._mdlDestStationCode = bufOutStationCode;
    this._mdlDestStation = bufOutStation;
    this._mdlDestCountry = bufOutCountry;
    this._mdlDestCountryCode = bufOutCountryCode;
    this.performCreateRoute(this.mdlOutStationCode, this.mdlDestStationCode);
  }

  handleChangeFormPlanWagons() {
    this.logDebug = '@CalcComponent @handleChangeFormPlanWagons';
    this.logDebug = 'this._mdlFormPlanWagons = ' + this._mdlFormPlanWagons;
    if (this._mdlFormPlanWagons === 1) { // ставим svo = контейнерную груженую 
      this.svoCode = '5';
      this.logDebugValue = this.svos;
      const items = this.svos.filter((item: SelectItem) => { return item.value.code === 5 });
      this.logDebugValue = items[0];
      this.svoItem = items[0].value;
      this.performSvoChange();
      this.tabExtendVisible = true;
    }
  }

  modifyParagraf(paragraf: string, separator: string): string[] {
    let arrayParagraf: string[] = paragraf.split('\n');
    let modiParagraf: string[] = [];
    arrayParagraf.forEach((item: string) => {
      let pos = item.indexOf(' ');
      modiParagraf.push(item.substr(0, pos + 1) + '-' + item.substr(pos, item.length - pos));
    });
    return modiParagraf;
  }

  handleOutStationParagraf() {
    this._paragrafPanelComponent.mdlHeader = 'Параграф станции отправления';
    this._paragrafPanelComponent.mdlText = this.modifyParagraf(this._routeService.route.outDetailParagraf, '-');
    this._paragrafPanelComponent.show();
  }

  handleDestStationParagraf() {
    this._paragrafPanelComponent.mdlHeader = 'Параграф станции прибытия';
    this._paragrafPanelComponent.mdlText = this.modifyParagraf(this._routeService.route.destDetailParagraf, '-');
    this._paragrafPanelComponent.show();
  }

  handleChangeWagType(){
    this.logDebug = '@CalcComponent @handleChangeWagType';
    if (this.mdlWagType === '') {
      setTimeout(()=> { this._mdlWagTypeFilled = '';
                        this.detectChanges();
                      }, 100);
    };
    
  } 

  handleWagCapacityChange() {
    this._mdlPay = '';
    this._mdlWagCapacityFilled = true;
  }

  handlePivotsChange() {
    this._mdlPay = '';
    this._mdlPivotsFilled = true;
  }

  handleKsChange(){
    this._mdlPay = '';
    if (this.mdlKs === '') {
      setTimeout(()=> { this._mdlKsFilled = '';
                     
                      }, 100);
    };
  }

  handleConductorsChange() {
    this.mdlPay = '';
    if (this.mdlConductors !== '') {
      setTimeout(()=> { this._mdlConductorsFilled = true;
                        this._mdlPay = '';
                        this.detectChanges();
                      }, 100);
    };
  }

  handleChangeContType(){
    if (this.mdlContType === '') {
      setTimeout(()=> { this._mdlContTypeFilled = '';
                        this.detectChanges();
                      }, 100);
    };
  }

  handleContPayloadChange() {
    setTimeout(()=> {  if (this.mdlContPayload === '' || this.mdlContPayload === '0' || this.mdlContPayload === undefined) {
                          this._mdlContPayloadFilled = false;
                        } else {
                          if (this._isContTabHighlight){
                            this._mdlContPayloadFilled = true;
                          }
                        }
                        this.mdlPay = '';
                        this.detectChanges();
     
                    }, 100);
  }

  handleContColChange() {
    setTimeout( ()=> { if (this.mdlContCol === '' || this.mdlContCol === '0' || this.mdlContCol === undefined) {
                            this._mdlContColFilled = false;
                        }  else {
                          if (this._isContTabHighlight){
                            this._mdlContColFilled = true;
                          }
                        };
                        this.mdlPay = '';
                        this.detectChanges();
                        }, 100);    
   
  }

  handleChangeSvo(){
    this.performSvoChange(); 
  };

  performSvoChange() {
    this.logDebug = '@CalcComponent @performSvoChange';
    this.logDebug = 'this.svoCode = ' + this.svoCode;
    this.logDebug = 'this._mdlReceptionJointCode  = ' + this._mdlReceptionJointCode;
    this.logDebug = 'this._mdlSurrenderJointCode  = ' + this._mdlSurrenderJointCode;

    if (this.svoCode === '5' || this.svoCode === '6') {
      this.tabContVisible = true;
      this.logDebug = '' + this.tabContVisible;
      this.mdlFootItem = this.mdlFootItems[2].value;
      this.handleFootChange(undefined);
    } else {
      this.tabContVisible = false;
    }
    this._calcService.svoCode = this.svoCode;
    this._calcService.svoItem = this.svoItem;
    this.mdlPay = '';

    // side effects
    this.mdlSelectedSpecMarks = [];
    if (this.svoCode === '6') {
      this.mdlCargoWeight = '0';
    }
    this.logDebug = 'this._mdlOutStationCode  = ' + this._mdlOutStationCode;
    this.logDebug = 'this._mdlDestStationCode  = ' + this._mdlDestStationCode;
    this.logDebug = 'isStationRB  = ' + this.isStationRB();

    if (this.isStationRB()) { // перерасчет маршрута
      this.performCreateRoute(this._mdlOutStationCode, this._mdlDestStationCode);
    } else {
      this.performCreateRoute(this._mdlOutStationCode, this._mdlDestStationCode, this._mdlReceptionJointCode, this._mdlSurrenderJointCode);
    }
    // разбираемся с подсветкой введенных значений
    if (this.svoCode === '5' || this.svoCode === '6') { // контроли вкладки Контенйеры не выделяем
      this._isContTabHighlight = true;
      this._contOwnershipRef.isHighlight = true;
      this._footRef.isHighlight = true;
    } else {
      this._isContTabHighlight = false;
      this.clearContHightlight();
    }
    this.detectChanges();
  }
  

  
  
}
