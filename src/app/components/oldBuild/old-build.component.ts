import { Component, ViewChild, OnInit, Renderer2, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-oldBuild',
  templateUrl: 'old-build.component.html',
  styleUrls: ['old-build.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OldBuildComponent implements OnInit{
  @ViewChild('pp') private _p: ElementRef;
  originalStr = `Here's an example of text`;
  regexStr = `Here's an`;

  constructor(private renderer: Renderer2, private _changeDetectorRef: ChangeDetectorRef) {}


  ngOnInit(){
    //console.log(this._p.nativeElement);
    //let el = this._p.nativeElement;
    //this.renderer.setStyle(this._p.nativeElement, 'font-weight', '800');
    this.detectChanges();
  }

  detectChanges() {
    if (!this._changeDetectorRef['destroyed']) {
      this._changeDetectorRef.detectChanges();
    }
  }

  
}
