'use server';

import { NewsType } from '@/app/(main)/news/type';
import { BASE_HEADERS, BASE_URL } from '@/constant';
import { BaseResType } from '@/types/hanaHakdang';
import { cookies } from 'next/headers';

export async function getNewsData(): Promise<NewsType[]> {
  const cookieStore = await cookies();

  const jsessionIdCookie = cookieStore.get('JSESSIONID');

  const res = await fetch(BASE_URL + '/news', {
    headers: {
      ...BASE_HEADERS,
      Cookie: `${jsessionIdCookie?.name}=${jsessionIdCookie?.value}`,
    },
  });

  const data = (await res.json()) as BaseResType<NewsType[]>;
  return data.result;
}
