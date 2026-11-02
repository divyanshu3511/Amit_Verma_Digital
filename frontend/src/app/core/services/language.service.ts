import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SupportedLanguage = 'en' | 'hi';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLangSubject = new BehaviorSubject<SupportedLanguage>('en');
  currentLang$ = this.currentLangSubject.asObservable();

  constructor() {
    this.initLanguage();
  }

  get currentLang(): SupportedLanguage {
    return this.currentLangSubject.value;
  }

  get isHindi(): boolean {
    return this.currentLang === 'hi';
  }

  private initLanguage(): void {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang === 'hi' || urlLang === 'en') {
        this.setLanguage(urlLang, false);
        return;
      }

      const saved = localStorage.getItem('Preferred_Lang');
      if (saved === 'hi' || saved === 'en') {
        this.currentLangSubject.next(saved);
      }
    }
  }

  setLanguage(lang: SupportedLanguage, updateUrl = true): void {
    this.currentLangSubject.next(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('Preferred_Lang', lang);
      document.cookie = `Preferred_Lang=${lang};path=/;max-age=${60 * 60 * 24 * 365}`;

      if (updateUrl) {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url.toString());
      }
    }
  }

  toggleLanguage(): void {
    const nextLang = this.currentLang === 'en' ? 'hi' : 'en';
    this.setLanguage(nextLang, true);
  }
}
