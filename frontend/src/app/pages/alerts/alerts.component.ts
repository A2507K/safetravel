import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SafetyService } from '../../services/safety.service';

interface SafetyAlert {
  category: string;
  risk: string;
  message: string;
  icon: string;
}

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css'
})
export class AlertsComponent {
  destination = '';
  filterRisk = 'All';

  loading = false;
  errorMessage = '';
  searchedDestination = '';
  overallRisk = '';
  alerts: SafetyAlert[] = [];

  constructor(private safetyService: SafetyService) {}

  checkAlerts(): void {
    const place = this.destination.trim();

    if (!place) {
      this.errorMessage = 'Please enter a destination.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.alerts = [];
    this.searchedDestination = '';

    this.safetyService.checkSafety(place).subscribe({
      next: (data: any) => {
        this.loading = false;
        this.searchedDestination = data.destination || place;
        this.overallRisk = data.overallRisk || 'Unknown';

        const categories = [
          { key: 'weather', name: 'Weather', icon: '🌦️' },
          { key: 'health', name: 'Health', icon: '🏥' },
          { key: 'political', name: 'Political Safety', icon: '🌍' },
          {
            key: 'naturalDisasters',
            name: 'Natural Disasters',
            icon: '🌪️'
          }
        ];

        this.alerts = categories
          .filter(category => data[category.key])
          .map(category => ({
            category: category.name,
            icon: category.icon,
            risk: data[category.key].risk || 'Unknown',
            message:
              data[category.key].message ||
              'No additional information is available.'
          }));
      },
      error: (error: any) => {
        this.loading = false;
        this.errorMessage =
          error.status === 401 || error.status === 403
            ? 'Your session may have expired. Please log in again.'
            : error.status === 404
              ? 'Destination not found. Check the spelling and try again.'
              : 'Could not retrieve safety information. Check that the backend is running.';
        console.error('Alerts API error:', error);
      }
    });
  }

  get filteredAlerts(): SafetyAlert[] {
    if (this.filterRisk === 'All') {
      return this.alerts;
    }

    return this.alerts.filter(alert =>
      this.normaliseRisk(alert.risk) === this.filterRisk
    );
  }

  normaliseRisk(risk: string): string {
    const value = (risk || '').toLowerCase();

    if (value.includes('high')) {
      return 'High Risk';
    }

    if (value.includes('moderate') || value.includes('medium')) {
      return 'Moderate';
    }

    if (value.includes('low')) {
      return 'Low Risk';
    }

    return 'Unknown';
  }

  riskClass(risk: string): string {
    switch (this.normaliseRisk(risk)) {
      case 'High Risk':
        return 'high-risk';
      case 'Moderate':
        return 'moderate-risk';
      case 'Low Risk':
        return 'low-risk';
      default:
        return 'unknown-risk';
    }
  }
}