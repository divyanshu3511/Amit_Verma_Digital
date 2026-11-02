import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Prompt, PromptStatus, getPromptStatus, isPromptLive } from '../models/prompt.model';
import { MOCK_PROMPTS } from '../mock-data/mock-prompts';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private promptsSubject = new BehaviorSubject<Prompt[]>([...MOCK_PROMPTS]);

  constructor(private http: HttpClient) {}

  generateSlug(title: string): string {
    if (!title) return '';
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  // --- Public Discovery ---

  getLivePrompts(search?: string | null, category?: string | null, sort?: string | null): Observable<Prompt[]> {
    if (environment.useMockData) {
      const now = new Date();
      let list = this.promptsSubject.value.filter(p => isPromptLive(p, now));

      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        list = list.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.keywords && p.keywords.toLowerCase().includes(q))
        );
      }

      if (category && category !== 'All') {
        list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }

      switch (sort) {
        case 'featured':
          list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
        case 'oldest':
          list.sort((a, b) => new Date(a.createdAtUtc).getTime() - new Date(b.createdAtUtc).getTime());
          break;
        case 'newest':
        default:
          list.sort((a, b) => {
            if (a.isFeatured !== b.isFeatured) {
              return b.isFeatured ? 1 : -1;
            }
            return new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime();
          });
          break;
      }

      return of(list);
    }

    return this.http.get<Prompt[]>(`${environment.apiUrl}/prompts`, {
      params: { search: search || '', category: category || '', sort: sort || '' }
    });
  }

  getFeaturedLivePrompts(take = 3): Observable<Prompt[]> {
    if (environment.useMockData) {
      const now = new Date();
      const list = this.promptsSubject.value
        .filter(p => isPromptLive(p, now) && p.isFeatured)
        .slice(0, take);
      return of(list);
    }
    return this.http.get<Prompt[]>(`${environment.apiUrl}/prompts/featured?take=${take}`);
  }

  getLivePromptByIdOrSlug(idOrSlug: string): Observable<Prompt | undefined> {
    if (environment.useMockData) {
      const now = new Date();
      const isNum = !isNaN(Number(idOrSlug));
      const found = this.promptsSubject.value.find(p => {
        const matches = isNum ? p.id === Number(idOrSlug) || p.slug === idOrSlug : p.slug === idOrSlug;
        return matches && isPromptLive(p, now);
      });
      return of(found ? { ...found } : undefined);
    }
    return this.http.get<Prompt>(`${environment.apiUrl}/prompts/details/${idOrSlug}`);
  }

  getCategories(): Observable<string[]> {
    if (environment.useMockData) {
      const now = new Date();
      const categories = Array.from(
        new Set(
          this.promptsSubject.value
            .filter(p => isPromptLive(p, now))
            .map(p => p.category)
        )
      ).sort();
      return of(categories);
    }
    return this.http.get<string[]>(`${environment.apiUrl}/prompts/categories`);
  }

  // --- Admin Operations ---

  getAllPromptsForAdmin(search?: string | null, category?: string | null, statusFilter?: string | null): Observable<Prompt[]> {
    if (environment.useMockData) {
      const now = new Date();
      let list = [...this.promptsSubject.value];

      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        list = list.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.keywords && p.keywords.toLowerCase().includes(q))
        );
      }

      if (category && category !== 'All') {
        list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }

      if (statusFilter && statusFilter !== 'All') {
        list = list.filter(p => getPromptStatus(p, now) === statusFilter);
      }

      list.sort((a, b) => new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime());
      return of(list);
    }

    return this.http.get<Prompt[]>(`${environment.apiUrl}/admin/prompts`, {
      params: { search: search || '', category: category || '', status: statusFilter || '' }
    });
  }

  getPromptWithInstructionsById(id: number): Observable<Prompt | undefined> {
    if (environment.useMockData) {
      const found = this.promptsSubject.value.find(p => p.id === id);
      return of(found ? JSON.parse(JSON.stringify(found)) : undefined);
    }
    return this.http.get<Prompt>(`${environment.apiUrl}/admin/prompts/${id}`);
  }

  createPrompt(prompt: Partial<Prompt>): Observable<Prompt> {
    if (environment.useMockData) {
      const list = [...this.promptsSubject.value];
      const newId = Math.max(...list.map(p => p.id), 0) + 1;
      const slug = prompt.slug?.trim() || this.generateSlug(prompt.title || `prompt-${newId}`);

      const newPrompt: Prompt = {
        id: newId,
        title: prompt.title || 'Untitled Prompt',
        slug,
        description: prompt.description || '',
        category: prompt.category || 'Facebook Reels',
        keywords: prompt.keywords || '',
        promptText: prompt.promptText || '',
        isPublished: prompt.isPublished ?? true,
        isFeatured: prompt.isFeatured ?? false,
        startsAtUtc: prompt.startsAtUtc || null,
        endsAtUtc: prompt.endsAtUtc || null,
        createdAtUtc: new Date().toISOString(),
        updatedAtUtc: new Date().toISOString(),
        instructions: (prompt.instructions || []).map((ins, idx) => ({
          id: idx + 1,
          promptId: newId,
          sortOrder: idx + 1,
          instructionText: ins.instructionText
        }))
      };

      list.unshift(newPrompt);
      this.promptsSubject.next(list);
      return of(newPrompt);
    }

    return this.http.post<Prompt>(`${environment.apiUrl}/admin/prompts`, prompt);
  }

  updatePrompt(prompt: Partial<Prompt>): Observable<Prompt> {
    if (environment.useMockData) {
      const list = [...this.promptsSubject.value];
      const index = list.findIndex(p => p.id === prompt.id);
      if (index !== -1) {
        const slug = prompt.slug?.trim() || this.generateSlug(prompt.title || list[index].title);
        const updated: Prompt = {
          ...list[index],
          ...prompt,
          slug,
          updatedAtUtc: new Date().toISOString(),
          instructions: (prompt.instructions || []).map((ins, idx) => ({
            id: ins.id || idx + 1,
            promptId: prompt.id!,
            sortOrder: idx + 1,
            instructionText: ins.instructionText
          }))
        };
        list[index] = updated;
        this.promptsSubject.next(list);
        return of(updated);
      }
      throw new Error('Prompt not found');
    }

    return this.http.put<Prompt>(`${environment.apiUrl}/admin/prompts/${prompt.id}`, prompt);
  }

  deletePrompt(id: number): Observable<boolean> {
    if (environment.useMockData) {
      const current = this.promptsSubject.value.filter(p => p.id !== id);
      this.promptsSubject.next(current);
      return of(true);
    }
    return this.http.delete<boolean>(`${environment.apiUrl}/admin/prompts/${id}`);
  }

  togglePublish(id: number): Observable<boolean> {
    if (environment.useMockData) {
      const list = [...this.promptsSubject.value];
      const item = list.find(p => p.id === id);
      if (item) {
        item.isPublished = !item.isPublished;
        item.updatedAtUtc = new Date().toISOString();
        this.promptsSubject.next(list);
        return of(true);
      }
      return of(false);
    }
    return this.http.post<boolean>(`${environment.apiUrl}/admin/prompts/${id}/toggle-publish`, {});
  }

  toggleFeature(id: number): Observable<boolean> {
    if (environment.useMockData) {
      const list = [...this.promptsSubject.value];
      const item = list.find(p => p.id === id);
      if (item) {
        item.isFeatured = !item.isFeatured;
        item.updatedAtUtc = new Date().toISOString();
        this.promptsSubject.next(list);
        return of(true);
      }
      return of(false);
    }
    return this.http.post<boolean>(`${environment.apiUrl}/admin/prompts/${id}/toggle-feature`, {});
  }

  getPromptCounts(): Observable<{ total: number; live: number; scheduled: number; draft: number; expired: number }> {
    if (environment.useMockData) {
      const now = new Date();
      const list = this.promptsSubject.value;
      const counts = {
        total: list.length,
        live: list.filter(p => getPromptStatus(p, now) === PromptStatus.Live).length,
        scheduled: list.filter(p => getPromptStatus(p, now) === PromptStatus.Scheduled).length,
        draft: list.filter(p => getPromptStatus(p, now) === PromptStatus.Draft).length,
        expired: list.filter(p => getPromptStatus(p, now) === PromptStatus.Expired).length
      };
      return of(counts);
    }
    return this.http.get<{ total: number; live: number; scheduled: number; draft: number; expired: number }>(`${environment.apiUrl}/admin/prompts/counts`);
  }
}
