import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="glass-card p-4 p-md-5">
            <div class="text-center mb-4">
              <img src="/images/avatar.png" alt="Amit Verma" width="64" height="64" class="rounded-circle border border-primary mb-3 shadow" />
              <h1 class="fs-4 fw-bold text-white mb-1">Admin Portal</h1>
              <p class="text-secondary small mb-0">Authorized Administrator Access</p>
            </div>

            @if (!authService.isAuthEnabled) {
              <!-- Auth Disabled State -->
              <div class="p-4 rounded-3 bg-dark bg-opacity-60 border border-info border-opacity-25 text-center mb-4">
                <div class="text-info fw-semibold mb-2">Authentication Disabled</div>
                <p class="text-secondary small mb-3">
                  Authentication is currently disabled in the configuration (<code>authEnabled = false</code>). You can browse both the public site and the admin control center freely.
                </p>
                <div class="d-flex flex-column gap-2">
                  <a routerLink="/admin" class="btn btn-primary-gradient btn-sm w-100 justify-content-center">
                    Proceed to Admin Control Center &rarr;
                  </a>
                  <a routerLink="/" class="btn btn-glass btn-sm w-100 justify-content-center">
                    Return to Public Website
                  </a>
                </div>
              </div>
            } @else {
              <!-- Auth Enabled State (Ready for Future API Integration) -->
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label text-white small fw-semibold">Email or Username</label>
                  <input
                    type="text"
                    formControlName="username"
                    class="form-control admin-input"
                    placeholder="admin@amitvermadigital.com"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label text-white small fw-semibold">Password</label>
                  <input
                    type="password"
                    formControlName="password"
                    class="form-control admin-input"
                  />
                </div>

                <div class="form-check mb-4">
                  <input formControlName="rememberMe" class="form-check-input bg-dark border-secondary" type="checkbox" id="rememberMeCheck" />
                  <label class="form-check-label text-secondary small" for="rememberMeCheck">
                    Keep me signed in
                  </label>
                </div>

                <button type="submit" [disabled]="loginForm.invalid" class="btn btn-primary-gradient w-100 py-2 justify-content-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  <span>Sign In</span>
                </button>
              </form>
            }

            <div class="text-center mt-4 pt-3 border-top border-secondary border-opacity-25">
              <a routerLink="/" class="text-secondary small text-decoration-none hover-white">&larr; Return to Public Website</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.authService.login(this.loginForm.value).subscribe(res => {
      if (res.success) {
        this.router.navigate(['/admin']);
      }
    });
  }
}
