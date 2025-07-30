import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownListKpisComponent } from './dropdown-list-kpis.component';

describe('DropdownListKpisComponent', () => {
  let component: DropdownListKpisComponent;
  let fixture: ComponentFixture<DropdownListKpisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownListKpisComponent]
    });
    fixture = TestBed.createComponent(DropdownListKpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
