import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SiteSettingService } from '../../core/services/site-setting.service';
import { PromptService } from '../../core/services/prompt.service';
import { ContactService } from '../../core/services/contact.service';
import { LanguageService } from '../../core/services/language.service';
import { SiteSetting } from '../../core/models/site-setting.model';
import { Prompt } from '../../core/models/prompt.model';
import { FeaturedVideo, extractYouTubeId } from '../../core/models/featured-video.model';
import { PromptCardComponent } from '../../shared/components/prompt-card/prompt-card.component';
import { AdSlotComponent } from '../../shared/components/ad-slot/ad-slot.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PromptCardComponent,
    AdSlotComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private fb = inject(FormBuilder);
  private sanitizer = inject(DomSanitizer);
  siteSettingService = inject(SiteSettingService);
  promptService = inject(PromptService);
  contactService = inject(ContactService);
  langService = inject(LanguageService);

  settings?: SiteSetting;
  featuredPrompts: Prompt[] = [];
  featuredVideos: { video: FeaturedVideo; safeUrl?: SafeResourceUrl }[] = [];

  contactForm!: FormGroup;
  isSubmitting = false;
  submitSuccessMessage: string | null = null;
  submitErrorMessage: string | null = null;

  ngOnInit(): void {
    this.initContactForm();

    this.siteSettingService.getSettings().subscribe(settings => {
      this.settings = settings;
    });

    this.promptService.getFeaturedLivePrompts(3).subscribe(prompts => {
      this.featuredPrompts = prompts;
    });

    this.siteSettingService.getActiveVideos().subscribe(videos => {
      this.featuredVideos = videos.map(v => {
        const ytid = extractYouTubeId(v.videoUrlOrId);
        const safeUrl = ytid
          ? this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${ytid}`)
          : undefined;
        return { video: v, safeUrl };
      });
    });
  }

  private initContactForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', [Validators.required, Validators.minLength(5)]],
      website: [''] // Honeypot field for bot trapping
    });
  }

  onSubmitContact(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitSuccessMessage = null;
    this.submitErrorMessage = null;

    this.contactService.submitContactForm(this.contactForm.value).subscribe({
      next: res => {
        this.isSubmitting = false;
        if (res.success) {
          this.submitSuccessMessage = res.message;
          this.contactForm.reset();
        } else {
          this.submitErrorMessage = res.message;
        }
      },
      error: () => {
        this.isSubmitting = false;
        this.submitErrorMessage = 'Network error while submitting. Please check your connection or reach out via email.';
      }
    });
  }
}
