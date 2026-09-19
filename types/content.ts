export interface Content {
  _id?: string;
  videoId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  channelId?: string;
  channelTitle?: string;
  publishedAt?: string;
  duration?: string;
  viewCount?: number;
  interest?: string;
  source?: string;
}