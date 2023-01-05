import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentScheduleListComponent } from './current-schedule-list.component';

describe('CurrentScheduleListComponent', () => {
  let component: CurrentScheduleListComponent;
  let fixture: ComponentFixture<CurrentScheduleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentScheduleListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentScheduleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
