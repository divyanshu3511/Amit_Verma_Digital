import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ad-slot',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (enabled && imageUrl) {
      <div class="container my-4">
        <div class="glass-card p-2 text-center overflow-hidden position-relative border-secondary border-opacity-25">
          <span class="position-absolute top-0 end-0 badge bg-dark text-muted m-2 font-monospace" style="font-size: 0.65rem;">SPONSORED</span>
          <a [href]="targetUrl || '#'" target="_blank" rel="noopener noreferrer sponsored">
            <img [src]="imageUrl" [alt]="altText || 'Featured Sponsor'" class="img-fluid rounded-3 w-100 object-fit-cover" style="max-height: 120px;" />
          </a>
        </div>
      </div>
    }
  `
})
export class AdSlotComponent {
  @Input() enabled = false;
  @Input() imageUrl?: string;
  @Input() targetUrl?: string;
  @Input() altText = 'Featured Partner';
}
