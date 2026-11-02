import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (toastService.toast$ | async; as toast) {
      <div id="copy-toast" class="copy-toast" [class.show]="toast.visible" [class.error]="toast.type === 'error'">
        @if (toast.type === 'error') {
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        } @else {
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        }
        <span>{{ toast.message }}</span>
      </div>
    }
  `,
  styles: [`
    .copy-toast.error {
      background: #EF4444;
      box-shadow: 0 10px 25px rgba(239, 68, 68, 0.4);
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
