import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  login(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    this.isLoading = true;

    this.http.post<any>(`${this.apiUrl}/login`, {
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (!response?.token || !response?.user) {
          this.errorMessage =
            'Unexpected server response. Please try again.';
          return;
        }

        sessionStorage.setItem('safetravel_token', response.token);
        sessionStorage.setItem(
          'safetravel_user',
          JSON.stringify(response.user)
        );

        const role = String(
          response.user.role ?? ''
        ).trim().toLowerCase();
        console.log('LOGIN ROLE:', role);
        console.log('LOGIN USER:', response.user);


        this.successMessage = 'Login successful!';

       if (role === 'admin') {
  window.location.href = '/admin';
} else {
  window.location.href = '/dashboard';
}
      },

      error: (error) => {
        this.isLoading = false;

        this.errorMessage =
          error.error?.message ||
          'Unable to connect to the server. Please try again.';
      }
    });
  }
}
