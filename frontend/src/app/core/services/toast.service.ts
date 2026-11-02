import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastData {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastData>({
    message: '',
    type: 'success',
    visible: false
  });

  toast$ = this.toastSubject.asObservable();
  private hideTimeout: any;

  show(message: string, type: 'success' | 'error' | 'info' = 'success', duration = 2800): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    this.toastSubject.next({
      message,
      type,
      visible: true
    });

    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, duration);
  }

  hide(): void {
    const current = this.toastSubject.value;
    this.toastSubject.next({
      ...current,
      visible: false
    });
  }

  async copyText(text: string, successMessage = 'Copied to clipboard!'): Promise<boolean> {
    if (!text || text.trim() === '') {
      this.show('Nothing to copy!', 'error');
      return false;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        this.show(successMessage, 'success');
        return true;
      }
    } catch (err) {
      console.warn('Navigator clipboard failed, falling back to textarea', err);
    }

    // Fallback using textarea
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        this.show(successMessage, 'success');
        return true;
      } else {
        this.show('Failed to copy. Please copy manually.', 'error');
        return false;
      }
    } catch (err) {
      console.error('Fallback copy failed', err);
      this.show('Clipboard access denied. Please copy manually.', 'error');
      return false;
    }
  }
}
