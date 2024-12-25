export interface Order {
  id: string;
  clientId: string;
  orderNumber: string;
  funeralHome: string;
  videoType: '6min-basic' | '6min-scenery' | '9min-basic' | '9min-scenery';
  subjectName: string;
  status: 'pending' | 'in-progress' | 'review' | 'completed';
  requestedDeliveryDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'music' | 'cover' | 'scenery' | 'verse';
  url: string;
  thumbnail?: string;
  duration?: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  favorites: {
    music: string[];
    covers: string[];
    scenery: string[];
    verses: string[];
  };
}