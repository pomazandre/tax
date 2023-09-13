import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import 'rxjs/add/operator/toPromise';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { ButtonModule } from 'primeng/components/button/button';
import { DialogModule } from 'primeng/components/dialog/dialog';
import { InputSwitchModule } from 'primeng/components/inputswitch/inputswitch';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { FieldsetModule } from 'primeng/components/fieldset/fieldset';
import { OverlayPanelModule } from 'primeng/components/overlaypanel/overlaypanel';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { SharedModule } from 'primeng/components/common/shared';
import { SpinnerModule } from 'primeng/components/spinner/spinner';
import { MessagesModule } from 'primeng/components/messages/messages';
import { CheckboxModule } from 'primeng/components/checkbox/checkbox';
import { AccordionModule } from 'primeng/components/accordion/accordion';
import { MenubarModule } from 'primeng/components/menubar/menubar';
import { PanelModule } from 'primeng/components/panel/panel';
import { BlockUIModule } from 'primeng/components/blockui/blockui';
import { DataGridModule } from 'primeng/components/datagrid/datagrid';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { TabMenuModule } from 'primeng/components/tabmenu/tabmenu';
import { ProgressSpinnerModule } from 'primeng/components/progressspinner/progressspinner';
import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';
import { ProgressBarModule } from 'primeng/components/progressbar/progressbar';
import { DataListModule } from 'primeng/components/datalist/datalist';
import { ChipsModule } from 'primeng/components/chips/chips'
import { MultiSelectModule } from 'primeng/components/multiselect/multiselect';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { ListboxModule } from 'primeng/components/listbox/listbox';
import { SelectButtonModule } from 'primeng/components/selectbutton/selectbutton';
import { RadioButtonModule } from 'primeng/components/radiobutton/radiobutton';

import { CalcComponent } from './calc/calc.component';
import { AppComponent } from './app.component';
import { ProgressDialogComponent } from './progress/progress.component';
import { ErrorDialogComponent } from './error/error.component';
import { ErrorNsiDialogComponent } from './errorNsi/errorNsi.component';
import { RoutePanelComponent } from './routePanel/route-panel.component';
import { RoutePairPanelComponent } from './routePairPanel/route-pair-panel.component';
import { TestPanelComponent } from './testPanel/test-panel.component';
import { ShortReportComponent } from './shortReport/short-report.component';
import { HelpComponent } from './help/help.component';
import { BrowsersInfoComponent } from './browsersInfo/browsers.component';
import { FullReportComponent } from './fullReport/full-report.component';
import { HintPanel } from './hint/hint.panel.component';
import { ParagrafPanelComponent } from './paragraf/paragraf.component';
import { OldBuildComponent } from './oldBuild/old-build.component';
import { BoldSpanPipe } from './oldBuild/bold-span.pipe';

import { WagTypesService } from '../services/wag-types.service';
import { OwnershipService } from '../services/ownership.service';
import { KsService } from '../services/ks.service';
import { ContTypesService } from '../services/cont-types.service';
import { SvoService } from '../services/svo.service';
import { SpecMarkService } from '../services/special-mark.service';
import { GngService } from '../services/gng.service';
import { EtsngService } from '../services/etsng.service';
import { EtsngMasksService } from '../services/masks.service';
import { UpdateDbDateService } from '../services/update-db-date.service';
import { StationService } from '../services/station.service';
import { CountryService } from '../services/country.service';
import { RouteService } from '../services/route.service';
import { CalcService } from '../services/calc.service';
import { ValidService } from '../services/valid.service';
import { KeyService } from '../services/key.service';
import { ApiService } from '../services/api.service';
import { HintService } from '../services/hint.service';
import { LogService } from '../services/log.service';
import { StatService } from '../services/stat.service';
import { CacheService } from '../services/cache.service';
import { LoginService } from '../services/login.service';
import { environment } from '../../environments/environment.prod';
import { BUILD, VERSION, BackendVersionService } from '../services/backend-version.service';
import { TariffPolicyService } from '../services/tariff-policy.service';
import { VisibleControlsService } from '../services/visible.service';
import { OwnershipListService } from '../services/ownership-list.service';
import { SvoListService } from '../services/svo-list.service';
import { WagTypeListService } from '../services/wag-type-list.service';
import { ContTypeListService } from '../services/cont-type-list.service';
import { SpecMarkListService } from '../services/spec-mark-list.service';
import { KsListService } from '../services/ks-list.service';
import { HtmlService } from '../services/html.service';

@NgModule({
  imports: [BrowserModule, FormsModule, HttpClientModule, HttpModule, BrowserAnimationsModule,
    InputTextModule, DataTableModule, ButtonModule, DialogModule, DropdownModule,
    CalendarModule, FieldsetModule, OverlayPanelModule, DataTableModule,
    SharedModule, SpinnerModule, MessagesModule, CheckboxModule,
    AccordionModule, AppRoutingModule, MenubarModule, TabMenuModule, PanelModule,
    BlockUIModule, DataGridModule, FieldsetModule, TooltipModule, ProgressSpinnerModule,
    ProgressBarModule, SplitButtonModule, CalendarModule, InputSwitchModule,
    DataListModule, ChipsModule, MultiSelectModule, AutoCompleteModule, ListboxModule, SelectButtonModule,
    RadioButtonModule ],
  providers: [WagTypesService, OwnershipService, KsService, ContTypesService,
    SvoService, SpecMarkService, GngService, EtsngService, EtsngMasksService, UpdateDbDateService,
    StationService, CountryService, RouteService, CalcService, CacheService,
    ValidService, KeyService, ApiService, HintService, LogService, LoginService,
    { provide: BUILD, useValue: environment.build }, { provide: VERSION, useValue: environment.version },
    OwnershipListService, SvoListService, WagTypeListService, ContTypeListService, SpecMarkListService, KsListService,
    VisibleControlsService, BackendVersionService, TariffPolicyService, StatService, HtmlService],
  declarations: [AppComponent, CalcComponent, ProgressDialogComponent, ErrorDialogComponent, ErrorNsiDialogComponent,
    RoutePanelComponent, ShortReportComponent, TestPanelComponent, HelpComponent, BrowsersInfoComponent,
    FullReportComponent, HintPanel, ParagrafPanelComponent, RoutePairPanelComponent, OldBuildComponent, BoldSpanPipe],
  bootstrap: [AppComponent]
})

export class AppModule {
}
