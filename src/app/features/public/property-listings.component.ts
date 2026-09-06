import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Property } from '../../core/models/property.model';
import { PropertyService } from '../../core/services/property.service';

@Component({
  selector: 'app-property-listings',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './property-listings.component.html',
  styleUrl: './property-listings.component.scss',
})
export class PropertyListingsComponent {
  private readonly propertyService = inject(PropertyService);
  readonly properties = signal<Property[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  constructor() {
    this.propertyService.getPublished().subscribe({
      next: (properties) => {
        this.properties.set(properties);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load published properties.');
        this.loading.set(false);
      },
    });
  }
}
