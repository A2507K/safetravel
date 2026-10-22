import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  AdminService,
  AdminUser,
  AdminDestination
} from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  adminName = 'Administrator';

  // User management
  users: AdminUser[] = [];
  totalUsers = 0;
  totalAdmins = 0;

  isLoading = true;
  errorMessage = '';
  searchTerm = '';

  // Destination management
  destinations: AdminDestination[] = [];
  destinationSearchTerm = '';

  isDestinationsLoading = false;
  destinationErrorMessage = '';
  destinationSuccessMessage = '';

  showDestinationForm = false;
  isSavingDestination = false;
  editingDestinationId: string | null = null;

  destinationForm: AdminDestination = this.emptyDestination();

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadDestinations();
  }

  private emptyDestination(): AdminDestination {
    return {
      name: '',
      country: '',
      description: '',
      image: '',
      category: 'General'
    };
  }

  // =========================
  // USER MANAGEMENT
  // =========================

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminService.getUsers().subscribe({
      next: (response) => {
        this.users = response.users || [];
        this.totalUsers = this.users.length;

        this.totalAdmins = this.users.filter(
          user => user.role === 'admin'
        ).length;

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load users:', error);

        this.errorMessage =
          error.status === 401 || error.status === 403
            ? 'You are not authorized to view users. Please log in again.'
            : 'Unable to load users. Please check your backend server.';

        this.isLoading = false;
      }
    });
  }

  get filteredUsers(): AdminUser[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.users;
    }

    return this.users.filter(user =>
      (user.name || '').toLowerCase().includes(term) ||
      (user.email || '').toLowerCase().includes(term) ||
      (user.role || '').toLowerCase().includes(term)
    );
  }

  // =========================
  // DESTINATION MANAGEMENT
  // =========================

  loadDestinations(): void {
    this.isDestinationsLoading = true;
    this.destinationErrorMessage = '';

    this.adminService.getDestinations().subscribe({
      next: (response: any) => {
        this.destinations = Array.isArray(response)
          ? response
          : response?.destinations || [];

        this.isDestinationsLoading = false;
      },
      error: (error) => {
        console.error('Failed to load destinations:', error);

        this.destinationErrorMessage =
          error.status === 401 || error.status === 403
            ? 'Admin authorization failed. Please log in again.'
            : 'Unable to load destinations. Check your backend and database.';

        this.isDestinationsLoading = false;
      }
    });
  }

  get filteredDestinations(): AdminDestination[] {
    const term = this.destinationSearchTerm.trim().toLowerCase();

    if (!term) {
      return this.destinations;
    }

    return this.destinations.filter(destination =>
      (destination.name || '').toLowerCase().includes(term) ||
      (destination.country || '').toLowerCase().includes(term) ||
      (destination.category || '').toLowerCase().includes(term)
    );
  }

  openAddDestinationForm(): void {
    this.editingDestinationId = null;
    this.destinationForm = this.emptyDestination();
    this.destinationErrorMessage = '';
    this.destinationSuccessMessage = '';
    this.showDestinationForm = true;
  }

  editDestination(destination: AdminDestination): void {
    if (!destination._id) {
      this.destinationErrorMessage =
        'This destination has no ID and cannot be edited.';
      return;
    }

    this.editingDestinationId = destination._id;

    this.destinationForm = {
      name: destination.name,
      country: destination.country,
      description: destination.description,
      image: destination.image,
      category: destination.category || 'General'
    };

    this.destinationErrorMessage = '';
    this.destinationSuccessMessage = '';
    this.showDestinationForm = true;
  }

  cancelDestinationForm(): void {
    this.showDestinationForm = false;
    this.editingDestinationId = null;
    this.destinationForm = this.emptyDestination();
  }

  saveDestination(): void {
    this.destinationErrorMessage = '';
    this.destinationSuccessMessage = '';

    const payload: AdminDestination = {
      name: this.destinationForm.name.trim(),
      country: this.destinationForm.country.trim(),
      description: this.destinationForm.description.trim(),
      image: this.destinationForm.image.trim(),
      category: this.destinationForm.category.trim() || 'General'
    };

    if (
      !payload.name ||
      !payload.country ||
      !payload.description ||
      !payload.image
    ) {
      this.destinationErrorMessage =
        'Please complete all required destination fields.';
      return;
    }

    try {
      const imageUrl = new URL(payload.image);

      if (
        imageUrl.protocol !== 'https:' &&
        imageUrl.protocol !== 'http:'
      ) {
        throw new Error('Invalid image URL');
      }
    } catch {
      this.destinationErrorMessage =
        'Please enter a valid image URL beginning with https:// or http://.';
      return;
    }

    this.isSavingDestination = true;

    const request = this.editingDestinationId
      ? this.adminService.updateDestination(
          this.editingDestinationId,
          payload
        )
      : this.adminService.addDestination(payload);

    request.subscribe({
      next: () => {
        this.isSavingDestination = false;

        this.destinationSuccessMessage = this.editingDestinationId
          ? 'Destination updated successfully!'
          : 'Destination added successfully!';

        this.showDestinationForm = false;
        this.editingDestinationId = null;
        this.destinationForm = this.emptyDestination();

        this.loadDestinations();
      },
      error: (error) => {
        console.error('Failed to save destination:', error);

        this.isSavingDestination = false;

        this.destinationErrorMessage =
          error.status === 401 || error.status === 403
            ? 'You are not authorized. Please log in again as an administrator.'
            : error.status === 409
              ? 'A destination with this name and country already exists.'
              : error.error?.message ||
                'Could not save the destination. Please try again.';
      }
    });
  }

  deleteDestination(destination: AdminDestination): void {
    if (!destination._id) {
      this.destinationErrorMessage =
        'This destination has no ID and cannot be deleted.';
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${destination.name}?`
    );

    if (!confirmed) {
      return;
    }

    this.destinationErrorMessage = '';
    this.destinationSuccessMessage = '';

    this.adminService.deleteDestination(destination._id).subscribe({
      next: () => {
        this.destinationSuccessMessage =
          `${destination.name} deleted successfully!`;

        this.loadDestinations();
      },
      error: (error) => {
        console.error('Failed to delete destination:', error);

        this.destinationErrorMessage =
          error.status === 401 || error.status === 403
            ? 'You are not authorized to delete destinations.'
            : error.error?.message ||
              'Could not delete the destination. Please try again.';
      }
    });
  }

  logout(): void {
    sessionStorage.removeItem('safetravel_token');
    sessionStorage.removeItem('safetravel_user');

    window.location.href = '/login';
  }
}