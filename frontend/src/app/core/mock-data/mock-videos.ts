import { FeaturedVideo } from '../models/featured-video.model';

export const MOCK_VIDEOS: FeaturedVideo[] = [
  {
    id: 1,
    Title: 'Facebook Criteria Unlock & Monetization Guide',
    Description: 'Learn how to hit 5,000 followers and 60,000 watch minutes fast using organic Reels strategies.',
    VideoUrlOrId: 'dQw4w9WgXcQ',
    SortOrder: 1,
    IsActive: true,
    CreatedAtUtc: '2026-10-15T00:00:00Z'
  } as unknown as FeaturedVideo,
  {
    id: 2,
    Title: 'Viral Reels Algorithm Secrets 2026',
    Description: 'Step-by-step breakdown of how Facebook\'s recommendation algorithm distributes short videos.',
    VideoUrlOrId: 'jNQXAC9IVRw',
    SortOrder: 2,
    IsActive: true,
    CreatedAtUtc: '2026-10-18T00:00:00Z'
  } as unknown as FeaturedVideo
].map(v => ({
  id: (v as any).id,
  title: (v as any).Title,
  description: (v as any).Description,
  videoUrlOrId: (v as any).VideoUrlOrId,
  sortOrder: (v as any).SortOrder,
  isActive: (v as any).IsActive,
  createdAtUtc: (v as any).CreatedAtUtc
}));
