import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassRecordComponent } from './class-record.component';

describe('ClassRecordComponent', () => {
  let component: ClassRecordComponent;
  let fixture: ComponentFixture<ClassRecordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassRecordComponent]
    });
    fixture = TestBed.createComponent(ClassRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
