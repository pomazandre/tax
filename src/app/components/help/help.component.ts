import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html'
})

export class HelpComponent {

  constructor(private _apiService: ApiService, private _router: Router) {
  }

  public get Url(): string {
    return this._apiService.urlAssets + 'help/';
  }

  public get BackUrl(): string {
    return this._apiService.urlAssets;
  }

  handleBack() {
    this._router.navigate(['/']);
  }

}
