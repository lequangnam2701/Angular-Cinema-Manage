import { Component, OnInit } from '@angular/core';
import { Movie } from '../../../../models/movie.interface';
import { MovieService } from '../../../../service/movie.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-manage-movie',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './manage-movie.component.html',
  styleUrls: ['./manage-movie.component.css'],
})
export class ManageMovieComponent implements OnInit {
  movies: Movie[] = [];
  selectedMovie: Movie | null = null;
  isEditing = false;
  loading = false;
  error = '';
  activeTab: 'movies' | 'add' = 'movies';

  directors: any[] = [];
  selectedPosterFile: File | null = null;
  selectedHeaderFile: File | null = null;

  castMemberIdsInput = '';
  genreIdsInput = '';

  handleCastMemberIds(event: any) {
    const value = event.target.value;
    this.castMemberIdsInput = value;
    if (value.trim()) {
      this.newMovie.castMemberIds = value
        .split(',')
        .map((id: string) => parseInt(id.trim()))
        .filter((id: number) => !isNaN(id));
    } else {
      this.newMovie.castMemberIds = [];
    }
  }

  handleGenreIds(event: any) {
    const value = event.target.value;
    this.genreIdsInput = value;
    if (value.trim()) {
      this.newMovie.genreIds = value
        .split(',')
        .map((id: string) => parseInt(id.trim()))
        .filter((id: number) => !isNaN(id));
    } else {
      this.newMovie.genreIds = [];
    }
  }

  onPosterImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPosterFile = input.files[0];
    }
  }

  statuses = [
    { id: 1, name: 'Sắp chiếu' },
    { id: 2, name: 'Đang chiếu' },
    { id: 3, name: 'Ngừng chiếu' },
  ];

  castMembers: any[] = [];
  genres: any[] = [];

  selectedHeaderImage: File | null = null;
  headerImagePreview: string | ArrayBuffer | null = null;

  onHeaderImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedHeaderFile = input.files[0];
    }
  }
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isUploading = false;

  // FIX: Khởi tạo newMovie với đúng types
  newMovie: Omit<Movie, 'id'> = {
    directorId: 1,
    statusId: 1,
    title: '',
    ageRating: '',
    runtimeMin: 1,
    releaseDate: '',
    trailerLink: '',
    description: '',
    bannerText: '',
    headerImage: '',
    posterImage: '',
    synopsis: '',

    genreIds: [],
    castMemberIds: [],
  };

  constructor(private movieService: MovieService) {}

  pageSize: number = 10;
  loadPaginated(): void {
    this.movies = this.movies.slice(0, this.pageSize);
  }

  searchTerm: string = '';

  searchMovies(): void {
    if (!this.searchTerm.trim()) {
      this.loadMovies();
      return;
    }
    this.movies = this.movies.filter((movie) =>
      movie.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  ngOnInit(): void {
    this.loadMovies();
  }

  showAllMovies(): void {
    this.searchTerm = '';
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      },
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Kiểm tra loại file
      if (!file.type.startsWith('image/')) {
        this.error = 'Vui lòng chọn file hình ảnh';
        return;
      }

      // Kiểm tra kích thước file (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'File quá lớn. Vui lòng chọn file nhỏ hơn 5MB';
        return;
      }

      this.selectedFile = file;
      this.previewImage(file);
      this.error = '';
    }
  }

  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  uploadFile(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        reject('Không có file được chọn');
        return;
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.isUploading = true;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.isUploading = false;
        resolve(e.target.result);
      };
      reader.onerror = () => {
        this.isUploading = false;
        reject('Lỗi khi đọc file');
      };
      reader.readAsDataURL(this.selectedFile);
    });
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    const fileInput = document.getElementById(
      'posterImage'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  async addMovie(): Promise<void> {
    if (!this.newMovie.title.trim()) {
      this.error = 'Tiêu đề không được để trống';
      return;
    }

    if (!this.newMovie.statusId || this.newMovie.statusId === 0) {
      this.error = 'Vui lòng chọn trạng thái';
      return;
    }

    if (this.newMovie.runtimeMin <= 0) {
      this.error = 'Thời lượng phải lớn hơn 0';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      const movieData = {
        directorId: Number(this.newMovie.directorId) || 1,
        statusId: Number(this.newMovie.statusId),
        title: this.newMovie.title.trim(),
        ageRating: this.newMovie.ageRating || 'PG-13',
        runtimeMin: Number(this.newMovie.runtimeMin),
        releaseDate: this.newMovie.releaseDate || '',
        trailerLink: this.newMovie.trailerLink || '',
        description: this.newMovie.description || '',
        bannerText: this.newMovie.bannerText || '',
        synopsis: this.newMovie.synopsis || '',
        castMemberIds: this.newMovie.castMemberIds || [],
        genreIds: this.newMovie.genreIds || [],
      };

      const formData = new FormData();
      formData.append('movieData', JSON.stringify(movieData));

      if (this.selectedPosterFile) {
        formData.append('posterImage', this.selectedPosterFile);
      }

      if (this.selectedHeaderFile) {
        formData.append('headerImage', this.selectedHeaderFile);
      }

      console.log('FormData gửi đi:', formData);

      this.movieService.createMovie(formData).subscribe({
        next: (movie: Movie) => {
          console.log('Phản hồi từ server:', movie);
          this.movies.push(movie);
          this.resetForm();
          this.loading = false;
          this.activeTab = 'movies';
          alert('Thêm phim thành công!');
        },
        error: (error: HttpErrorResponse) => {
          console.error('Lỗi khi thêm movie:', error);
          this.error = error.message || 'Có lỗi xảy ra khi thêm movie';
          this.loading = false;
        },
      });
    } catch (error) {
      console.error('Lỗi trong quá trình xử lý:', error);
      this.error = (error as any)?.message || 'Đã xảy ra lỗi';
      this.loading = false;
    }
  }

  uploadHeaderImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedHeaderImage) {
        reject('Không có header image được chọn');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        resolve(e.target.result);
      };
      reader.onerror = () => {
        reject('Lỗi khi đọc header image');
      };
      reader.readAsDataURL(this.selectedHeaderImage);
    });
  }

  editMovie(movie: Movie): void {
    this.selectedMovie = { ...movie };
    this.isEditing = true;
  }

  updateMovie(): void {
    if (!this.selectedMovie) return;

    this.loading = true;
    this.movieService
      .updateMovie(this.selectedMovie.id, this.selectedMovie)
      .subscribe({
        next: (updatedMovie) => {
          const index = this.movies.findIndex((m) => m.id === updatedMovie.id);
          if (index !== -1) {
            this.movies[index] = updatedMovie;
          }
          this.cancelEdit();
          this.loading = false;
          console.log('Cập nhật movie thành công:', updatedMovie);
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
        },
      });
  }

  deleteMovie(id: number): void {
    if (!confirm('Bạn có chắc chắn muốn xóa movie này?')) {
      return;
    }

    this.loading = true;
    this.movieService.deleteMovie(id).subscribe({
      next: () => {
        this.movies = this.movies.filter((m) => m.id !== id);
        this.loading = false;
        console.log('Xóa movie thành công');
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      },
    });
  }

  cancelEdit(): void {
    this.selectedMovie = null;
    this.isEditing = false;
  }

  resetForm(): void {
    this.newMovie = {
      directorId: 1,
      statusId: 1,
      title: '',
      ageRating: '',
      runtimeMin: 1,
      releaseDate: '',
      trailerLink: '',
      description: '',
      bannerText: '',
      headerImage: '',
      posterImage: '',
      synopsis: '',

      genreIds: [],
      castMemberIds: [],
    };
    this.error = '';
    this.removeSelectedFile();
    this.selectedHeaderImage = null;
    this.headerImagePreview = null;
  }

  clearError(): void {
    this.error = '';
  }
}
