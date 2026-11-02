import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ContactMessage, ContactFormRequest } from '../models/contact-message.model';
import { MOCK_MESSAGES } from '../mock-data/mock-messages';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private messagesSubject = new BehaviorSubject<ContactMessage[]>([...MOCK_MESSAGES]);

  constructor(private http: HttpClient) {}

  submitContactForm(form: ContactFormRequest): Observable<{ success: boolean; message: string; errors?: string[] }> {
    // Honeypot bot trap validation
    if (form.website && form.website.trim() !== '') {
      console.warn('Honeypot triggered: rejecting bot submission silently.');
      return of({
        success: true,
        message: 'Your message has been received! Amit Verma will review your inquiry shortly.'
      });
    }

    if (!form.name || form.name.trim().length < 2) {
      return of({ success: false, message: 'Please enter a valid name (at least 2 characters).' });
    }

    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return of({ success: false, message: 'Please provide a valid email address.' });
    }

    if (!form.message || form.message.trim().length < 5) {
      return of({ success: false, message: 'Please enter a message with at least 5 characters.' });
    }

    if (environment.useMockData) {
      const list = [...this.messagesSubject.value];
      const newMsg: ContactMessage = {
        id: Math.max(...list.map(m => m.id), 0) + 1,
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject?.trim() || 'No Subject',
        message: form.message.trim(),
        ipAddress: '127.0.0.1',
        isRead: false,
        createdAtUtc: new Date().toISOString()
      };
      list.unshift(newMsg);
      this.messagesSubject.next(list);

      return of({
        success: true,
        message: 'Thank you! Your inquiry has been sent successfully. Amit Verma will respond to your email soon.'
      });
    }

    return this.http.post<{ success: boolean; message: string; errors?: string[] }>(
      `${environment.apiUrl}/contact/submit`,
      form
    );
  }

  getMessages(): Observable<ContactMessage[]> {
    if (environment.useMockData) {
      return this.messagesSubject.asObservable();
    }
    return this.http.get<ContactMessage[]>(`${environment.apiUrl}/admin/messages`);
  }

  getMessageById(id: number): Observable<ContactMessage | undefined> {
    if (environment.useMockData) {
      const found = this.messagesSubject.value.find(m => m.id === id);
      if (found && !found.isRead) {
        found.isRead = true;
        this.messagesSubject.next([...this.messagesSubject.value]);
      }
      return of(found ? { ...found } : undefined);
    }
    return this.http.get<ContactMessage>(`${environment.apiUrl}/admin/messages/${id}`);
  }

  markAsRead(id: number): Observable<boolean> {
    if (environment.useMockData) {
      const list = [...this.messagesSubject.value];
      const found = list.find(m => m.id === id);
      if (found) {
        found.isRead = true;
        this.messagesSubject.next(list);
        return of(true);
      }
      return of(false);
    }
    return this.http.post<boolean>(`${environment.apiUrl}/admin/messages/${id}/read`, {});
  }

  deleteMessage(id: number): Observable<boolean> {
    if (environment.useMockData) {
      const current = this.messagesSubject.value.filter(m => m.id !== id);
      this.messagesSubject.next(current);
      return of(true);
    }
    return this.http.delete<boolean>(`${environment.apiUrl}/admin/messages/${id}`);
  }

  getUnreadCount(): Observable<number> {
    if (environment.useMockData) {
      const count = this.messagesSubject.value.filter(m => !m.isRead).length;
      return of(count);
    }
    return this.http.get<number>(`${environment.apiUrl}/admin/messages/unread-count`);
  }
}
