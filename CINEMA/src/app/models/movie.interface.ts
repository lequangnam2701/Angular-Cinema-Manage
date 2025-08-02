export interface Movie {
  id: number;
  directorId: number;
  statusId: number;
  title: string;
  ageRating: string;
  runtimeMin: number;
  releaseDate: string;
  trailerLink: string;
  description: string;
  bannerText: string;
  headerImage: string;
  posterImage: string;
  synopsis: string;

  genreIds: number[];
  castMemberIds: number[];
}

export class MovieComponent {
  movies: any[] = [];
  newMovie: any = {};
  selectedMovie: any = null;
  isEditing: boolean = false;
  loading: boolean = false;
  error: string = '';

  activeTab: string = 'movies';
  searchTerm: string = '';
  pageSize: number = 10;

  addMovie() {
    console.log('Adding movie:', this.newMovie);
  }

  editMovie(movie: any) {
    this.selectedMovie = { ...movie };
    this.isEditing = true;
    this.activeTab = 'edit';
  }

  updateMovie() {
    console.log('Updating movie:', this.selectedMovie);
    this.isEditing = false;
    this.selectedMovie = null;
    this.activeTab = 'movies';
  }

  deleteMovie(id: any) {
    if (confirm('Bạn có chắc chắn muốn xóa movie này?')) {
      console.log('Deleting movie with ID:', id);
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.selectedMovie = null;
    this.activeTab = 'movies';
  }

  resetForm() {
    this.newMovie = {};
  }

  clearError() {
    this.error = '';
  }

  searchMovies() {
    if (this.searchTerm.trim()) {
      console.log('Searching for:', this.searchTerm);
    }
  }

  showAllMovies() {
    this.searchTerm = '';

    console.log('Showing all movies');
  }

  loadPaginated() {
    console.log('Loading paginated with size:', this.pageSize);
  }
}
