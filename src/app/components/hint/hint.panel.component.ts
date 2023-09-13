import { Component, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/components/overlaypanel/overlaypanel'

@Component({
  selector: 'app-hint',
  templateUrl: './hint.panel.component.html',
})

export class HintPanel {
  @ViewChild(OverlayPanel) private _overlay: OverlayPanel;
  private _hint: string;

  public get mdlHint(): string {
    return this._hint;
  }

  public set mdlHint(value: string) {
    this._hint = value;
  }

  show(event, hint) {
    this._hint = hint;
    this._overlay.show(event);
  }

  close() {
    this._overlay.hide();
  }

}
