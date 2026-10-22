import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SafetyService } from '../../services/safety.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  destination = '';
  safetyMessage = '';
  showSafetyResult = false;

  destinationImage = '';
  safetyData: any = null;

  constructor(
    private router: Router,
    private safetyService: SafetyService
  ) {}

  getRiskClass(risk: string | undefined): string {
    if (!risk) return 'unknown-risk';

    const normalizedRisk = risk.toLowerCase();

    if (normalizedRisk.includes('high')) return 'high-risk';
    if (normalizedRisk.includes('moderate')) return 'moderate-risk';
    if (normalizedRisk.includes('low')) return 'low-risk';

    return 'unknown-risk';
  }

  getCategoryRisk(category: string): string {
    if (!this.safetyData) return 'Not checked';

    const categoryData = this.safetyData[category];

    return categoryData?.risk ?? categoryData?.level ?? 'Unavailable';
  }

  logout(): void {
    sessionStorage.removeItem('safetravel_token');
    sessionStorage.removeItem('safetravel_user');
    this.router.navigate(['/login']);
  }

  handleDestinationImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    image.onerror = null;
    image.src =
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=80';
  }

  checkSafety(): void {
    const place = this.destination.trim();

    if (!place) {
      this.safetyMessage = 'Please enter a destination first.';
      this.showSafetyResult = false;
      this.safetyData = null;
      this.destinationImage = '';
      return;
    }

    this.safetyMessage = '';
    this.showSafetyResult = false;

    this.safetyService.checkSafety(place).subscribe({
      next: (data: any) => {
        this.safetyData = data;
        this.destinationImage = data.destinationImage || '';
        this.showSafetyResult = true;

        console.log('Safety data:', data);
      },

      error: (error) => {
        console.error('Safety API error:', error);

        this.safetyMessage = 'Could not fetch safety information.';
        this.showSafetyResult = false;
        this.safetyData = null;
        this.destinationImage = '';
      }
    });
  }
}