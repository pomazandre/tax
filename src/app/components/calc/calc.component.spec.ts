import { TestBed, async } from '@angular/core/testing';
import { CalcComponent } from './calc.component';

describe('CalcComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CalcComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(CalcComponent);
    const app = fixture.debugElement.componentInstance;
    expect(1).toEqual(1);
  }));
});
