import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SiteSettingService } from '../../../core/services/site-setting.service';
import { ToastService } from '../../../core/services/toast.service';
import { FeaturedVideo, extractYouTubeId } from '../../../core/models/featured-video.model';

@Component({
  selector: 'app-admin-videos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="glass-card p-4 p-md-5 mb-5" style="max-width: 900px;">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 class="fs-4 fw-bold text-white mb-1">Featured YouTube Videos</h2>
          <p class="text-secondary small mb-0">Configure video tutorials displayed on the homepage. Enter YouTube URLs or 11-char video IDs.</p>
        </div>
        <button type="button" class="btn btn-primary-gradient btn-sm" (click)="openAddModal()">
          + Add Video
        </button>
      </div>

      @if (videos.length > 0) {
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Video Title</th>
                <th>YouTube ID</th>
                <th>Status</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (video of videos; track video.id) {
                <tr>
                  <td><span class="badge bg-secondary">{{ video.sortOrder }}</span></td>
                  <td>
                    <div class="fw-bold text-white">{{ video.title }}</div>
                    @if (video.description) {
                      <div class="text-secondary small">{{ video.description }}</div>
                    }
                  </td>
                  <td>
                    @if (getYouTubeId(video.videoUrlOrId)) {
                      <span class="badge bg-danger bg-opacity-75">{{ getYouTubeId(video.videoUrlOrId) }}</span>
                    } @else {
                      <span class="badge bg-warning text-dark">Invalid URL</span>
                    }
                  </td>
                  <td>
                    @if (video.isActive) {
                      <span class="badge bg-success">Active</span>
                    } @else {
                      <span class="badge bg-secondary">Hidden</span>
                    }
                  </td>
                  <td class="text-end">
                    <button
                      type="button"
                      (click)="deleteVideo(video)"
                      class="btn btn-glass btn-sm text-danger border-danger border-opacity-25 py-1 px-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="p-5 text-center text-secondary">
          No videos configured yet. Click "Add Video" to showcase tutorials on the homepage.
        </div>
      }
    </div>

    <!-- Add Video Modal Backdrop & Dialog -->
    @if (showModal) {
      <div class="modal show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.7); z-index: 1050;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content bg-dark text-white border border-secondary">
            <form [formGroup]="videoForm" (ngSubmit)="saveVideo()">
              <div class="modal-header border-secondary">
                <h5 class="modal-title fs-5">Add Featured Video</h5>
                <button type="button" class="btn-close btn-close-white" (click)="closeModal()" aria-label="Close"></button>
              </div>
              <div class="modal-body p-4">
                <div class="mb-3">
                  <label class="form-label text-white small fw-semibold">Video Title *</label>
                  <input
                    type="text"
                    formControlName="title"
                    class="form-control admin-input"
                    placeholder="e.g. Facebook Criteria Unlock Guide"
                  />
                  @if (videoForm.get('title')?.touched && videoForm.get('title')?.invalid) {
                    <span class="text-danger small">Title is required.</span>
                  }
                </div>

                <div class="mb-3">
                  <label class="form-label text-white small fw-semibold">YouTube URL or Video ID *</label>
                  <input
                    type="text"
                    formControlName="videoUrlOrId"
                    class="form-control admin-input"
                    placeholder="https://youtu.be/... or dQw4w9WgXcQ"
                  />
                  @if (videoForm.get('videoUrlOrId')?.touched && videoForm.get('videoUrlOrId')?.invalid) {
                    <span class="text-danger small">Valid YouTube link or 11-char ID required.</span>
                  }
                </div>

                <div class="mb-3">
                  <label class="form-label text-white small fw-semibold">Description</label>
                  <textarea
                    formControlName="description"
                    rows="2"
                    class="form-control admin-textarea"
                    placeholder="Brief lesson overview..."
                  ></textarea>
                </div>

                <div class="row g-3">
                  <div class="col-6">
                    <label class="form-label text-white small fw-semibold">Display Order</label>
                    <input type="number" formControlName="sortOrder" class="form-control admin-input" />
                  </div>
                  <div class="col-6 d-flex align-items-end">
                    <div class="form-check form-switch mb-2">
                      <input class="form-check-input" type="checkbox" formControlName="isActive" id="isActiveSwitch" />
                      <label class="form-check-label text-white small fw-semibold" for="isActiveSwitch">Active</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer border-secondary">
                <button type="button" class="btn btn-glass btn-sm" (click)="closeModal()">Cancel</button>
                <button type="submit" [disabled]="videoForm.invalid" class="btn btn-primary-gradient btn-sm">Save Video</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminVideosComponent implements OnInit {
  videos: FeaturedVideo[] = [];
  showModal = false;
  videoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private settingService: SiteSettingService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadVideos();
  }

  initForm(): void {
    this.videoForm = this.fb.group({
      title: ['', Validators.required],
      videoUrlOrId: ['', Validators.required],
      description: [''],
      sortOrder: [1, [Validators.required, Validators.min(1)]],
      isActive: [true]
    });
  }

  loadVideos(): void {
    this.settingService.getAllVideos().subscribe(v => this.videos = v);
  }

  getYouTubeId(urlOrId: string): string | null {
    return extractYouTubeId(urlOrId);
  }

  openAddModal(): void {
    this.videoForm.reset({
      title: '',
      videoUrlOrId: '',
      description: '',
      sortOrder: this.videos.length + 1,
      isActive: true
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveVideo(): void {
    if (this.videoForm.invalid) {
      this.videoForm.markAllAsTouched();
      return;
    }

    const payload = this.videoForm.value;
    this.settingService.saveVideo(payload).subscribe({
      next: (saved) => {
        this.toastService.show(`Video "${saved.title}" saved successfully!`, 'success');
        this.closeModal();
        this.loadVideos();
      },
      error: () => {
        this.toastService.show('Failed to save video.', 'error');
      }
    });
  }

  deleteVideo(video: FeaturedVideo): void {
    if (confirm(`Delete video "${video.title}"?`)) {
      this.settingService.deleteVideo(video.id).subscribe({
        next: () => {
          this.toastService.show(`Video "${video.title}" deleted.`, 'info');
          this.loadVideos();
        },
        error: () => {
          this.toastService.show('Failed to delete video.', 'error');
        }
      });
    }
  }
}
