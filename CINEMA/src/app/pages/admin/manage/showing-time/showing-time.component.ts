import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ShowingTimesService } from '../../../../service/showing-time.service';
import {
  ShowingTime,
  Movie,
  Cinema,
  Feature,
} from '../../../../models/showing-time.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-showing-time',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './showing-time.component.html',
  styleUrls: ['./showing-time.component.css'],
})
export class ShowingTimeComponent implements OnInit {
  showingTimeForm: FormGroup;
  showCreateForm = false;
  isLoading = false;

 
  showingTimes: ShowingTime[] = [];
  movieNames: string[] = [];
  cinemaNames: string[] = [];
  minimalFeatureNames: string[] = [];

  movies: Movie[] = [];
  cinemas: Cinema[] = [];
  features: Feature[] = [];


  searchTerm: string = '';
  filterCinema: string = '';
  filterMovie: number | '' = '';
  filteredShowingTimes: ShowingTime[] = [];

  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private fb: FormBuilder,
    private showingTimesService: ShowingTimesService
  ) {
    this.showingTimeForm = this.fb.group({
      dateTime: ['', Validators.required],
      movieName: ['', Validators.required],
      cinemaName: ['', Validators.required],
      featureNames: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadDropdownData();
    this.loadShowingTimes();
    console.log('Movies:', this.movies);
  }

  // Load all dropdown data
  loadDropdownData(): void {
    // Load names for dropdowns
    this.showingTimesService.getNames().subscribe({
      next: (data) => {
        this.movieNames = data.movieNames;
        this.cinemaNames = data.cinemaNames;
        this.minimalFeatureNames = data.MinimalFeatureNames;
      },
      error: (error) => {
        console.error('Error loading dropdown data:', error);
      },
    });

    // Load full data for mapping
    this.showingTimesService.getAllData().subscribe({
      next: (data) => {
        this.movies = data.movies;
        this.cinemas = data.cinemas;
        this.features = data.Feature;
      },
      error: (error) => {
        console.error('Error loading full data:', error);
      },
    });
  }

  loadShowingTimes(): void {
    this.isLoading = true;
    this.showingTimesService.getShowingTimes().subscribe({
      next: (data) => {
        this.showingTimes = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading showing times:', error);
        this.isLoading = false;
      },
    });
  }

  get featureNames(): FormArray {
    return this.showingTimeForm.get('featureNames') as FormArray;
  }

  // Form array methods
  addFeatureName(): void {
    this.featureNames.push(this.fb.control(''));
  }

  removeFeatureName(index: number): void {
    this.featureNames.removeAt(index);
  }

  // Form management methods
  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (this.showCreateForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.showingTimeForm.reset();
    this.featureNames.clear();
  }

  cancelCreate(): void {
    this.showCreateForm = false;
    this.resetForm();
  }

  // Submit form
  onSubmit(): void {
    if (this.showingTimeForm.valid) {
      this.isLoading = true;

      const formValue = this.showingTimeForm.value;

      // Convert names to IDs
      const movieId = this.getMovieIdByName(formValue.movieName);
      const theatreId = this.getCinemaIdByName(formValue.cinemaName);
      const featureIds = formValue.featureNames
        .filter((name: string) => name) // Remove empty values
        .map((name: string) => this.getFeatureIdByName(name));

      const showingTime: ShowingTime = {
        dateTime: formValue.dateTime,
        movieId: movieId,
        theatreId: theatreId,
        featureIds: featureIds,
      };

      console.log('Showing time data:', showingTime);
      this.showingTimesService.createShowingTime(showingTime).subscribe({
        next: (response) => {
          console.log('Showing time created successfully:', response);
          this.isLoading = false;
          this.resetForm();
          this.showCreateForm = false;
          this.loadShowingTimes(); // Reload the list
        },
        error: (error) => {
          console.error('Error creating showing time:', error);
          this.isLoading = false;
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.showingTimeForm.controls).forEach((key) => {
        const control = this.showingTimeForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  // Helper methods for display
  getMovieName(id: number): string {
    return this.movies.find((m) => m.id === id)?.title || '';
  }

  getCinemaName(theatreId: number): string {
    const cinema = this.cinemas.find((c) => c.id === theatreId);
    return cinema ? cinema.name : `Cinema ${theatreId}`;
  }

  getFeatureName(featureId: number): string {
    const feature = this.features.find((f) => f.id === featureId);
    return feature ? feature.name : `Feature ${featureId}`;
  }

  // Get movie ID by name (for form submission)
  getMovieIdByName(movieName: string): number {
    const movie = this.movies.find((m) => m.title === movieName);
    return movie ? movie.id : 0;
  }

  // Get cinema ID by name (for form submission)
  getCinemaIdByName(cinemaName: string): number {
    const cinema = this.cinemas.find((c) => c.name === cinemaName);
    return cinema ? cinema.id : 0;
  }

  // Get feature ID by name (for form submission)
  getFeatureIdByName(featureName: string): number {
    const feature = this.features.find((f) => f.name === featureName);
    return feature ? feature.id : 0;
  }

  isUpcoming(dateTime: string): boolean {
    return new Date(dateTime) > new Date();
  }

  deleteShowingTime(id: number): void {
    if (confirm('Are you sure you want to delete this showing time?')) {
      this.isLoading = true;
      this.showingTimesService.deleteShowingTime(id).subscribe({
        next: (response) => {
          console.log('Showing time deleted successfully:', response);
          this.loadShowingTimes();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting showing time:', error);
          this.isLoading = false;
        },
      });
    }
  }

  // Search and filter methods
  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.showingTimes];

    // Apply search filter
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.id?.toString().includes(searchLower) ||
          (this.getMovieName(item.movieId) || '')
            .toLowerCase()
            .includes(searchLower) ||
          this.getCinemaName(item.theatreId)
            .toLowerCase()
            .includes(searchLower) ||
          item.dateTime.toLowerCase().includes(searchLower)
      );
    }

    // Apply cinema filter
    if (this.filterCinema) {
      filtered = filtered.filter(
        (item) => this.getCinemaName(item.theatreId) === this.filterCinema
      );
    }

    // Apply movie filter
    if (this.filterMovie) {
      filtered = filtered.filter(
        (item) => this.getMovieName(item.movieId) === this.filterMovie
      );
    }

    // Apply sorting
    if (this.sortField) {
      filtered.sort((a, b) => {
        const aValue = a[this.sortField as keyof ShowingTime];
        const bValue = b[this.sortField as keyof ShowingTime];

        if (aValue == null || bValue == null) return 0;

        if (this.sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    this.filteredShowingTimes = filtered;
  }

  // Sorting methods
  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }
}
