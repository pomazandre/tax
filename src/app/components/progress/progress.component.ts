import { OnDestroy, Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { Dialog } from 'primeng/primeng';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProgressDialogComponent implements OnDestroy {
  @ViewChild(Dialog) private panel: Dialog;
  private _display: boolean = false;
  private _title: string = '';
  private _tick;
  private _step = 1;
  private _queryProgress: boolean = false;
  private _setTimeoutHandler: any;
  private _text: string = '';
  private _width: number = 200;

  public get title(): string {
    return this._title;
  }

  public set title(value: string) {
    this._title = value;
  }

  public get text(): string {
    return this._text;
  }

  public set text(value: string) {
    this._text = value;
  }

  public get tick(): string {
    return this._tick;
  }

  public set tick(value: string) {
    this._tick = value;
  }

  public set step(value: number) {
    this._step = value;
  }

  public set queryProgress(value: boolean) {
    this._queryProgress = value;
  }

  public get queryProgress(): boolean {
    return this._queryProgress;
  }

  public set display(value: boolean) {
    this._display = value;
  }

  public get display(): boolean {
    return this._display;
  }

  public get width(): number {
    return this._width;
  }

  public set width(value: number) {
    this._width = value;
  }

  constructor(private _changeDetectorRef: ChangeDetectorRef) {
  }
  
  ngOnDestroy() {
    this._changeDetectorRef.detach(); // do this
  }

  detectChanges() {
    if (!this._changeDetectorRef['destroyed']) {
      this._changeDetectorRef.detectChanges();
     }
  }  

  show() {
    this._display = true;
    this._tick = 0;
    let interval = setInterval(() => {
      this._tick = this._tick + Math.floor(Math.random()) + this._step;
      this.detectChanges();
      if (this._tick >= 100) {
        this._tick = 100;
        clearInterval(interval);
        if (this.queryProgress) {
          this.close();
          this.detectChanges();
        }
      }
    }, 1000);
  }

  close() {
    if (this.queryProgress) {
      setTimeout(() => {
        this.title = 'Превышено время ожидания данных.';
        this.detectChanges();
      }, 2000);
      setTimeout(() => {
        this._display = false;
        this.detectChanges();
      }, 4000);
    } else {
      this._display = false;
      this.detectChanges();
    }
  }

}
