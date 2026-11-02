import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SiteSettingService } from '../../../core/services/site-setting.service';
import { LanguageService } from '../../../core/services/language.service';
import { SiteSetting } from '../../../core/models/site-setting.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="sticky-top navbar-custom py-2">
      <div class="container d-flex align-items-center justify-content-between">
        <!-- Brand Logo & Title -->
        <a routerLink="/" class="d-flex align-items-center gap-2 text-decoration-none text-white">
          <img [src]="settings?.avatarPath || 'images/avatar.png'"
               [alt]="settings?.brandName || 'Amit Verma Digital 2.0'"
               width="40" height="40"
               class="rounded-circle border border-2 border-primary shadow-sm object-fit-cover" />
          <div class="lh-sm">
            <span class="fw-bold fs-5 d-block">Amit Verma <span class="text-gradient">Digital 2.0</span></span>
          </div>
        </a>

        <!-- Desktop Navigation -->
        <nav class="d-none d-lg-flex align-items-center gap-1" aria-label="Main Navigation">
          <a routerLink="/" class="nav-link-custom">{{ langService.isHindi ? 'होम' : 'Home' }}</a>
          <a routerLink="/" fragment="about" class="nav-link-custom">{{ langService.isHindi ? 'परिचय' : 'About' }}</a>
          <a routerLink="/" fragment="topics" class="nav-link-custom">{{ langService.isHindi ? 'गाइड्स' : 'Topics' }}</a>
          <a routerLink="/prompts" routerLinkActive="active" class="nav-link-custom">{{ langService.isHindi ? 'प्रॉम्प्ट लाइब्रेरी' : 'Prompt Library' }}</a>
          <a routerLink="/" fragment="videos" class="nav-link-custom">{{ langService.isHindi ? 'वीडियो' : 'Videos' }}</a>
          <a routerLink="/" fragment="contact" class="nav-link-custom">{{ langService.isHindi ? 'संपर्क' : 'Contact' }}</a>
        </nav>

        <!-- Right Action Buttons -->
        <div class="d-none d-lg-flex align-items-center gap-2">
          <!-- Language Switcher -->
          <button (click)="langService.toggleLanguage()"
                  class="btn btn-glass btn-sm lang-switcher-btn"
                  [title]="langService.isHindi ? 'Switch to English' : 'हिन्दी में बदलें'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-1">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span>{{ langService.isHindi ? 'English' : 'हिन्दी' }}</span>
          </button>

          <!-- Explore Prompts Button -->
          <a routerLink="/prompts" class="btn btn-primary-gradient btn-sm">
            <span>{{ langService.isHindi ? 'प्रॉम्प्ट्स देखें' : 'Explore Prompts' }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>

        <!-- Mobile Menu Hamburger Button -->
        <button class="btn btn-glass btn-sm d-lg-none"
                (click)="isMobileMenuOpen = !isMobileMenuOpen"
                type="button"
                [attr.aria-expanded]="isMobileMenuOpen"
                aria-label="Toggle navigation">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Mobile Drawer / Dropdown Menu -->
      <div class="d-lg-none border-top border-secondary mt-2 pt-2 px-3 pb-3 bg-dark"
           [class.d-none]="!isMobileMenuOpen"
           id="mobileNav">
        <div class="d-flex flex-column gap-2">
          <a routerLink="/" (click)="closeMobileMenu()" class="nav-link-custom py-2">{{ langService.isHindi ? 'होम' : 'Home' }}</a>
          <a routerLink="/" fragment="about" (click)="closeMobileMenu()" class="nav-link-custom py-2">{{ langService.isHindi ? 'परिचय' : 'About' }}</a>
          <a routerLink="/" fragment="topics" (click)="closeMobileMenu()" class="nav-link-custom py-2">{{ langService.isHindi ? 'गाइड्स' : 'Topics' }}</a>
          <a routerLink="/prompts" (click)="closeMobileMenu()" class="nav-link-custom py-2">{{ langService.isHindi ? 'प्रॉम्प्ट लाइब्रेरी' : 'Prompt Library' }}</a>
          <a routerLink="/" fragment="videos" (click)="closeMobileMenu()" class="nav-link-custom py-2">{{ langService.isHindi ? 'वीडियो' : 'Videos' }}</a>
          <a routerLink="/" fragment="contact" (click)="closeMobileMenu()" class="nav-link-custom py-2">{{ langService.isHindi ? 'संपर्क' : 'Contact' }}</a>
          <hr class="border-secondary my-1" />
          <div class="d-flex align-items-center gap-2 mt-2">
            <button class="btn btn-glass btn-sm flex-fill lang-switcher-btn" (click)="langService.toggleLanguage(); closeMobileMenu()">
              <span>{{ langService.isHindi ? 'Switch to English' : 'हिन्दी में बदलें' }}</span>
            </button>
            <a routerLink="/prompts" (click)="closeMobileMenu()" class="btn btn-primary-gradient btn-sm flex-fill text-center">
              {{ langService.isHindi ? 'प्रॉम्प्ट्स देखें' : 'Explore Prompts' }}
            </a>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HeaderComponent implements OnInit {
  siteSettingService = inject(SiteSettingService);
  langService = inject(LanguageService);

  settings?: SiteSetting;
  isMobileMenuOpen = false;

  ngOnInit(): void {
    this.siteSettingService.getSettings().subscribe(settings => {
      this.settings = settings;
    });
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
