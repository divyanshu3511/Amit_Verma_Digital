import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SiteSettingService } from '../../../core/services/site-setting.service';
import { SiteSetting } from '../../../core/models/site-setting.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="border-top border-secondary border-opacity-25 mt-5 pt-5 pb-4 bg-dark bg-opacity-50">
      <div class="container">
        <div class="row g-4 justify-content-between">
          <!-- Brand Column -->
          <div class="col-lg-4 col-md-6">
            <div class="d-flex align-items-center gap-2 mb-3">
              <img [src]="settings?.avatarPath || 'images/avatar.png'"
                   [alt]="settings?.brandName || 'Amit Verma Digital 2.0'"
                   width="36" height="36"
                   class="rounded-circle border border-primary object-fit-cover" />
              <span class="fw-bold fs-5 text-white">{{ settings?.brandName || 'Amit Verma Digital 2.0' }}</span>
            </div>
            <p class="text-secondary small mb-3">
              {{ settings?.tagline || 'Helping Creators Grow Faster' }}. Facebook growth education, viral Reels guidance, monetization strategies, and AI prompt library from Lucknow, India.
            </p>
            <div class="d-flex align-items-center gap-2">
              @if (settings?.facebookPageUrl) {
                <a [href]="settings?.facebookPageUrl" target="_blank" rel="noopener noreferrer" class="btn btn-glass btn-sm p-2 rounded-circle" title="Facebook" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07"/></svg>
                </a>
              }
              @if (settings?.instagramUrl) {
                <a [href]="settings?.instagramUrl" target="_blank" rel="noopener noreferrer" class="btn btn-glass btn-sm p-2 rounded-circle" title="Instagram" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0m0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88"/></svg>
                </a>
              }
              @if (settings?.youTubeChannelUrl) {
                <a [href]="settings?.youTubeChannelUrl" target="_blank" rel="noopener noreferrer" class="btn btn-glass btn-sm p-2 rounded-circle" title="YouTube" aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81M9.55 15.57V8.43L15.82 12z"/></svg>
                </a>
              }
              @if (settings?.linkedInUrl) {
                <a [href]="settings?.linkedInUrl" target="_blank" rel="noopener noreferrer" class="btn btn-glass btn-sm p-2 rounded-circle" title="LinkedIn" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13M7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0"/></svg>
                </a>
              }
            </div>
          </div>

          <!-- Quick Navigation -->
          <div class="col-lg-2 col-md-3 col-6">
            <h6 class="text-white text-uppercase fs-6 mb-3">Explore</h6>
            <ul class="list-unstyled d-flex flex-column gap-2 small">
              <li><a routerLink="/" class="text-secondary text-decoration-none hover-white">Home</a></li>
              <li><a routerLink="/" fragment="about" class="text-secondary text-decoration-none hover-white">Creator Story</a></li>
              <li><a routerLink="/" fragment="topics" class="text-secondary text-decoration-none hover-white">Growth Topics</a></li>
              <li><a routerLink="/prompts" class="text-secondary text-decoration-none hover-white">Prompt Library</a></li>
              <li><a routerLink="/" fragment="videos" class="text-secondary text-decoration-none hover-white">Tutorial Videos</a></li>
              <li><a routerLink="/" fragment="contact" class="text-secondary text-decoration-none hover-white">Contact & Collabs</a></li>
            </ul>
          </div>

          <!-- Legal & Admin -->
          <div class="col-lg-2 col-md-3 col-6">
            <h6 class="text-white text-uppercase fs-6 mb-3">Legal & Admin</h6>
            <ul class="list-unstyled d-flex flex-column gap-2 small">
              <li><a routerLink="/privacy" class="text-secondary text-decoration-none hover-white">Privacy Policy</a></li>
              <li><a routerLink="/terms" class="text-secondary text-decoration-none hover-white">Terms of Service</a></li>
              <li><a routerLink="/admin" class="text-secondary text-decoration-none hover-white">Admin Dashboard</a></li>
            </ul>
          </div>

          <!-- Location & Audience -->
          <div class="col-lg-3 col-md-12">
            <h6 class="text-white text-uppercase fs-6 mb-3">Creator Hub</h6>
            <div class="d-flex flex-column gap-2 text-secondary small">
              <div class="d-flex align-items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>{{ settings?.location || 'Lucknow, Uttar Pradesh, India' }}</span>
              </div>
              <div class="d-flex align-items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-warning"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                <span>{{ settings?.followerCountDisplay || '39K' }} Community Followers</span>
              </div>
              <div class="d-flex align-items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-info"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span>{{ settings?.contactEmail || 'amitvermadigital2.0@gmail.com' }}</span>
              </div>
            </div>
          </div>
        </div>

        <hr class="border-secondary border-opacity-25 my-4" />

        <div class="d-flex flex-wrap align-items-center justify-content-between small text-secondary">
          <div>
            &copy; {{ currentYear }} <strong>{{ settings?.brandName || 'Amit Verma Digital 2.0' }}</strong>. All rights reserved.
          </div>
          <div>
            Crafted for creators scaling with AI & organic video strategies.
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
    }
    .hover-white:hover {
      color: #FFFFFF !important;
    }
  `]
})
export class FooterComponent implements OnInit {
  siteSettingService = inject(SiteSettingService);
  settings?: SiteSetting;
  currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.siteSettingService.getSettings().subscribe(settings => {
      this.settings = settings;
    });
  }
}
