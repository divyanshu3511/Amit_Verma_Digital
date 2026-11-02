import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PromptService } from '../../../core/services/prompt.service';
import { ToastService } from '../../../core/services/toast.service';
import { Prompt } from '../../../core/models/prompt.model';
import { IstDatePipe } from '../../../core/pipes/ist-date.pipe';

@Component({
  selector: 'app-admin-prompt-delete',
  standalone: true,
  imports: [CommonModule, RouterLink, IstDatePipe],
  template: `
    <div class="glass-card p-4 p-md-5 mx-auto" style="max-width: 650px;">
      <div class="icon-box pink mx-auto mb-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </div>

      <h2 class="fs-4 fw-bold text-white text-center mb-2">Delete Confirmation</h2>
      <p class="text-secondary small text-center mb-4">
        Are you sure you want to delete this prompt? This action will permanently remove the prompt and all its associated instruction steps.
      </p>

      @if (prompt) {
        <div class="p-4 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25 mb-4">
          <div class="mb-2">
            <span class="badge-pill category">{{ prompt.category }}</span>
            <h3 class="fs-5 fw-bold text-white mt-2 mb-1">{{ prompt.title }}</h3>
            <span class="text-secondary small font-monospace">/{{ prompt.slug }}</span>
          </div>
          <p class="text-secondary small mb-3">{{ prompt.description }}</p>
          <div class="d-flex justify-content-between text-secondary small border-top border-secondary border-opacity-25 pt-2">
            <span>Instructions: <strong class="text-white">{{ prompt.instructions.length }} steps</strong></span>
            <span>Created: <strong class="text-white">{{ prompt.createdAtUtc | istDate:'short' }}</strong></span>
          </div>
        </div>

        <div class="d-flex justify-content-center gap-3">
          <button
            type="button"
            (click)="onConfirmDelete()"
            [disabled]="isDeleting"
            class="btn btn-sm py-2 px-4 text-white"
            style="background: #EF4444; border-radius: 9999px; font-weight: 600;"
          >
            {{ isDeleting ? 'Deleting...' : 'Yes, Delete Permanently' }}
          </button>
          <a routerLink="/admin/prompts" class="btn btn-glass btn-sm py-2 px-4">Cancel</a>
        </div>
      } @else {
        <div class="p-4 text-center text-secondary">
          Loading prompt details...
        </div>
      }
    </div>
  `
})
export class AdminPromptDeleteComponent implements OnInit {
  prompt?: Prompt;
  isDeleting = false;

  constructor(
    private promptService: PromptService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.promptService.getPromptWithInstructionsById(id).subscribe(p => {
        if (!p) {
          this.toastService.show('Prompt not found', 'error');
          this.router.navigate(['/admin/prompts']);
          return;
        }
        this.prompt = p;
      });
    }
  }

  onConfirmDelete(): void {
    if (!this.prompt) return;

    this.isDeleting = true;
    this.promptService.deletePrompt(this.prompt.id).subscribe({
      next: () => {
        this.toastService.show(`Prompt "${this.prompt?.title}" deleted successfully.`, 'info');
        this.router.navigate(['/admin/prompts']);
      },
      error: () => {
        this.isDeleting = false;
        this.toastService.show('Failed to delete prompt.', 'error');
      }
    });
  }
}
