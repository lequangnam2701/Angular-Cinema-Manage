import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyTicketMovieComponent } from './buy-ticket-movie.component';

describe('BuyTicketMovieComponent', () => {
  let component: BuyTicketMovieComponent;
  let fixture: ComponentFixture<BuyTicketMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyTicketMovieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyTicketMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
