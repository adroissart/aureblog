import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardViewerComponent } from './award-viewer.component';

describe('AwardViewerComponent', () => {
  let component: AwardViewerComponent;
  let fixture: ComponentFixture<AwardViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AwardViewerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
