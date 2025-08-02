import { Component } from '@angular/core';
import { Snack } from '../../../../models/snack.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SnacksService } from '../../../../service/admin-snack.service';

@Component({
  selector: 'app-snack',
  imports: [CommonModule, FormsModule],
  templateUrl: './snack.component.html',
  styleUrl: './snack.component.css',
})
export class SnackComponent {
  snacks: Snack[] = [];
  selectedSnack: Snack | null = null;
  isEditing = false;
  isLoading = false;
  error = '';
  isAddingSnack: boolean = false;
  selectedFile: File | null = null;
  editSelectedFile: File | null = null;

  // Form data
  newSnack: Snack = {
    snackTypeId: 0,
    snackName: '',
    price: 0,
    snackTypeName: '',
    imageUrl: '',
  };

  constructor(private snacksService: SnacksService) {}

  ngOnInit(): void {
    this.loadSnacks();
  }

  // Load all snacks
  loadSnacks(): void {
    this.isLoading = true;
    this.snacksService.getSnacks().subscribe({
      next: (data) => {
        this.snacks = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error loading snacks';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  // Create new snack
  createSnack(): void {
    if (this.validateSnack(this.newSnack)) {
      this.snacksService.createSnack(this.newSnack).subscribe({
        next: (data) => {
          this.snacks.push(data);
          this.resetForm();
          this.error = '';
        },
        error: (err) => {
          this.error = 'Error creating snack';
          console.error(err);
        },
      });
    }
  }

  // Update existing snack
  updateSnack(): void {
    if (this.selectedSnack && this.validateSnack(this.selectedSnack)) {
      this.snacksService
        .updateSnack(Number(this.selectedSnack.snackId), this.selectedSnack)
        .subscribe({
          next: (data: Snack) => {
            const index = this.snacks.findIndex(
              (s) => s.snackId === data.snackId
            );
            if (index !== -1) {
              this.snacks[index] = data;
            }
            this.cancelEdit();
            this.error = '';
          },
          error: (err: HttpErrorResponse) => {
            this.error = 'Error updating snack';
            console.error(err);
          },
        });
    }
  }
  // Delete snack
  deleteSnack(snackId: number | undefined): void {
    if (snackId === undefined) {
      console.error('Snack ID is undefined');
      return;
    }

    if (confirm('Are you sure you want to delete this snack?')) {
      this.snacksService.deleteSnack(snackId).subscribe({
        next: () => {
          this.snacks = this.snacks.filter(
            (s) => s.snackId !== String(snackId)
          );
          if (this.selectedSnack?.snackId === String(snackId)) {
            this.selectedSnack = null;
          }
          this.error = '';
        },
        error: (err) => {
          this.error = 'Error deleting snack';
          console.error(err);
        },
      });
    }
  }

  // Edit snack
  editSnack(snack: Snack): void {
    this.selectedSnack = { ...snack };
    this.isEditing = true;
  }

  // Cancel edit
  cancelEdit(): void {
    this.selectedSnack = null;
    this.isEditing = false;
  }

  closeAddForm(): void {
    this.isAddingSnack = false;
    this.resetForm();
  }
  openAddForm(): void {
    this.isAddingSnack = true;
    this.resetForm();
  }

  // Reset form
  resetForm(): void {
    this.newSnack = {
      snackTypeId: 0,
      snackName: '',
      price: 0,
      snackTypeName: '',
      imageUrl: '',
    };
  }

  // Validate snack data
  validateSnack(snack: Snack): boolean {
    if (!snack.snackName.trim()) {
      this.error = 'Snack name is required';
      return false;
    }
    if (snack.price <= 0) {
      this.error = 'Price must be greater than 0';
      return false;
    }
    if (snack.snackTypeId <= 0) {
      this.error = 'Valid snack type ID is required';
      return false;
    }
    if (!snack.snackTypeName.trim()) {
      this.error = 'Snack type name is required';
      return false;
    }
    return true;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && this.isImageFile(file)) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newSnack.imageUrl = reader.result as string; // base64 here
        console.log('Base64 imageUrl:', this.newSnack.imageUrl);
      };
      reader.readAsDataURL(file); // convert to base64
    }
  }

  onEditFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && this.isImageFile(file)) {
      this.editSelectedFile = file;
    } else {
      this.error = 'Please select a valid image file (jpg, jpeg, png, gif)';
      event.target.value = '';
    }
  }
  isImageFile(file: File): boolean {
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return acceptedTypes.includes(file.type);
  }
}
