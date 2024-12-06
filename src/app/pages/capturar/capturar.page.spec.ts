import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapturarPage } from './capturar.page';

describe('CapturarPage', () => {
  let component: CapturarPage;
  let fixture: ComponentFixture<CapturarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CapturarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
