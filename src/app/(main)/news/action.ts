'use server';

import { NewsType } from '@/app/(main)/news/type';
import { BaseResType } from '@/types/hanaHakdang';
import { fetcher } from '@/utils/fetcher';

export async function getNewsData(): Promise<NewsType[]> {
  const res = await fetcher('GET', '/news');

  const data = (await res.json()) as BaseResType<NewsType[]>;
  return data.result;
}
