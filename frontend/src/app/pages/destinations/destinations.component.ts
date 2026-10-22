import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  DestinationService,
  Destination
} from '../../services/destination.service';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './destinations.component.html',
  styleUrl: './destinations.component.css'
})
export class DestinationsComponent implements OnInit {

  searchText = '';

  destinations: Destination[] = [
    {
      name: 'Kerala',
      country: 'India',
      description: 'Discover peaceful backwaters, green hills and beautiful beaches.',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Finland',
      country: 'Finland',
      description: 'Discover Finland’s beautiful forests, crystal-clear lakes, Northern Lights and charming Nordic cities.',
      image: 'https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Goa',
      country: 'India',
      description: 'Enjoy golden beaches, coastal scenery and vibrant local culture.',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Sikkim',
      country: 'India',
      description: 'Experience Himalayan mountains, monasteries and scenic valleys.',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Paris',
      country: 'France',
      description: 'Discover famous landmarks, museums and beautiful city streets.',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Dubai',
      country: 'United Arab Emirates',
      description: 'Explore impressive architecture, desert adventures and city attractions.',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'London',
      country: 'United Kingdom',
      description: 'Visit historic landmarks, famous museums and riverside attractions.',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Tokyo',
      country: 'Japan',
      description: 'Experience Japanese culture, modern architecture and traditional temples.',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Switzerland',
      country: 'Switzerland',
      description: 'Enjoy alpine scenery, mountain villages and beautiful lakes.',
      image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=80'
    }
  ];

  isLoading = false;
  errorMessage = '';

  readonly fallbackImage =
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80';

goBack(): void {
  this.router.navigate(['/dashboard']);
}



  constructor(
    private router: Router,
    private destinationService: DestinationService
  ) {}

  ngOnInit(): void {
    this.loadDestinations();
  }

  loadDestinations(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.destinationService.getDestinations().subscribe({
      next: (data: Destination[]) => {

        // Keep the original destinations.
        const combinedDestinations: Destination[] = [
          ...this.destinations
        ];

        // Add database destinations without duplicating existing places.
        for (const item of data) {

          const name = (item.name || '').trim();
          const country = (item.country || '').trim();

          if (!name) {
            continue;
          }

          const alreadyExists = combinedDestinations.some(
            existing =>
              existing.name.trim().toLowerCase() === name.toLowerCase() &&
              existing.country.trim().toLowerCase() === country.toLowerCase()
          );

          if (!alreadyExists) {
            combinedDestinations.push({
              ...item,
              name,
              country,
              description: item.description || 'Discover this destination.',
              image: item.image || this.fallbackImage
            });
          }
        }

        this.destinations = combinedDestinations;
        this.isLoading = false;

        console.log('Destinations loaded:', this.destinations);
      },

      error: (error: any) => {
        console.error('Failed to load destinations:', error);

        this.errorMessage =
          'Unable to load additional destinations. Please check that the backend is running.';

        this.isLoading = false;
      }
    });
  }

  get filteredDestinations(): Destination[] {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.destinations;
    }

    return this.destinations.filter(destination =>
      destination.name.toLowerCase().includes(search) ||
      destination.country.toLowerCase().includes(search) ||
      destination.description.toLowerCase().includes(search)
    );
  }

  handleImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    image.onerror = null;
    image.src = this.fallbackImage;
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  checkSafety(destination: string): void {
    this.router.navigate(['/dashboard'], {
      queryParams: { destination }
    });
  }
}
