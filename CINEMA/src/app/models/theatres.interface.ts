export interface Theatre {
  id: number;
  number: string;
  cinemaId: number;
  cinemaName: string;
}

export interface CreateTheatreRequest {
  number: string;
  cinemaId: number;
  cinemaName: string;
}

export interface UpdateTheatreRequest {
  number?: string;
  cinemaId?: number;
  cinemaName?: string;
}