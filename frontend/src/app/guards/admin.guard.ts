import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);

  const token = sessionStorage.getItem('safetravel_token');
  const userData = sessionStorage.getItem('safetravel_user');

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  try {
    const user = userData ? JSON.parse(userData) : null;
    const role = String(user?.role ?? '').trim().toLowerCase();

    if (role === 'admin') {
      return true;
    }

    return router.createUrlTree(['/dashboard']);
  } catch {
    return router.createUrlTree(['/login']);
  }
};
