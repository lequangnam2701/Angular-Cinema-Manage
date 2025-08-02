import { Component, OnInit, OnDestroy } from '@angular/core';
import { TheatreService } from '../../../../service/theatres.service';
import {
  CreateTheatreRequest,
  Theatre,
} from '../../../../models/theatres.interface';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-theatres',
  imports: [CommonModule, FormsModule],
  templateUrl: './theatres.component.html',
  styleUrl: './theatres.component.css',
})
export class TheatresComponent {
  theatres: Theatre[] = [];
  filteredTheatres: Theatre[] = [];
  cinemas: string[] = [];
  selectedCinema: string = '';

  loading = false;
  error: string | null = null;
  showAddModal = false;
  editingTheatre: Theatre | null = null;

  newTheatre: CreateTheatreRequest = {
    number: '',
    cinemaId: 0,
    cinemaName: '',
  };

  private destroy$ = new Subject<void>();

  constructor(private theatreService: TheatreService) {}

  ngOnInit(): void {
    this.loadTheatres();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all theatres
   */
  loadTheatres(): void {
    this.loading = true;
    this.error = null;

    this.theatreService
      .getTheatres()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.theatres = data;
          this.filteredTheatres = [...data];
          this.updateCinemaList();
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message;
          this.loading = false;
        },
      });
  }

  /**
   * Filter theatres by cinema
   */
  filterByCinema(): void {
    if (this.selectedCinema) {
      this.filteredTheatres = this.theatres.filter(
        (theatre) => theatre.cinemaName === this.selectedCinema
      );
    } else {
      this.filteredTheatres = [...this.theatres];
    }
  }

  /**
   * Update cinema list for dropdown
   */
  private updateCinemaList(): void {
    const cinemaSet = new Set(
      this.theatres.map((theatre) => theatre.cinemaName)
    );
    this.cinemas = Array.from(cinemaSet).sort();
  }

  /**
   * Open add theatre modal
   */
  openAddModal(): void {
    this.showAddModal = true;
    this.editingTheatre = null;
    this.resetForm();
  }

  /**
   * Open edit theatre modal
   */
  openEditModal(theatre: Theatre): void {
    this.showAddModal = true;
    this.editingTheatre = theatre;
    this.newTheatre = {
      number: theatre.number,
      cinemaId: theatre.cinemaId,
      cinemaName: theatre.cinemaName,
    };
  }

  /**
   * Close modal
   */
  closeModal(): void {
    this.showAddModal = false;
    this.editingTheatre = null;
    this.resetForm();
  }

  /**
   * Reset form
   */
  private resetForm(): void {
    this.newTheatre = {
      number: '',
      cinemaId: 0,
      cinemaName: '',
    };
  }

  /**
   * Submit form (add or edit)
   */
  onSubmit(): void {
    if (this.editingTheatre) {
      this.updateTheatre();
    } else {
      this.createTheatre();
    }
  }

  /**
   * Create new theatre
   */
  private createTheatre(): void {
    this.theatreService
      .createTheatre(this.newTheatre)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (theatre) => {
          this.theatres.push(theatre);
          this.filteredTheatres = [...this.theatres];
          this.updateCinemaList();
          this.closeModal();
        },
        error: (err) => {
          this.error = err.message;
        },
      });
  }

  /**
   * Update existing theatre
   */
  private updateTheatre(): void {
    if (!this.editingTheatre) return;

    this.theatreService
      .updateTheatre(this.editingTheatre.id, this.newTheatre)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedTheatre) => {
          const index = this.theatres.findIndex(
            (t) => t.id === updatedTheatre.id
          );
          if (index !== -1) {
            this.theatres[index] = updatedTheatre;
            this.filteredTheatres = [...this.theatres];
            this.updateCinemaList();
          }
          this.closeModal();
        },
        error: (err) => {
          this.error = err.message;
        },
      });
  }

  /**
   * Delete theatre
   */
  deleteTheatre(theatre: Theatre): void {
    if (confirm(`Are you sure you want to delete Theatre ${theatre.number}?`)) {
      this.theatreService
        .deleteTheatre(theatre.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.theatres = this.theatres.filter((t) => t.id !== theatre.id);
            this.filteredTheatres = this.filteredTheatres.filter(
              (t) => t.id !== theatre.id
            );
            this.updateCinemaList();
          },
          error: (err) => {
            this.error = err.message;
          },
        });
    }
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.error = null;
  }
}
