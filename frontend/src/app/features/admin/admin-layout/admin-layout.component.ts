import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { IstDatePipe } from '../../../core/pipes/ist-date.pipe';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, IstDatePipe],
  template: `
    <div class="admin-body">
      <div class="admin-wrapper">
        <!-- Sidebar Navigation -->
        <aside class="admin-sidebar" [class.open]="sidebarOpen">
          <div class="admin-sidebar-header">
            <img src="/images/avatar.png" alt="Admin" width="36" height="36" class="rounded-circle border border-primary object-fit-cover" />
            <div class="lh-sm">
              <span class="fw-bold text-white fs-6 d-block">{{ authService.currentUser?.name || 'Amit Verma' }}</span>
              <span class="text-secondary small" style="font-size: 0.75rem;">Digital 2.0 Admin</span>
            </div>
          </div>

          <ul class="admin-nav">
            <li class="admin-nav-item">
              <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="admin-nav-link" (click)="closeSidebarOnMobile()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>Dashboard</span>
              </a>
            </li>

            <li class="admin-nav-item">
              <a routerLink="/admin/prompts" routerLinkActive="active" class="admin-nav-link" (click)="closeSidebarOnMobile()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <span>Prompt Library</span>
              </a>
            </li>

            <li class="admin-nav-item">
              <a routerLink="/admin/settings" routerLinkActive="active" class="admin-nav-link" (click)="closeSidebarOnMobile()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span>Site Settings & Ads</span>
              </a>
            </li>

            <li class="admin-nav-item">
              <a routerLink="/admin/videos" routerLinkActive="active" class="admin-nav-link" (click)="closeSidebarOnMobile()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                <span>Featured Videos</span>
              </a>
            </li>

            <li class="admin-nav-item">
              <a routerLink="/admin/messages" routerLinkActive="active" class="admin-nav-link" (click)="closeSidebarOnMobile()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>Messages</span>
              </a>
            </li>

            <hr class="border-secondary border-opacity-25 my-3" />

            <li class="admin-nav-item">
              <a routerLink="/" target="_blank" class="admin-nav-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                <span>View Public Site</span>
              </a>
            </li>
          </ul>

          <!-- Sidebar Footer -->
          <div class="p-3 border-top border-secondary border-opacity-25 mt-auto">
            <a routerLink="/" class="btn btn-glass btn-sm w-100 justify-content-center text-info border-info border-opacity-25">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              <span>Back to Site</span>
            </a>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="admin-content">
          <!-- Topbar Header -->
          <div class="d-flex flex-wrap align-items-center justify-content-between pb-3 mb-4 border-bottom border-secondary border-opacity-25 gap-3">
            <div class="d-flex align-items-center gap-3">
              <button class="btn btn-glass btn-sm d-lg-none" type="button" (click)="toggleSidebar()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
              <div>
                <h1 class="fs-4 fw-bold text-white mb-0">Admin Control Center</h1>
              </div>
            </div>

            <div class="d-flex align-items-center gap-3">
              <span class="badge-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-info">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {{ currentIstTime | istDate:'full' }}
              </span>
              <span class="badge-pill verified">
                Admin: {{ authService.currentUser?.name || 'Amit Verma' }}
              </span>
            </div>
          </div>

          <!-- Dynamic Child Routes -->
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      background: #080C14;
    }
  `]
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  sidebarOpen = false;
  currentIstTime = new Date();
  private timer: any;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.currentIstTime = new Date();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebarOnMobile(): void {
    if (window.innerWidth < 992) {
      this.sidebarOpen = false;
    }
  }
}
