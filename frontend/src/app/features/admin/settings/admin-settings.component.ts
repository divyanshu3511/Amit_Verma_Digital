import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SiteSettingService } from '../../../core/services/site-setting.service';
import { ToastService } from '../../../core/services/toast.service';
import { SiteSetting } from '../../../core/models/site-setting.model';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="glass-card p-4 p-md-5 mb-5" style="max-width: 960px;">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 class="fs-4 fw-bold text-white mb-1">Website Settings & Brand Identity</h2>
          <p class="text-secondary small mb-0">Configure branding, social links, contact info, images, and optional ad slots.</p>
        </div>
        <a routerLink="/" target="_blank" class="btn btn-glass btn-sm">Preview Website &rarr;</a>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <!-- 1. Brand Identity -->
        <div class="mb-5">
          <h3 class="fs-5 fw-bold text-white pb-2 mb-3 border-bottom border-secondary border-opacity-25">1. Brand & Header Identity</h3>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label text-white small fw-semibold">Brand Name *</label>
              <input type="text" formControlName="brandName" class="form-control admin-input" />
            </div>

            <div class="col-md-6">
              <label class="form-label text-white small fw-semibold">Category Badge *</label>
              <input type="text" formControlName="category" class="form-control admin-input" />
            </div>

            <div class="col-md-6">
              <label class="form-label text-white small fw-semibold">Tagline *</label>
              <input type="text" formControlName="tagline" class="form-control admin-input" />
            </div>

            <div class="col-md-6">
              <label class="form-label text-white small fw-semibold">Positioning Subtitle</label>
              <input type="text" formControlName="positioning" class="form-control admin-input" />
            </div>

            <div class="col-md-6">
              <label class="form-label text-white small fw-semibold">Follower Count Display *</label>
              <input type="text" formControlName="followerCountDisplay" class="form-control admin-input" placeholder="39K" />
              <span class="text-secondary small">Easily updated as your audience grows.</span>
            </div>

            <div class="col-md-6">
              <label class="form-label text-white small fw-semibold">Location *</label>
              <input type="text" formControlName="location" class="form-control admin-input" />
            </div>
          </div>
        </div>

        <!-- 2. Hero Headlines & Content -->
        <div class="mb-5">
          <h3 class="fs-5 fw-bold text-white pb-2 mb-3 border-bottom border-secondary border-opacity-25">2. Hero Section Headlines (Bilingual)</h3>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label text-white small fw-semibold">Hero Heading (English) *</label>
              <textarea formControlName="heroHeadline" class="form-control admin-textarea" rows="2"></textarea>
            </div>

            <div class="col-md-6">
              <label class="form-label text-white small fw-semibold">Hero Heading (Hindi)</label>
              <textarea formControlName="heroHeadlineHi" class="form-control admin-textarea" rows="2"></textarea>
            </div>

            <div class="col-md-6">
              <label class="form-label text-white small fw-semibold">Hero Subtitle / Description (English) *</label>
              <textarea formControlName="heroDescription" class="form-control admin-textarea" rows="3"></textarea>
            </div>

            <div class="col-md-6">
              <label class="form-label text-white small fw-semibold">Hero Subtitle / Description (Hindi)</label>
              <textarea formControlName="heroDescriptionHi" class="form-control admin-textarea" rows="3"></textarea>
            </div>
          </div>
        </div>

        <!-- 3. Images Management -->
        <div class="mb-5">
          <h3 class="fs-5 fw-bold text-white pb-2 mb-3 border-bottom border-secondary border-opacity-25">3. Creator Visual Assets</h3>
          <div class="row g-4">
            <!-- Avatar -->
            <div class="col-md-4">
              <div class="p-3 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25 h-100">
                <label class="form-label text-white small fw-semibold mb-2">Profile Avatar / Logo</label>
                <div class="mb-2 text-center">
                  <img [src]="form.get('avatarPath')?.value || '/images/avatar.png'" alt="Avatar" width="70" height="70" class="rounded-circle border border-primary object-fit-cover" />
                </div>
                <input type="text" formControlName="avatarPath" class="form-control admin-input mb-2 small" placeholder="/images/avatar.png" />
              </div>
            </div>

            <!-- Cover Image -->
            <div class="col-md-4">
              <div class="p-3 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25 h-100">
                <label class="form-label text-white small fw-semibold mb-2">Hero Cover Banner</label>
                <div class="mb-2 text-center rounded overflow-hidden" style="max-height: 70px;">
                  <img [src]="form.get('coverImagePath')?.value || '/images/cover.jpg'" alt="Cover" class="img-fluid object-fit-cover" style="max-height: 70px;" />
                </div>
                <input type="text" formControlName="coverImagePath" class="form-control admin-input mb-2 small" placeholder="/images/cover.jpg" />
              </div>
            </div>

            <!-- Portrait Image -->
            <div class="col-md-4">
              <div class="p-3 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25 h-100">
                <label class="form-label text-white small fw-semibold mb-2">Creator Portrait Photo</label>
                <div class="mb-2 text-center">
                  <img [src]="form.get('portraitImagePath')?.value || '/images/portrait.jpg'" alt="Portrait" width="70" height="70" class="rounded-3 border border-secondary object-fit-cover" />
                </div>
                <input type="text" formControlName="portraitImagePath" class="form-control admin-input mb-2 small" placeholder="/images/portrait.jpg" />
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Social Links & Contact -->
        <div class="mb-5">
          <h3 class="fs-5 fw-bold text-white pb-2 mb-3 border-bottom border-secondary border-opacity-25">4. Social Channels & Direct Contact</h3>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label text-white small fw-semibold">Facebook Page URL</label>
              <input type="url" formControlName="facebookPageUrl" class="form-control admin-input" />
            </div>

            <div class="col-md-6">
              <label class="form-label text-white small fw-semibold">Instagram URL</label>
              <input type="url" formControlName="instagramUrl" class="form-control admin-input" />
            </div>

            <div class="col-md-6">
              <label class="form-label text-white small fw-semibold">YouTube Channel URL</label>
              <input type="url" formControlName="youTubeChannelUrl" class="form-control admin-input" />
            </div>

            <div class="col-md-6">
              <label class="form-label text-white small fw-semibold">LinkedIn Profile URL</label>
              <input type="url" formControlName="linkedInUrl" class="form-control admin-input" />
            </div>

            <div class="col-md-6">
              <label class="form-label text-white small fw-semibold">Contact Email *</label>
              <input type="email" formControlName="contactEmail" class="form-control admin-input" />
            </div>

            <div class="col-md-6">
              <label class="form-label text-white small fw-semibold">WhatsApp Number (Optional)</label>
              <input type="text" formControlName="whatsAppNumber" class="form-control admin-input" />
            </div>

            <div class="col-12">
              <label class="form-label text-white small fw-semibold">Public Business Collaboration Note</label>
              <textarea formControlName="businessNote" class="form-control admin-textarea" rows="2"></textarea>
            </div>
          </div>
        </div>

        <!-- 5. Optional Advertisement Slots -->
        <div class="mb-5">
          <h3 class="fs-5 fw-bold text-white pb-2 mb-3 border-bottom border-secondary border-opacity-25">5. Optional Advertisement Slots</h3>
          <p class="text-secondary small mb-4">
            Configure up to two promotional banner slots. Ad slots remain hidden unless explicitly enabled with valid image and destination URLs.
          </p>

          <div class="row g-4">
            <!-- Ad Slot 1 -->
            <div class="col-lg-6">
              <div class="p-4 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25 h-100">
                <div class="form-check form-switch mb-3">
                  <input formControlName="adSlot1Enabled" class="form-check-input" type="checkbox" id="adSlot1Switch" />
                  <label class="form-check-label text-white fw-bold" for="adSlot1Switch">
                    Enable Ad Slot 1 (Homepage Top)
                  </label>
                </div>

                <div class="mb-3">
                  <label class="form-label text-white small">Banner Image URL</label>
                  <input type="url" formControlName="adSlot1ImageUrl" class="form-control admin-input" placeholder="https://example.com/banner.png" />
                </div>

                <div class="mb-3">
                  <label class="form-label text-white small">Destination Link URL</label>
                  <input type="url" formControlName="adSlot1TargetUrl" class="form-control admin-input" placeholder="https://partner.com?ref=amit" />
                </div>

                <div>
                  <label class="form-label text-white small">Alt Text</label>
                  <input type="text" formControlName="adSlot1AltText" class="form-control admin-input" placeholder="Featured Partner" />
                </div>
              </div>
            </div>

            <!-- Ad Slot 2 -->
            <div class="col-lg-6">
              <div class="p-4 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25 h-100">
                <div class="form-check form-switch mb-3">
                  <input formControlName="adSlot2Enabled" class="form-check-input" type="checkbox" id="adSlot2Switch" />
                  <label class="form-check-label text-white fw-bold" for="adSlot2Switch">
                    Enable Ad Slot 2 (Prompts Footer)
                  </label>
                </div>

                <div class="mb-3">
                  <label class="form-label text-white small">Banner Image URL</label>
                  <input type="url" formControlName="adSlot2ImageUrl" class="form-control admin-input" placeholder="https://example.com/banner2.png" />
                </div>

                <div class="mb-3">
                  <label class="form-label text-white small">Destination Link URL</label>
                  <input type="url" formControlName="adSlot2TargetUrl" class="form-control admin-input" placeholder="https://sponsor.com" />
                </div>

                <div>
                  <label class="form-label text-white small">Alt Text</label>
                  <input type="text" formControlName="adSlot2AltText" class="form-control admin-input" placeholder="Sponsored Resource" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-3 border-top border-secondary border-opacity-25 d-flex gap-3">
          <button type="submit" [disabled]="form.invalid || isSaving" class="btn btn-primary-gradient px-4 py-2">
            <span>{{ isSaving ? 'Saving...' : 'Save All Settings' }}</span>
          </button>
          <a routerLink="/admin" class="btn btn-glass px-4 py-2">Cancel</a>
        </div>
      </form>
    </div>
  `
})
export class AdminSettingsComponent implements OnInit {
  form!: FormGroup;
  isSaving = false;
  currentSettings?: SiteSetting;

  constructor(
    private fb: FormBuilder,
    private settingService: SiteSettingService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSettings();
  }

  initForm(): void {
    this.form = this.fb.group({
      id: [1],
      brandName: ['', Validators.required],
      tagline: ['', Validators.required],
      category: ['', Validators.required],
      positioning: [''],
      followerCountDisplay: ['39K', Validators.required],
      location: ['', Validators.required],
      heroHeadline: ['', Validators.required],
      heroHeadlineHi: [''],
      heroDescription: ['', Validators.required],
      heroDescriptionHi: [''],
      avatarPath: ['/images/avatar.png'],
      coverImagePath: ['/images/cover.jpg'],
      portraitImagePath: ['/images/portrait.jpg'],
      facebookPageUrl: [''],
      instagramUrl: [''],
      youTubeChannelUrl: [''],
      linkedInUrl: [''],
      contactEmail: ['', [Validators.required, Validators.email]],
      whatsAppNumber: [''],
      businessNote: [''],
      adSlot1Enabled: [false],
      adSlot1ImageUrl: [''],
      adSlot1TargetUrl: [''],
      adSlot1AltText: [''],
      adSlot2Enabled: [false],
      adSlot2ImageUrl: [''],
      adSlot2TargetUrl: [''],
      adSlot2AltText: ['']
    });
  }

  loadSettings(): void {
    this.settingService.getSettings().subscribe(s => {
      this.currentSettings = s;
      this.form.patchValue(s);
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const updated = {
      ...(this.currentSettings || {}),
      ...this.form.value
    };

    this.settingService.updateSettings(updated).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastService.show('Website settings updated successfully!', 'success');
      },
      error: () => {
        this.isSaving = false;
        this.toastService.show('Failed to save settings.', 'error');
      }
    });
  }
}
