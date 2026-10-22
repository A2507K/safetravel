import { Routes } from '@angular/router';

import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DestinationsComponent } from './pages/destinations/destinations.component';
import { TravelPlansComponent } from './pages/travel-plans/travel-plans.component';
import { AlertsComponent } from './pages/alerts/alerts.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  // Open the login page first
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Public pages
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },

  // Admin dashboard — only administrators can access it
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard.component')
        .then(m => m.AdminDashboardComponent)
  },

  // Pages available after login
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'destinations',
    component: DestinationsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'travel-plans',
    component: TravelPlansComponent,
    canActivate: [authGuard]
  },
  {
    path: 'alerts',
    component: AlertsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },

  // Unknown pages redirect to login
  {
    path: '**',
    redirectTo: 'login'
  }
];