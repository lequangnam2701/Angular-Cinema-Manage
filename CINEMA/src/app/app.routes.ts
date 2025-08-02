import { Routes } from '@angular/router';
import { ManageCinemaComponent } from './pages/admin/manage/manage-cinema/manage-cinema.component';
import { ManageUserComponent } from './pages/admin/manage/manage-user/manage-user.component';
import { ManageMovieComponent } from './pages/admin/manage/manage-movie/manage-movie.component';
import { LoginComponent } from './pages/website/login/login/login.component';
import { DashboardComponent } from './pages/admin/manage/dashboard/dashboard.component';
import { FeaturesComponent } from './pages/admin/manage/features/features.component';
import { ShowingTimeComponent } from './pages/admin/manage/showing-time/showing-time.component';
import { TheatresComponent } from './pages/admin/manage/theatres/theatres.component';
import { FeatureTypesComponent } from './pages/admin/manage/feature-types/feature-types.component';
// import { StateComponent } from './pages/admin/manage/state/state.component';
import { HomeComponent } from './pages/website/home/home.component';
import { WebLayoutComponent } from './pages/admin/component/web-layout/web-layout.component';
import { AdminLayoutComponent } from './pages/admin/component/admin-layout/admin-layout.component';
import { CinemaComponent } from './pages/website/cinema/cinema.component';
import { MovieComponent } from './pages/website/movie/movie.component';
import { BuyTicketMovieComponent } from './pages/website/buy-ticket-movie/buy-ticket-movie.component';
import { SeatSelectionComponent } from './pages/website/seat-selection/seat-selection.component';
import { SnackComponent } from './pages/admin/manage/snack/snack.component';
import { SnacksComponent } from './pages/website/snack/snack.component';
import { BookingSummaryComponent } from './pages/website/booking-summary/booking-summary.component';
import { PaymentResultComponent } from './pages/website/payment-result/payment-result.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: ManageUserComponent },
      { path: 'movies', component: ManageMovieComponent },
      { path: 'showing-times', component: ShowingTimeComponent },
      { path: 'features', component: FeaturesComponent },
      { path: 'feature-types', component: FeatureTypesComponent },
      // { path: 'state', component: StateComponent },
      { path: 'theatres', component: TheatresComponent },
      { path: 'CinemaManager', component: ManageCinemaComponent },
      { path: 'snack', component: SnackComponent },
    ],
  },

  {
    path: '',
    component: WebLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'cinema', component: CinemaComponent },
      { path: 'movie', component: MovieComponent },

      {
        path: 'buyTicketMovie/:id',
        component: BuyTicketMovieComponent,
      },
      {
        path: 'seatSelection/:showingTimeId',
        component: SeatSelectionComponent,
      },
      {
        path: 'snack',
        component: SnacksComponent,
      },
      { path: 'movies/:cinemaId', 
        component: MovieComponent },
        
      { path: 'summary', 
        component: BookingSummaryComponent },
          //  { path: 'payment-result', component: PaymentResultComponent },

      {
        path: 'payment-result',
        component: PaymentResultComponent
      },
    ],
  },
];
