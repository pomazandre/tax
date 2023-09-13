import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-browser',
  templateUrl: './browsers.component.html',
  styleUrls: ['browsers.component.css']
})

export class BrowsersInfoComponent {

  constructor(private _apiService: ApiService, private _router: Router) {
  }

  public get Url(): string {
    return this._apiService.urlAssets;
  }

  handleBack() {
    this._router.navigate(['/']);
  }

}
