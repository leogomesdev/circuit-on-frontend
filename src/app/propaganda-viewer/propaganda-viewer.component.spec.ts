import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropagandaViewerComponent } from './propaganda-viewer.component';

describe('PropagandaViewerComponent', () => {
  let component: PropagandaViewerComponent;
  let fixture: ComponentFixture<PropagandaViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropagandaViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropagandaViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
