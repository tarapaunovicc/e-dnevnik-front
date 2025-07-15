import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyClassComponent } from './my-class.component';

describe('MyClassComponent', () => {
  let component: MyClassComponent;
  let fixture: ComponentFixture<MyClassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyClassComponent]
    });
    fixture = TestBed.createComponent(MyClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
