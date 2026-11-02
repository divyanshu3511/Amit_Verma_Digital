import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Prompt } from '../../../core/models/prompt.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-prompt-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="glass-card p-4 d-flex flex-column h-100 position-relative">
      <!-- Header Badges -->
      <div class="d-flex align-items-center justify-content-between gap-2 mb-3">
        <span class="badge-pill category">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          {{ prompt.category }}
        </span>

        @if (prompt.isFeatured) {
          <span class="badge-pill featured">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            Featured
          </span>
        }
      </div>

      <!-- Title & Description -->
      <h3 class="fs-5 fw-bold text-white mb-2">
        <a [routerLink]="['/prompts', prompt.slug]" class="text-white text-decoration-none hover-primary">{{ prompt.title }}</a>
      </h3>

      <p class="text-secondary small flex-grow-1 mb-3 line-clamp-2">
        {{ prompt.description }}
      </p>

      <!-- Instructions Count indicator -->
      @if (prompt.instructions && prompt.instructions.length > 0) {
        <div class="d-flex align-items-center gap-1 text-muted small mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          <span>{{ prompt.instructions.length }} Step-by-Step Instructions</span>
        </div>
      }

      <!-- Card Action Buttons -->
      <div class="d-flex flex-wrap align-items-center gap-2 pt-2 border-top border-secondary border-opacity-25 mt-auto">
        <button type="button" class="btn btn-primary-gradient btn-sm flex-fill" (click)="copyPrompt()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <span>Copy Prompt</span>
        </button>

        <button type="button" class="btn btn-glass btn-sm" (click)="openModal()" title="View details and instructions">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <span>View</span>
        </button>
      </div>
    </div>

    <!-- Modal for full prompt & instructions -->
    @if (isModalOpen) {
      <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.75); z-index: 1055;">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content bg-dark text-white border border-secondary shadow-lg">
            <div class="modal-header border-secondary">
              <div>
                <span class="badge-pill category mb-1">{{ prompt.category }}</span>
                <h4 class="modal-title fs-5 fw-bold">{{ prompt.title }}</h4>
              </div>
              <button type="button" class="btn-close btn-close-white" (click)="closeModal()" aria-label="Close"></button>
            </div>
            <div class="modal-body p-4">
              <p class="text-secondary small mb-3">{{ prompt.description }}</p>

              <!-- Prompt Text Block -->
              <div class="mb-4">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="fw-semibold fs-6 text-info">Full AI Prompt:</span>
                  <button type="button" class="btn btn-sm btn-glass py-1 px-2" (click)="copyPrompt()">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    Copy Prompt
                  </button>
                </div>
                <pre class="prompt-box">{{ prompt.promptText }}</pre>
              </div>

              <!-- Instructions Block -->
              @if (prompt.instructions && prompt.instructions.length > 0) {
                <div class="mb-4">
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="fw-semibold fs-6 text-warning">Step-by-Step Instructions:</span>
                    <button type="button" class="btn btn-sm btn-glass py-1 px-2" (click)="copyInstructions()">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                      Copy Instructions
                    </button>
                  </div>
                  <ol class="list-group list-group-numbered bg-transparent border-0">
                    @for (step of prompt.instructions; track step.sortOrder) {
                      <li class="list-group-item bg-transparent text-secondary border-secondary border-opacity-25 py-2">
                        <span class="text-white">{{ step.instructionText }}</span>
                      </li>
                    }
                  </ol>
                </div>
              }
            </div>
            <div class="modal-footer border-secondary d-flex justify-content-between">
              <a [routerLink]="['/prompts', prompt.slug]" (click)="closeModal()" class="btn btn-glass btn-sm">Full Page View</a>
              <div class="d-flex gap-2">
                @if (prompt.instructions && prompt.instructions.length > 0) {
                  <button type="button" class="btn btn-accent btn-sm" (click)="copyBoth()">
                    Copy Both (Prompt + Steps)
                  </button>
                }
                <button type="button" class="btn btn-primary-gradient btn-sm" (click)="copyPrompt()">
                  Copy Prompt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .hover-primary:hover {
      color: #38BDF8 !important;
    }
  `]
})
export class PromptCardComponent {
  @Input({ required: true }) prompt!: Prompt;
  private toastService = inject(ToastService);

  isModalOpen = false;

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  copyPrompt(): void {
    this.toastService.copyText(this.prompt.promptText, 'Prompt copied to clipboard!');
  }

  copyInstructions(): void {
    if (!this.prompt.instructions || this.prompt.instructions.length === 0) return;
    const text = this.prompt.instructions
      .map(i => `${i.sortOrder}. ${i.instructionText}`)
      .join('\n');
    this.toastService.copyText(text, 'Instructions copied to clipboard!');
  }

  copyBoth(): void {
    let combined = `=== PROMPT ===\n${this.prompt.promptText.trim()}\n\n`;
    if (this.prompt.instructions && this.prompt.instructions.length > 0) {
      combined += `=== INSTRUCTIONS ===\n` + this.prompt.instructions
        .map(i => `${i.sortOrder}. ${i.instructionText}`)
        .join('\n');
    }
    this.toastService.copyText(combined, 'Prompt & Instructions copied!');
  }
}
