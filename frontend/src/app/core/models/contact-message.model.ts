export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  ipAddress?: string;
  isRead: boolean;
  createdAtUtc: string;
}

export interface ContactFormRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
  website?: string; // Honeypot field
}
