import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: any = null;

  constructor(private router: Router) {
    this.loadProfile();
  }

  loadProfile(): void {
    try {
      const savedUser = sessionStorage.getItem('safetravel_user');
      this.user = savedUser ? JSON.parse(savedUser) : null;
    } catch {
      this.user = null;
    }
  }

  get displayName(): string {
    return this.user?.name ||
           this.user?.username ||
           'SafeTravel User';
  }

  get displayEmail(): string {
    return this.user?.email || 'Email not available';
  }

  logout(): void {
    sessionStorage.removeItem('safetravel_token');
    sessionStorage.removeItem('safetravel_user');
    this.router.navigate(['/login']);
  }
}