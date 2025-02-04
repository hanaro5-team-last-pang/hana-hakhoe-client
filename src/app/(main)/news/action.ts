'use server';

import { NewsType } from '@/app/(main)/news/type';
import { fetcher } from '@/utils/fetcher';

export async function getNewsData(retry = 1): Promise<NewsType[]> {
  const res = await fetcher('GET', `/news`);

  if (!res.ok) {
    console.log('No news data found. Requesting crawling...');
    if (retry > 0) {
      const crawlingData = await requestCrawling(); // 크롤링 후 데이터 반환

      if (Array.isArray(crawlingData) && crawlingData.length > 0) {
        return crawlingData;
      }

      return await getNewsData(retry - 1);
    }
    return []; // 재시도 후에도 데이터가 없으면 빈 배열 반환
  }

  const data = await res.json();
  return data.result ?? [];
}

export async function requestCrawling(): Promise<void> {
  const res = await fetcher('POST', '/news/request-crawling');

  if (!res.ok) {
    console.error('Crawling request failed:', res.statusText);
  }
}
