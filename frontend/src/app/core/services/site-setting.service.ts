import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SiteSetting } from '../models/site-setting.model';
import { FeaturedVideo } from '../models/featured-video.model';
import { MOCK_SITE_SETTINGS } from '../mock-data/mock-settings';
import { MOCK_VIDEOS } from '../mock-data/mock-videos';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SiteSettingService {
  private settingsSubject = new BehaviorSubject<SiteSetting>({ ...MOCK_SITE_SETTINGS });
  private videosSubject = new BehaviorSubject<FeaturedVideo[]>([...MOCK_VIDEOS]);

  constructor(private http: HttpClient) {}

  getSettings(): Observable<SiteSetting> {
    if (environment.useMockData) {
      return this.settingsSubject.asObservable();
    }
    return this.http.get<SiteSetting>(`${environment.apiUrl}/settings`);
  }

  getSettingsSnapshot(): SiteSetting {
    return this.settingsSubject.value;
  }

  updateSettings(settings: SiteSetting): Observable<SiteSetting> {
    if (environment.useMockData) {
      const updated = { ...settings, updatedAtUtc: new Date().toISOString() };
      this.settingsSubject.next(updated);
      return of(updated);
    }
    return this.http.put<SiteSetting>(`${environment.apiUrl}/settings`, settings);
  }

  getActiveVideos(): Observable<FeaturedVideo[]> {
    if (environment.useMockData) {
      const active = this.videosSubject.value
        .filter(v => v.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      return of(active);
    }
    return this.http.get<FeaturedVideo[]>(`${environment.apiUrl}/videos/active`);
  }

  getAllVideos(): Observable<FeaturedVideo[]> {
    if (environment.useMockData) {
      const all = [...this.videosSubject.value].sort((a, b) => a.sortOrder - b.sortOrder);
      return of(all);
    }
    return this.http.get<FeaturedVideo[]>(`${environment.apiUrl}/videos`);
  }

  getVideoById(id: number): Observable<FeaturedVideo | undefined> {
    if (environment.useMockData) {
      const found = this.videosSubject.value.find(v => v.id === id);
      return of(found ? { ...found } : undefined);
    }
    return this.http.get<FeaturedVideo>(`${environment.apiUrl}/videos/${id}`);
  }

  saveVideo(video: Partial<FeaturedVideo>): Observable<FeaturedVideo> {
    if (environment.useMockData) {
      const list = [...this.videosSubject.value];
      if (video.id && video.id > 0) {
        const index = list.findIndex(v => v.id === video.id);
        if (index !== -1) {
          list[index] = { ...list[index], ...video } as FeaturedVideo;
          this.videosSubject.next(list);
          return of(list[index]);
        }
      }
      const newVideo: FeaturedVideo = {
        id: Math.max(...list.map(v => v.id), 0) + 1,
        title: video.title || 'Untitled Video',
        description: video.description || '',
        videoUrlOrId: video.videoUrlOrId || '',
        sortOrder: video.sortOrder || list.length + 1,
        isActive: video.isActive !== undefined ? video.isActive : true,
        createdAtUtc: new Date().toISOString()
      };
      list.push(newVideo);
      this.videosSubject.next(list);
      return of(newVideo);
    }
    return this.http.post<FeaturedVideo>(`${environment.apiUrl}/videos`, video);
  }

  deleteVideo(id: number): Observable<boolean> {
    if (environment.useMockData) {
      const current = this.videosSubject.value.filter(v => v.id !== id);
      this.videosSubject.next(current);
      return of(true);
    }
    return this.http.delete<boolean>(`${environment.apiUrl}/videos/${id}`);
  }
}
