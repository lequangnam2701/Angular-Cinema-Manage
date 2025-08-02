import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureType } from '../../../../models/feature-types.interface';
import { FeatureTypeService } from '../../../../service/feature-types.service';

@Component({
  selector: 'app-feature-types',
  imports: [CommonModule],
  templateUrl: './feature-types.component.html',
  styleUrl: './feature-types.component.css',
})
export class FeatureTypesComponent implements OnInit {
  featureTypes: FeatureType[] = [];
  loading = false;
  error: string | null = null;
  newFeatureTypeName = '';

  constructor(private featureTypesService: FeatureTypeService) {}

  ngOnInit() {
    this.loadFeatureTypes();
  }

  loadFeatureTypes() {
    this.loading = true;
    this.error = null;

    this.featureTypesService.getFeatureType().subscribe({
      next: (featureType) => {
        this.featureTypes = featureType;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load feature types: ' + err.message;
        this.loading = false;
      },
    });
  }

  addFeatureType() {
    if (!this.newFeatureTypeName.trim()) return;

    this.featureTypesService
      .createFeatureType({ name: this.newFeatureTypeName.trim() })
      .subscribe({
        next: (newFeatureType) => {
          this.featureTypes.push(newFeatureType);
          this.newFeatureTypeName = '';
        },
        error: (err) => {
          this.error = 'Failed to add feature type: ' + err.message;
        },
      });
  }

  trackByFeatureId(index: number, feature: FeatureType): number {
    return feature.id;
  }

 deleteFeatureType(id: number): void {
  if (confirm(`Bạn có chắc muốn xóa FeatureType "${id}"?`)) {
    this.loading = true;
    this.featureTypesService.deleteFeatureType(id).subscribe({
      next: () => {
        this.featureTypes = this.featureTypes.filter(
          (featureType) => featureType.id !== id
        );
        this.loading = false;
        alert('Xóa thành công!');
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        alert('Xóa thất bại: ' + error.message);
      },
    });
  }
}

}
