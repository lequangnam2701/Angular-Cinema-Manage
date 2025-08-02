import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CinemaService } from '../../../../service/cinema.service';
import {
  Cinema,
  CreateCinemaRequest,
  UpdateCinemaRequest,
} from '../../../../models/cinema.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-cinema',
  templateUrl: './manage-cinema.component.html',
  styleUrls: ['./manage-cinema.component.css'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
})
export class ManageCinemaComponent implements OnInit, OnDestroy {
  // Form và dữ liệu
  cinemaForm!: FormGroup;
  cinemas: Cinema[] = [];
  selectedCinema: Cinema | null = null;
  isEditMode = false;
  isLoading = false;

  trackByCinema(index: number, cinema: Cinema): string {
    return cinema.id;
  }

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  searchTerm = '';
  selectedStateId: number | null = null;

  private destroy$ = new Subject<void>();

  showDeleteConfirm = false;
  cinemaToDelete: Cinema | null = null;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private cinemaService: CinemaService) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadCinemas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.cinemaForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      stateId: ['', [Validators.required, Validators.min(1)]],
      stateName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      image: ['', [Validators.required]],
    });
  }

  loadCinemas(): void {
    this.isLoading = true;
    this.clearMessages();

    this.cinemaService
      .getAllCinemas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.cinemas = data;
          this.totalItems = data.length;
          this.isLoading = false;
        },
        error: (error) => {
          this.handleError('Failed to load cinemas', error);
          this.isLoading = false;
        },
      });
  }

  filterByState(): void {
    if (!this.selectedStateId) {
      this.loadCinemas();
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    this.cinemaService
      .getCinemasByState(this.selectedStateId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.cinemas = data;
          this.totalItems = data.length;
          this.isLoading = false;
        },
        error: (error) => {
          this.handleError('Failed to filter cinemas', error);
          this.isLoading = false;
        },
      });
  }

  // onSubmit(): void {
  //   if (this.cinemaForm.invalid) {
  //     this.markFormGroupTouched();
  //     return;
  //   }

  //   if (this.isEditMode && this.selectedCinema) {
  //     this.updateCinema();
  //   } else {
  //     this.createCinema();
  //   }
  // }

  private createCinema(): void {
    this.isLoading = true;
    this.clearMessages();

    const cinemaData: CreateCinemaRequest = {
      ...this.cinemaForm.value,
    };

    this.cinemaService
      .createCinema(cinemaData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.handleSuccess('Cinema created successfully');
          this.loadCinemas();
          this.resetForm();
          this.isLoading = false;
        },
        error: (error) => {
          this.handleError('Failed to create cinema', error);
          this.isLoading = false;
        },
      });
  }

  // private updateCinema(): void {
  //   if (!this.selectedCinema) return;

  //   this.isLoading = true;
  //   this.clearMessages();

  //   const cinemaData: UpdateCinemaRequest = {
  //     id: this.selectedCinema.id,
  //     ...this.cinemaForm.value,
  //   };

  //   this.cinemaService
  //     .updateCinema(this.selectedCinema.id, cinemaData)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (response) => {
  //         this.handleSuccess('Cinema updated successfully');
  //         this.loadCinemas();
  //         this.resetForm();
  //         this.isLoading = false;
  //       },
  //       error: (error) => {
  //         this.handleError('Failed to update cinema', error);
  //         this.isLoading = false;
  //       },
  //     });
  // }

  confirmDelete(cinema: Cinema): void {
    this.cinemaToDelete = cinema;
    this.showDeleteConfirm = true;
  }

  //  deleteCinema(): void {
  //   if (!this.cinemaToDelete) return;

  //   this.isLoading = true;
  //   this.clearMessages();

  //   this.cinemaService
  //     .deleteCinema(this.cinemaToDelete.id)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: () => {
  //         this.handleSuccess('Cinema deleted successfully');
  //         this.loadCinemas();
  //         this.cancelDelete();
  //         this.isLoading = false;
  //       },
  //       error: (error) => {
  //         this.handleError('Failed to delete cinema', error);
  //         this.isLoading = false;
  //       },
  //     });
  // }
  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.cinemaToDelete = null;
  }

  resetForm(): void {
    this.cinemaForm.reset();
    this.selectedCinema = null;
    this.isEditMode = false;
    this.clearMessages();
  }

  private handleError(message: string, error: any): void {
    this.errorMessage = `${message}: ${error.message || error}`;
    console.error(message, error);
  }

  private handleSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.cinemaForm.controls).forEach((key) => {
      const control = this.cinemaForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.cinemaForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.cinemaForm.patchValue({
          image: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      this.isEditMode = false;
      this.resetForm();
    }
  }

  showAddForm = false;

  closeForm(): void {
    this.cinemaForm.reset();
    this.isEditMode = false;
    this.selectedCinema = null;
    this.showAddForm = false;
  }

  editCinema(cinema: Cinema): void {
    this.isEditMode = true;
    this.showAddForm = true;
    this.selectedCinema = cinema;
    this.cinemaForm.patchValue({
      id: cinema.id,
      name: cinema.name,
      stateId: cinema.stateId,
      stateName: cinema.stateName,
      image: cinema.image,
    });
    setTimeout(() => {
      const formElement = document.querySelector('.cinema-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}
