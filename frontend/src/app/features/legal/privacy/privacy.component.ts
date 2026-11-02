import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SiteSettingService } from '../../../core/services/site-setting.service';
import { SiteSetting } from '../../../core/models/site-setting.model';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-5" style="max-width: 860px;">
      <div class="glass-card p-4 p-md-5">
        <div class="section-kicker">Legal & Transparency</div>
        <h1 class="display-6 fw-bold text-white mb-4">Privacy Policy</h1>

        <div class="alert alert-info border-info border-opacity-25 bg-dark bg-opacity-50 small mb-4">
          <strong>Notice to Site Owner:</strong> This document outlines standard privacy practices for {{ brand }}. Please review and update contact details or specific analytics disclosures before full public production use.
        </div>

        <div class="text-secondary d-flex flex-column gap-3">
          <p>Last updated: October 2026</p>

          <h2 class="fs-4 fw-bold text-white mt-3">1. Information We Collect</h2>
          <p>
            When you use our website, we only collect information that you voluntarily provide to us through our direct contact form, including your name, email address, subject, and message content.
          </p>

          <h2 class="fs-4 fw-bold text-white mt-3">2. How We Use Your Information</h2>
          <p>
            We use the submitted information solely to respond to your inquiries, provide creator support, and discuss collaboration or consulting opportunities. We do not sell, rent, or trade your personal information to third parties or advertisers.
          </p>

          <h2 class="fs-4 fw-bold text-white mt-3">3. Cookies and Local Storage</h2>
          <p>
            We use basic cookies strictly necessary for website operation, security (anti-forgery tokens), and remembering your preferred interface language (English or Hindi). We do not use intrusive third-party cross-site tracking cookies.
          </p>

          <h2 class="fs-4 fw-bold text-white mt-3">4. External Links and Embedded Media</h2>
          <p>
            Our website links to external platforms such as Facebook, YouTube, Instagram, and LinkedIn. Embedded YouTube players adhere to YouTube's Privacy-Enhanced Mode (youtube-nocookie.com). We encourage you to review the privacy policies of any third-party websites you visit.
          </p>

          <h2 class="fs-4 fw-bold text-white mt-3">5. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy or wish to have your contact form submission removed, please reach out directly at <a [href]="'mailto:' + email" class="text-info">{{ email }}</a>.
          </p>
        </div>
      </div>
    </div>
  `
})
export class PrivacyComponent implements OnInit {
  private siteSettingService = inject(SiteSettingService);
  brand = 'Amit Verma Digital 2.0';
  email = 'amitvermadigital2.0@gmail.com';

  ngOnInit(): void {
    this.siteSettingService.getSettings().subscribe(settings => {
      if (settings) {
        this.brand = settings.brandName || this.brand;
        this.email = settings.contactEmail || this.email;
      }
    });
  }
}
