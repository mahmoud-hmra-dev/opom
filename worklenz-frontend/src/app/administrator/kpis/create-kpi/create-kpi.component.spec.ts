import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateKpiComponent } from './create-kpi.component';

describe('CreateKpiComponent', () => {
  let component: CreateKpiComponent;
  let fixture: ComponentFixture<CreateKpiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateKpiComponent]
    });
    fixture = TestBed.createComponent(CreateKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
