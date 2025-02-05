export type NewsType = {
  totalCount: number;
  newsList: newsList[];
};

export type newsList = {
  id: number;
  title: string;
  content: string;
  newsUrl: string;
  newsThumbnailUrl: string;
  createdAt: string;
};
