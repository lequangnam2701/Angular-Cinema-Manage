import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureTypesComponent } from './feature-types.component';

describe('FeatureTypesComponent', () => {
  let component: FeatureTypesComponent;
  let fixture: ComponentFixture<FeatureTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeatureTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
