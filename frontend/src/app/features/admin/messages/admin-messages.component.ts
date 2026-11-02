import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../../core/services/contact.service';
import { ToastService } from '../../../core/services/toast.service';
import { ContactMessage } from '../../../core/models/contact-message.model';
import { IstDatePipe } from '../../../core/pipes/ist-date.pipe';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule, RouterLink, IstDatePipe],
  template: `
    <div class="glass-card p-4 p-md-5 mb-5" style="max-width: 960px;">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 class="fs-4 fw-bold text-white mb-1">Contact Messages & Collab Inquiries</h2>
          <p class="text-secondary small mb-0">Review inquiries submitted through the public website contact form.</p>
        </div>
        <span class="badge-pill">Total: {{ messages.length }} messages</span>
      </div>

      @if (messages.length > 0) {
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Sender Name</th>
                <th>Email</th>
                <th>Subject / Preview</th>
                <th>Received (IST)</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (msg of messages; track msg.id) {
                <tr [class.fw-bold]="!msg.isRead">
                  <td>
                    @if (!msg.isRead) {
                      <span class="badge bg-danger">New</span>
                    } @else {
                      <span class="badge bg-secondary">Read</span>
                    }
                  </td>
                  <td class="text-white">{{ msg.name }}</td>
                  <td>
                    <a [href]="'mailto:' + msg.email" class="text-info text-decoration-none">{{ msg.email }}</a>
                  </td>
                  <td>
                    <div class="text-white text-truncate" style="max-width: 250px;">
                      {{ msg.subject || 'No Subject' }}
                    </div>
                    <div class="text-secondary small text-truncate" style="max-width: 250px;">
                      {{ msg.message }}
                    </div>
                  </td>
                  <td class="text-secondary small">
                    {{ msg.createdAtUtc | istDate:'short' }}
                  </td>
                  <td class="text-end">
                    <div class="d-flex justify-content-end gap-1">
                      <a [routerLink]="['/admin/messages', msg.id]" class="btn btn-glass btn-sm p-1 px-2">View</a>
                      <button
                        type="button"
                        (click)="deleteMessage(msg)"
                        class="btn btn-glass btn-sm text-danger border-danger border-opacity-25 p-1 px-2"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="p-5 text-center text-secondary">
          No contact messages received yet.
        </div>
      }
    </div>
  `
})
export class AdminMessagesComponent implements OnInit {
  messages: ContactMessage[] = [];

  constructor(
    private contactService: ContactService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.contactService.getMessages().subscribe(m => this.messages = m);
  }

  deleteMessage(msg: ContactMessage): void {
    if (confirm(`Delete message from "${msg.name}"?`)) {
      this.contactService.deleteMessage(msg.id).subscribe({
        next: () => {
          this.toastService.show(`Message from "${msg.name}" deleted.`, 'info');
          this.loadMessages();
        },
        error: () => {
          this.toastService.show('Failed to delete message.', 'error');
        }
      });
    }
  }
}
