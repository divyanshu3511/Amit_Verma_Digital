import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContactService } from '../../../core/services/contact.service';
import { ToastService } from '../../../core/services/toast.service';
import { ContactMessage } from '../../../core/models/contact-message.model';
import { IstDatePipe } from '../../../core/pipes/ist-date.pipe';

@Component({
  selector: 'app-admin-message-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, IstDatePipe],
  template: `
    @if (message) {
      <div class="glass-card p-4 p-md-5 mb-5 mx-auto" style="max-width: 780px;">
        <div class="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 class="fs-4 fw-bold text-white mb-1">Inquiry Details</h2>
            <span class="text-secondary small">Received on {{ message.createdAtUtc | istDate:'full' }}</span>
          </div>
          <a routerLink="/admin/messages" class="btn btn-glass btn-sm">&larr; Back to Inquiries</a>
        </div>

        <div class="p-4 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25 mb-4">
          <div class="row g-3 mb-3">
            <div class="col-sm-6">
              <span class="text-secondary small d-block">Sender Name:</span>
              <span class="text-white fw-bold">{{ message.name }}</span>
            </div>
            <div class="col-sm-6">
              <span class="text-secondary small d-block">Email Address:</span>
              <a [href]="'mailto:' + message.email" class="text-info fw-semibold text-decoration-none">{{ message.email }}</a>
            </div>
            <div class="col-sm-6">
              <span class="text-secondary small d-block">Subject:</span>
              <span class="text-white">{{ message.subject || '(None)' }}</span>
            </div>
            <div class="col-sm-6">
              <span class="text-secondary small d-block">IP Address:</span>
              <span class="text-secondary font-monospace small">{{ message.ipAddress || 'N/A' }}</span>
            </div>
          </div>

          <hr class="border-secondary border-opacity-25 my-3" />

          <div class="mb-2">
            <span class="text-secondary small d-block mb-1">Message Content:</span>
            <div class="p-3 rounded-2 bg-dark text-white border border-secondary border-opacity-25" style="white-space: pre-wrap; line-height: 1.6;">{{ message.message }}</div>
          </div>
        </div>

        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <a [href]="replyMailtoLink" class="btn btn-primary-gradient btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>Reply via Email</span>
          </a>

          <button
            type="button"
            (click)="deleteMessage()"
            class="btn btn-glass btn-sm text-danger border-danger border-opacity-25"
          >
            Delete Message
          </button>
        </div>
      </div>
    } @else {
      <div class="p-5 text-center text-secondary">
        Loading message details...
      </div>
    }
  `
})
export class AdminMessageDetailComponent implements OnInit {
  message?: ContactMessage;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.contactService.getMessageById(id).subscribe(m => {
        if (!m) {
          this.toastService.show('Message not found', 'error');
          this.router.navigate(['/admin/messages']);
          return;
        }
        this.message = m;
      });
    }
  }

  get replyMailtoLink(): string {
    if (!this.message) return '#';
    const subject = encodeURIComponent(`Re: ${this.message.subject || 'Inquiry to Amit Verma'}`);
    return `mailto:${this.message.email}?subject=${subject}`;
  }

  deleteMessage(): void {
    if (!this.message) return;
    if (confirm(`Delete message from "${this.message.name}" permanently?`)) {
      this.contactService.deleteMessage(this.message.id).subscribe({
        next: () => {
          this.toastService.show('Message deleted successfully.', 'info');
          this.router.navigate(['/admin/messages']);
        },
        error: () => {
          this.toastService.show('Failed to delete message.', 'error');
        }
      });
    }
  }
}
