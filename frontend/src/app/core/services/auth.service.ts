import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id?: string;
  email: string;
  role: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Centralized feature flag check
  readonly authEnabled: boolean = environment.authEnabled;

  private currentUserSubject = new BehaviorSubject<User | null>({
    email: 'admin@amitvermadigital.com',
    role: 'Admin',
    name: 'Amit Verma'
  });

  currentUser$ = this.currentUserSubject.asObservable();

  get isAuthEnabled(): boolean {
    return this.authEnabled;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * When auth is disabled, isAuthenticated returns true so the admin UI can be browsed
   * and tested without mandatory login blocking or redirects.
   */
  isAuthenticated(): boolean {
    if (!this.authEnabled) {
      return true;
    }
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    if (!this.authEnabled) {
      return true;
    }
    return this.currentUserSubject.value?.role === 'Admin';
  }

  login(credentials: { username: string; password: string }): Observable<{ success: boolean; message?: string }> {
    if (!this.authEnabled) {
      return of({
        success: true,
        message: 'Authentication is currently disabled in development mode.'
      });
    }

    // Future API integration placeholder
    return of({
      success: true
    });
  }

  logout(): Observable<void> {
    if (this.authEnabled) {
      this.currentUserSubject.next(null);
    }
    return of(undefined);
  }
}
