import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppKpiAssignComponent } from './app-kpi-assign.component';

describe('AppKpiAssignComponent', () => {
  let component: AppKpiAssignComponent;
  let fixture: ComponentFixture<AppKpiAssignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppKpiAssignComponent]
    });
    fixture = TestBed.createComponent(AppKpiAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
