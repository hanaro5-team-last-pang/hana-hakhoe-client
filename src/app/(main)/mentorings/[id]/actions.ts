'use server';

import { BASE_HEADERS } from '@/constant';
import { BaseResType } from '@/types/hanaHakdang';
import { checkAuthAndGetCookie } from '@/utils/CheckCookies';
import { notFound } from 'next/navigation';

const BASE_URL = process.env.BASE_URL;

/**
 * 멘티의 수강신청을 위한 action
 */

export async function enrollLecture(
  lectureId: number
): Promise<BaseResType<string>> {
  const jsessionIdCookie = await checkAuthAndGetCookie();

  const res = await fetch(BASE_URL + `/lectures/${lectureId}/enroll`, {
    method: 'POST',
    headers: {
      ...BASE_HEADERS,
      Cookie: `${jsessionIdCookie?.name}=${jsessionIdCookie?.value}`,
    },
  });

  if (!res.ok) {
    notFound();
  }

  const result = await res.json();

  return result.result;
}

export async function withdrawLecture(
  lectureId: number
): Promise<BaseResType<string>> {
  const jsessionIdCookie = await checkAuthAndGetCookie();

  const res = await fetch(BASE_URL + `/lectures/${lectureId}/enroll`, {
    method: 'DELETE',
    headers: {
      ...BASE_HEADERS,
      Cookie: `${jsessionIdCookie?.name}=${jsessionIdCookie?.value}`,
    },
  });

  if (!res.ok) {
    notFound();
  }

  const result = await res.json();

  return result.result;
}
