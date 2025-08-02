export interface ShowingTime {
  id?: number;
  dateTime: string;
  movieId: number;
  theatreId: number;
  featureIds: number[];
  
}

export interface Movie {
  id: number;
  title: string;
}

export interface Cinema {
  id: number;
  name: string;
}

export interface Feature {
  id: number;
  name: string;
}

export interface CombinedData {
  movies: Movie[];
  cinemas: Cinema[];
  Feature: Feature[];
}

export interface MovieCinemaFeature {
  movieName: string;
  cinemaName: string;
  featureName: string;
}
