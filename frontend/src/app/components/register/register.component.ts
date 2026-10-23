
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  errorMessage = '';
  successMessage = '';
  isLoading = false;

private apiUrl = 'https://safetravel-backend-api.onrender.com/api/auth/register';
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.name.trim() || !this.email.trim() ||
        !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must contain at least 6 characters.';
      return;
    }

    this.isLoading = true;

    this.http.post(this.apiUrl, {
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Account created successfully! Redirecting to login...';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.error?.message ||
          error.error?.error ||
          'Registration failed. Please check your backend server.';
      }
    });
  }
}

