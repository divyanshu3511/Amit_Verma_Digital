import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { PromptService } from '../../../core/services/prompt.service';
import { ToastService } from '../../../core/services/toast.service';
import { Prompt } from '../../../core/models/prompt.model';

@Component({
  selector: 'app-admin-prompt-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="glass-card p-4 p-md-5 mb-5" style="max-width: 900px;">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 class="fs-4 fw-bold text-white mb-1">
            {{ isEditMode ? 'Edit Prompt #' + promptId : 'Create New Prompt' }}
          </h2>
          <p class="text-secondary small mb-0">Fill in the prompt details, scheduling in IST, and step-by-step instructions.</p>
        </div>
        <a routerLink="/admin/prompts" class="btn btn-glass btn-sm">&larr; Back to Prompts</a>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="row g-4">
          <!-- Title -->
          <div class="col-md-8">
            <label class="form-label text-white small fw-semibold">Prompt Title *</label>
            <input
              type="text"
              formControlName="title"
              (blur)="onTitleBlur()"
              class="form-control admin-input"
              placeholder="e.g. Facebook Reels Viral Script Blueprint"
            />
            @if (form.get('title')?.touched && form.get('title')?.invalid) {
              <span class="text-danger small">Title is required (at least 3 characters).</span>
            }
          </div>

          <!-- Category -->
          <div class="col-md-4">
            <label class="form-label text-white small fw-semibold">Category *</label>
            <input
              type="text"
              formControlName="category"
              class="form-control admin-input"
              list="categoryOptions"
              placeholder="e.g. Facebook Reels"
            />
            <datalist id="categoryOptions">
              <option value="Facebook Reels"></option>
              <option value="Facebook Page Growth"></option>
              <option value="Content Creation"></option>
              <option value="Monetization Education"></option>
              <option value="Hashtag Strategy"></option>
              <option value="Engagement Improvement"></option>
              <option value="Video Creation Tips"></option>
              <option value="AI Prompts for Creators"></option>
            </datalist>
            @if (form.get('category')?.touched && form.get('category')?.invalid) {
              <span class="text-danger small">Category is required.</span>
            }
          </div>

          <!-- Slug -->
          <div class="col-md-6">
            <div class="d-flex justify-content-between align-items-center">
              <label class="form-label text-white small fw-semibold">URL Slug</label>
              <button type="button" class="btn btn-link text-info p-0 small text-decoration-none" (click)="autoGenerateSlug()">Auto-generate</button>
            </div>
            <input
              type="text"
              formControlName="slug"
              class="form-control admin-input font-monospace"
              placeholder="facebook-reels-viral-script"
            />
          </div>

          <!-- Keywords -->
          <div class="col-md-6">
            <label class="form-label text-white small fw-semibold">Keywords / Tags (comma-separated)</label>
            <input
              type="text"
              formControlName="keywords"
              class="form-control admin-input"
              placeholder="reels, viral hook, retention, algorithm"
            />
          </div>

          <!-- Short Description -->
          <div class="col-12">
            <label class="form-label text-white small fw-semibold">Short Description (max 500 characters)</label>
            <textarea
              formControlName="description"
              class="form-control admin-textarea"
              rows="2"
              placeholder="Brief summary of what this prompt achieves..."
            ></textarea>
          </div>

          <!-- Full Prompt Text -->
          <div class="col-12">
            <label class="form-label text-white small fw-semibold">Full AI Prompt Text *</label>
            <textarea
              formControlName="promptText"
              class="form-control admin-textarea font-monospace"
              rows="8"
              placeholder="Act as a Facebook growth consultant... Follow this exact framework..."
            ></textarea>
            @if (form.get('promptText')?.touched && form.get('promptText')?.invalid) {
              <span class="text-danger small">Prompt text cannot be empty.</span>
            }
          </div>

          <!-- Scheduling Section -->
          <div class="col-12">
            <div class="p-3 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25">
              <div class="d-flex align-items-center gap-2 mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-info">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <h3 class="fs-6 fw-bold text-white mb-0">Publishing & Scheduling (India Standard Time - IST)</h3>
              </div>
              <p class="text-secondary small mb-3">
                Dates are stored in UTC. Leave start/end empty for immediate, permanent visibility.
              </p>

              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label text-white small fw-semibold">Start Time (IST)</label>
                  <input type="datetime-local" formControlName="startsAt" class="form-control admin-input" />
                </div>

                <div class="col-md-6">
                  <label class="form-label text-white small fw-semibold">End Time (IST)</label>
                  <input type="datetime-local" formControlName="endsAt" class="form-control admin-input" />
                </div>
              </div>
            </div>
          </div>

          <!-- Status Toggles -->
          <div class="col-md-6">
            <div class="form-check form-switch p-3 rounded-3 bg-dark bg-opacity-40 border border-secondary border-opacity-25">
              <input formControlName="isPublished" class="form-check-input ms-0 me-3" type="checkbox" id="publishedSwitch" />
              <label class="form-check-label text-white fw-semibold" for="publishedSwitch">
                Published
                <span class="d-block text-secondary small fw-normal">When checked and within scheduling window, prompt is publicly visible.</span>
              </label>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-check form-switch p-3 rounded-3 bg-dark bg-opacity-40 border border-secondary border-opacity-25">
              <input formControlName="isFeatured" class="form-check-input ms-0 me-3" type="checkbox" id="featuredSwitch" />
              <label class="form-check-label text-white fw-semibold" for="featuredSwitch">
                Featured Prompt
                <span class="d-block text-secondary small fw-normal">Showcases this prompt in the homepage featured reel.</span>
              </label>
            </div>
          </div>

          <!-- Step-by-Step Instructions Reordering Section -->
          <div class="col-12">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <div>
                <label class="form-label text-white small fw-semibold mb-0">Step-by-Step Usage Instructions</label>
                <span class="text-secondary small d-block">Add ordered steps to help creators run this prompt effectively.</span>
              </div>
              <button type="button" class="btn btn-glass btn-sm" (click)="addInstructionStep()">
                + Add Step
              </button>
            </div>

            <div class="d-flex flex-column gap-2" formArrayName="instructions">
              @for (step of instructionsArray.controls; track $index) {
                <div class="instruction-step-item d-flex align-items-center gap-2 p-2 rounded-2 bg-dark bg-opacity-50 border border-secondary border-opacity-25">
                  <span class="step-badge badge bg-secondary px-2 py-1">{{ $index + 1 }}</span>
                  <input
                    type="text"
                    [formControlName]="$index"
                    class="form-control admin-input flex-grow-1"
                    placeholder="e.g. Paste prompt into ChatGPT and replace [TOPIC]..."
                  />
                  <div class="d-flex gap-1">
                    <button
                      type="button"
                      class="btn btn-sm btn-glass p-1 px-2"
                      (click)="moveStepUp($index)"
                      [disabled]="$index === 0"
                      title="Move Up"
                    >▲</button>
                    <button
                      type="button"
                      class="btn btn-sm btn-glass p-1 px-2"
                      (click)="moveStepDown($index)"
                      [disabled]="$index === instructionsArray.length - 1"
                      title="Move Down"
                    >▼</button>
                    <button
                      type="button"
                      class="btn btn-sm btn-glass p-1 px-2 text-danger"
                      (click)="removeStep($index)"
                      title="Remove"
                    >✕</button>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="col-12 pt-3 border-top border-secondary border-opacity-25 d-flex gap-3">
            <button type="submit" [disabled]="form.invalid || isSubmitting" class="btn btn-primary-gradient px-4 py-2">
              <span>{{ isSubmitting ? 'Saving...' : 'Save Prompt' }}</span>
            </button>
            <a routerLink="/admin/prompts" class="btn btn-glass px-4 py-2">Cancel</a>
          </div>
        </div>
      </form>
    </div>
  `
})
export class AdminPromptFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  promptId?: number;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private promptService: PromptService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.promptId = Number(idParam);
      this.isEditMode = true;
      this.loadPrompt(this.promptId);
    }
  }

  get instructionsArray(): FormArray {
    return this.form.get('instructions') as FormArray;
  }

  initForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      category: ['Facebook Reels', Validators.required],
      slug: [''],
      keywords: [''],
      description: ['', Validators.maxLength(500)],
      promptText: ['', Validators.required],
      startsAt: [''],
      endsAt: [''],
      isPublished: [true],
      isFeatured: [false],
      instructions: this.fb.array([])
    });
  }

  loadPrompt(id: number): void {
    this.promptService.getPromptWithInstructionsById(id).subscribe(p => {
      if (!p) {
        this.toastService.show('Prompt not found', 'error');
        this.router.navigate(['/admin/prompts']);
        return;
      }

      this.form.patchValue({
        title: p.title,
        category: p.category,
        slug: p.slug,
        keywords: p.keywords || '',
        description: p.description || '',
        promptText: p.promptText,
        startsAt: p.startsAtUtc ? this.formatDateTimeLocal(p.startsAtUtc) : '',
        endsAt: p.endsAtUtc ? this.formatDateTimeLocal(p.endsAtUtc) : '',
        isPublished: p.isPublished,
        isFeatured: p.isFeatured
      });

      this.instructionsArray.clear();
      if (p.instructions && p.instructions.length > 0) {
        const sorted = [...p.instructions].sort((a, b) => a.sortOrder - b.sortOrder);
        sorted.forEach(ins => {
          this.instructionsArray.push(this.fb.control(ins.instructionText));
        });
      }
    });
  }

  formatDateTimeLocal(isoString: string): string {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  onTitleBlur(): void {
    if (!this.form.get('slug')?.value) {
      this.autoGenerateSlug();
    }
  }

  autoGenerateSlug(): void {
    const title = this.form.get('title')?.value;
    if (title) {
      this.form.patchValue({ slug: this.promptService.generateSlug(title) });
    }
  }

  addInstructionStep(initialText = ''): void {
    this.instructionsArray.push(this.fb.control(initialText));
  }

  removeStep(index: number): void {
    this.instructionsArray.removeAt(index);
  }

  moveStepUp(index: number): void {
    if (index > 0) {
      const current = this.instructionsArray.at(index);
      this.instructionsArray.removeAt(index);
      this.instructionsArray.insert(index - 1, current);
    }
  }

  moveStepDown(index: number): void {
    if (index < this.instructionsArray.length - 1) {
      const current = this.instructionsArray.at(index);
      this.instructionsArray.removeAt(index);
      this.instructionsArray.insert(index + 1, current);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const val = this.form.value;

    const instructions = (val.instructions || []).map((text: string, idx: number) => ({
      id: idx + 1,
      sortOrder: idx + 1,
      instructionText: text
    }));

    const promptPayload: Partial<Prompt> = {
      title: val.title,
      category: val.category,
      slug: val.slug?.trim() || this.promptService.generateSlug(val.title),
      keywords: val.keywords || '',
      description: val.description || '',
      promptText: val.promptText,
      isPublished: val.isPublished,
      isFeatured: val.isFeatured,
      startsAtUtc: val.startsAt ? new Date(val.startsAt).toISOString() : null,
      endsAtUtc: val.endsAt ? new Date(val.endsAt).toISOString() : null,
      instructions
    };

    if (this.isEditMode && this.promptId) {
      promptPayload.id = this.promptId;
      this.promptService.updatePrompt(promptPayload).subscribe({
        next: () => {
          this.toastService.show(`Prompt "${val.title}" updated successfully!`, 'success');
          this.router.navigate(['/admin/prompts']);
        },
        error: () => {
          this.isSubmitting = false;
          this.toastService.show('Failed to update prompt. Please try again.', 'error');
        }
      });
    } else {
      this.promptService.createPrompt(promptPayload).subscribe({
        next: () => {
          this.toastService.show(`Prompt "${val.title}" created successfully!`, 'success');
          this.router.navigate(['/admin/prompts']);
        },
        error: () => {
          this.isSubmitting = false;
          this.toastService.show('Failed to create prompt. Please try again.', 'error');
        }
      });
    }
  }
}
