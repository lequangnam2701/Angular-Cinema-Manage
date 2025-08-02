import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCinemaComponent } from './manage-cinema.component';

describe('ManageCinemaComponent', () => {
  let component: ManageCinemaComponent;
  let fixture: ComponentFixture<ManageCinemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCinemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCinemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
