import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PromptService } from '../../../core/services/prompt.service';
import { ContactService } from '../../../core/services/contact.service';
import { Prompt, PromptStatus, getPromptStatus } from '../../../core/models/prompt.model';
import { ContactMessage } from '../../../core/models/contact-message.model';
import { IstDatePipe } from '../../../core/pipes/ist-date.pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, IstDatePipe],
  template: `
    <!-- KPI Metric Cards Grid -->
    <div class="row g-3 mb-4">
      <!-- Total Prompts -->
      <div class="col-sm-6 col-xl-2">
        <div class="stat-card">
          <div>
            <div class="stat-label">Total Prompts</div>
            <div class="stat-number">{{ counts.total }}</div>
          </div>
          <div class="icon-box blue mb-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Live Prompts -->
      <div class="col-sm-6 col-xl-2">
        <div class="stat-card">
          <div>
            <div class="stat-label">Live / Active</div>
            <div class="stat-number text-success">{{ counts.live }}</div>
          </div>
          <div class="icon-box yellow mb-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <!-- Scheduled Prompts -->
      <div class="col-sm-6 col-xl-2">
        <div class="stat-card">
          <div>
            <div class="stat-label">Scheduled</div>
            <div class="stat-number text-info">{{ counts.scheduled }}</div>
          </div>
          <div class="icon-box blue mb-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <!-- Draft Prompts -->
      <div class="col-sm-6 col-xl-2">
        <div class="stat-card">
          <div>
            <div class="stat-label">Drafts</div>
            <div class="stat-number text-warning">{{ counts.draft }}</div>
          </div>
          <div class="icon-box yellow mb-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="2" x2="22" y2="6"></line>
              <path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Expired Prompts -->
      <div class="col-sm-6 col-xl-2">
        <div class="stat-card">
          <div>
            <div class="stat-label">Expired</div>
            <div class="stat-number text-secondary">{{ counts.expired }}</div>
          </div>
          <div class="icon-box pink mb-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
        </div>
      </div>

      <!-- Unread Messages -->
      <div class="col-sm-6 col-xl-2">
        <div class="stat-card">
          <div>
            <div class="stat-label">New Inquiries</div>
            <div class="stat-number" [class.text-danger]="unreadMessages > 0" [class.text-white]="unreadMessages === 0">
              {{ unreadMessages }}
            </div>
          </div>
          <div class="icon-box pink mb-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Action Shortcuts -->
    <div class="glass-card p-3 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
      <div class="d-flex flex-wrap align-items-center gap-2">
        <a routerLink="/admin/prompts/create" class="btn btn-primary-gradient btn-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Create New Prompt</span>
        </a>
        <a routerLink="/admin/prompts" class="btn btn-glass btn-sm">
          <span>Manage All Prompts</span>
        </a>
        <a routerLink="/admin/settings" class="btn btn-glass btn-sm">
          <span>Update Site Settings</span>
        </a>
        <a routerLink="/admin/videos" class="btn btn-glass btn-sm">
          <span>Manage Videos</span>
        </a>
        <a routerLink="/admin/messages" class="btn btn-glass btn-sm">
          <span>View Inquiries ({{ unreadMessages }})</span>
        </a>
      </div>

      <div class="text-secondary small">
        All scheduling calculated in <strong>IST (UTC+5:30)</strong>
      </div>
    </div>

    <div class="row g-4">
      <!-- Recent Prompts Table -->
      <div class="col-lg-7">
        <div class="glass-card p-4 h-100">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h2 class="fs-5 fw-bold text-white mb-0">Recent Prompts</h2>
            <a routerLink="/admin/prompts" class="text-info small text-decoration-none">View All &rarr;</a>
          </div>

          @if (recentPrompts.length > 0) {
            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (prompt of recentPrompts; track prompt.id) {
                    <tr>
                      <td>
                        <div class="fw-semibold text-white">{{ prompt.title }}</div>
                        <div class="text-muted small">Updated: {{ prompt.updatedAtUtc | istDate:'short' }}</div>
                      </td>
                      <td>
                        <span class="badge-pill category">{{ prompt.category }}</span>
                      </td>
                      <td>
                        @switch (getStatus(prompt)) {
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
                        <a [routerLink]="['/admin/prompts/edit', prompt.id]" class="btn btn-glass btn-sm p-1 px-2" title="Edit">
                          Edit
                        </a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <p class="text-secondary small mb-0">No prompts created yet.</p>
          }
        </div>
      </div>

      <!-- Recent Messages Column -->
      <div class="col-lg-5">
        <div class="glass-card p-4 h-100">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h2 class="fs-5 fw-bold text-white mb-0">Recent Inquiries</h2>
            <a routerLink="/admin/messages" class="text-info small text-decoration-none">View All &rarr;</a>
          </div>

          @if (recentMessages.length > 0) {
            <div class="d-flex flex-column gap-3">
              @for (msg of recentMessages; track msg.id) {
                <div class="p-3 rounded-3 bg-dark bg-opacity-50 border" [class.border-primary]="!msg.isRead" [class.border-secondary]="msg.isRead" [class.border-opacity-25]="msg.isRead">
                  <div class="d-flex align-items-center justify-content-between mb-1">
                    <span class="fw-bold text-white small">{{ msg.name }}</span>
                    <span class="text-secondary" style="font-size: 0.75rem;">{{ msg.createdAtUtc | istDate:'short' }}</span>
                  </div>
                  <div class="text-info small mb-1">{{ msg.email }}</div>
                  <p class="text-secondary small mb-2 text-truncate">{{ msg.message }}</p>
                  <a [routerLink]="['/admin/messages', msg.id]" class="text-decoration-none small text-warning">Read Full Inquiry &rarr;</a>
                </div>
              }
            </div>
          } @else {
            <p class="text-secondary small mb-0">No messages received yet.</p>
          }
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  counts = { total: 0, live: 0, scheduled: 0, draft: 0, expired: 0 };
  unreadMessages = 0;
  recentPrompts: Prompt[] = [];
  recentMessages: ContactMessage[] = [];
  readonly PromptStatus = PromptStatus;

  constructor(
    private promptService: PromptService,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.promptService.getPromptCounts().subscribe(c => this.counts = c);
    this.contactService.getUnreadCount().subscribe(u => this.unreadMessages = u);

    this.promptService.getAllPromptsForAdmin().subscribe(prompts => {
      this.recentPrompts = prompts.slice(0, 5);
    });

    this.contactService.getMessages().subscribe(messages => {
      this.recentMessages = messages.slice(0, 4);
    });
  }

  getStatus(prompt: Prompt): PromptStatus {
    return getPromptStatus(prompt, new Date());
  }
}
