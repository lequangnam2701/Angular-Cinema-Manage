import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FeaturesService } from '../../../../service/features.service';
import { Feature } from '../../../../models/features.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css'],
})
export class FeaturesComponent implements OnInit, OnDestroy {
  features: Feature[] = [];
  loading = false;
  error: string | null = null;
  private subscription?: Subscription;

  constructor(private featuresService: FeaturesService) {}

  ngOnInit(): void {
    this.loadFeatures();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadFeatures(): void {
    this.loading = true;
    this.error = null;

    this.subscription = this.featuresService.getFeatures().subscribe({
      next: (features) => {
        this.features = features;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('Lỗi khi tải features:', error);
      },
    });
  }

  refreshFeatures(): void {
    this.loadFeatures();
  }

  trackByFeatureId(index: number, feature: Feature): number {
    return feature.id;
  }

  deleteFeature(id: number, featureName: string): void {
    if (confirm(`Bạn có chắc muốn xóa feature "${featureName}"?`)) {
      this.loading = true;
      this.featuresService.deleteFeature(id).subscribe({
        next: () => {
          this.features = this.features.filter((f) => f.id !== id);
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
