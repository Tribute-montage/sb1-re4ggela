```typescript
export interface Asset {
  id: string;
  type: 'music' | 'cover' | 'scenery' | 'verse';
  name: string;
  content?: string; // For verse text content
  url?: string; // For media files (music, cover, scenery)
  thumbnailUrl?: string;
  duration?: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```