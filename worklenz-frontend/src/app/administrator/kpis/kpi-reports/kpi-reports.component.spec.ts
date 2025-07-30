import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiReportsComponent } from './kpi-reports.component';

describe('KpiReportsComponent', () => {
  let component: KpiReportsComponent;
  let fixture: ComponentFixture<KpiReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KpiReportsComponent]
    });
    fixture = TestBed.createComponent(KpiReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
