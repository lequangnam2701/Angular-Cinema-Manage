export interface Cinema {
  id: string;
  name: string;
  stateId: number;
  stateName: string;
  image: string;
}

export interface CreateCinemaRequest {
  name: string;
  stateId: number;
  stateName: string;
  image: string;
}

export interface UpdateCinemaRequest {
  id: number;
  name: string;
  stateId: number;
  stateName: string;
  image: string;
}

export interface CinemaResponse {
  success: boolean;
  data: Cinema;
  message?: string;
}

export interface CinemaListResponse {
  success: boolean;
  data: Cinema[];
  message?: string;
}
