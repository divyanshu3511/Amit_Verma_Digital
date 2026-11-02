import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PromptService } from '../../../core/services/prompt.service';
import { ToastService } from '../../../core/services/toast.service';
import { Prompt, PromptStatus, getPromptStatus } from '../../../core/models/prompt.model';
import { IstDatePipe } from '../../../core/pipes/ist-date.pipe';

@Component({
  selector: 'app-admin-prompts',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, IstDatePipe],
  template: `
    <div class="glass-card p-4 mb-4">
      <!-- Top Action Bar -->
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 class="fs-5 fw-bold text-white mb-1">Prompt Inventory</h2>
          <div class="text-secondary small">
            Total: {{ counts.total }} | Live: <span class="text-success">{{ counts.live }}</span> | Scheduled: <span class="text-info">{{ counts.scheduled }}</span> | Draft: <span class="text-warning">{{ counts.draft }}</span> | Expired: <span class="text-muted">{{ counts.expired }}</span>
          </div>
        </div>

        <a routerLink="/admin/prompts/create" class="btn btn-primary-gradient btn-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Create New Prompt</span>
        </a>
      </div>

      <!-- Filters Form -->
      <div class="row g-2 align-items-center mb-4">
        <div class="col-md-4">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keyup.enter)="applyFilters()"
            class="form-control admin-input py-2"
            placeholder="Search by title, keyword, text..."
          />
        </div>

        <div class="col-md-3">
          <select [(ngModel)]="selectedCategory" (change)="applyFilters()" class="form-select admin-select py-2">
            <option value="All">All Categories</option>
            @for (cat of categories; track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
        </div>

        <div class="col-md-3">
          <select [(ngModel)]="selectedStatus" (change)="applyFilters()" class="form-select admin-select py-2">
            <option value="All">All Statuses</option>
            <option value="Live">Live (Active Now)</option>
            <option value="Scheduled">Scheduled (Future)</option>
            <option value="Draft">Draft (Unpublished)</option>
            <option value="Expired">Expired (Past End)</option>
          </select>
        </div>

        <div class="col-md-2 d-flex gap-2">
          <button (click)="applyFilters()" class="btn btn-primary-gradient w-100 justify-content-center py-2">
            Filter
          </button>
          <button (click)="resetFilters()" class="btn btn-glass py-2" title="Reset">✕</button>
        </div>
      </div>

      <!-- Prompts Table -->
      @if (prompts.length > 0) {
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th style="min-width: 240px;">Title & Slug</th>
                <th>Category</th>
                <th>Status</th>
                <th>Featured</th>
                <th style="min-width: 170px;">Scheduling Window (IST)</th>
                <th style="min-width: 120px;" class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (p of prompts; track p.id) {
                <tr>
                  <td>
                    <div class="fw-bold text-white">{{ p.title }}</div>
                    <div class="text-secondary small font-monospace">/{{ p.slug }}</div>
                    @if (p.instructions && p.instructions.length > 0) {
                      <div class="text-muted small mt-1">{{ p.instructions.length }} instructions</div>
                    }
                  </td>
                  <td>
                    <span class="badge-pill category">{{ p.category }}</span>
                  </td>
                  <td>
                    @switch (getStatus(p)) {
                      @case (PromptStatus.Live) {
                        <span class="badge bg-success">Live</span>
                      }
                      @case (PromptStatus.Scheduled) {
                        <span class="badge bg-info text-dark">Scheduled</span>
                      }
                      @case (PromptStatus.Draft) {
                        <span class="badge bg-warning text-dark">Draft</span>
                      }
                      @case (PromptStatus.Expired) {
                        <span class="badge bg-secondary">Expired</span>
                      }
                    }
                  </td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-sm py-1 px-2"
                      [class.btn-accent]="p.isFeatured"
                      [class.btn-glass]="!p.isFeatured"
                      (click)="toggleFeature(p)"
                      title="Toggle Featured status"
                    >
                      {{ p.isFeatured ? '★ Featured' : '☆ Standard' }}
                    </button>
                  </td>
                  <td>
                    <div class="small">
                      <div class="text-secondary">
                        Start: <span class="text-white">{{ p.startsAtUtc | istDate:'short' }}</span>
                      </div>
                      <div class="text-secondary">
                        End: <span class="text-white">{{ p.endsAtUtc | istDate:'short' }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="text-end">
                    <div class="d-flex justify-content-end gap-1">
                      <a [routerLink]="['/admin/prompts/edit', p.id]" class="btn btn-glass btn-sm p-1 px-2" title="Edit">
                        Edit
                      </a>
                      <a [routerLink]="['/admin/prompts/delete', p.id]" class="btn btn-glass btn-sm p-1 px-2 text-danger border-danger border-opacity-25" title="Delete">
                        Delete
                      </a>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="p-5 text-center text-secondary">
          No prompts found matching your search and filter criteria.
        </div>
      }
    </div>
  `
})
export class AdminPromptsComponent implements OnInit {
  prompts: Prompt[] = [];
  categories: string[] = [];
  counts = { total: 0, live: 0, scheduled: 0, draft: 0, expired: 0 };

  searchQuery = '';
  selectedCategory = 'All';
  selectedStatus = 'All';

  readonly PromptStatus = PromptStatus;

  constructor(
    private promptService: PromptService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadCounts();
    this.applyFilters();
  }

  loadCategories(): void {
    this.promptService.getCategories().subscribe(c => this.categories = c);
  }

  loadCounts(): void {
    this.promptService.getPromptCounts().subscribe(c => this.counts = c);
  }

  applyFilters(): void {
    this.promptService
      .getAllPromptsForAdmin(this.searchQuery, this.selectedCategory, this.selectedStatus)
      .subscribe(list => {
        this.prompts = list;
      });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'All';
    this.selectedStatus = 'All';
    this.applyFilters();
  }

  getStatus(prompt: Prompt): PromptStatus {
    return getPromptStatus(prompt, new Date());
  }

  toggleFeature(prompt: Prompt): void {
    this.promptService.toggleFeature(prompt.id).subscribe(success => {
      if (success) {
        prompt.isFeatured = !prompt.isFeatured;
        this.toastService.show(
          prompt.isFeatured ? `Promoted "${prompt.title}" to Featured!` : `Removed "${prompt.title}" from Featured.`,
          'info'
        );
      }
    });
  }
}
