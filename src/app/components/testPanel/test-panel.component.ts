import { Component, ViewChild, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-testPanel',
  templateUrl: './test-panel.component.html',
})

export class TestPanelComponent {
  private _Display : boolean = false;
  private _mdlRunCount : number;
  @Output() public onTestRuns = new EventEmitter();

  constructor() {
  }

  public get mdlRunCount() : number
  {
    return this._mdlRunCount;
  }

public set mdlRunCount(value : number)
  {
    this._mdlRunCount = value;
  }

  public get Display() : boolean
  {
    return this._Display;
  }

  public set Display(value: boolean)
  {
    this._Display = value;
  }

  show(){
    this._Display = true;
  }

  runTests(){
    this._Display = false;
    this.onTestRuns.emit();
  }

}
