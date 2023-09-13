import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalcComponent } from './calc/calc.component';
import { FullReportComponent } from './fullReport/full-report.component';
import { HelpComponent } from './help/help.component';
import { BrowsersInfoComponent } from './browsersInfo/browsers.component';
import { OldBuildComponent } from '././oldBuild/old-build.component';


const ROUTES: Routes = [
  { path: '', component: CalcComponent },
  { path: 'rep', component: FullReportComponent },
  { path: 'help', component: HelpComponent },
  { path: 'browsers', component: BrowsersInfoComponent },
  { path: 'versions', component: OldBuildComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}


