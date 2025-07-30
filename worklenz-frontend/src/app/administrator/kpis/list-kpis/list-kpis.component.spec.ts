import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListKpisComponent } from './list-kpis.component';

describe('ListKpisComponent', () => {
  let component: ListKpisComponent;
  let fixture: ComponentFixture<ListKpisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListKpisComponent]
    });
    fixture = TestBed.createComponent(ListKpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
