import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PropertyDetail } from '../../core/models/property.model';
import { PropertyService } from '../../core/services/property.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.scss',
})
export class PropertyDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly propertyService = inject(PropertyService);
  readonly property = signal<PropertyDetail | null>(null);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage.set('Property not found.');
      this.loading.set(false);
      return;
    }
    this.propertyService.getPublishedById(id).subscribe({
      next: (property) => { this.property.set(property); this.loading.set(false); },
      error: () => { this.errorMessage.set('Unable to load this property.'); this.loading.set(false); },
    });
  }
}
