'use server';

import { LectureType } from '@/app/(main)/mentorings/type';
import { BASE_HEADERS, BASE_URL } from '@/constant';
import { ActionResType } from '@/types/hanaHakdang';
import { checkAuthAndGetCookie } from '@/utils/CheckCookies';
import { notFound } from 'next/navigation';

/**
 * 멘티의 수강신청을 위한 action
 */

export async function enrollLecture(
  lectureId: number
): Promise<ActionResType<LectureType, string>> {
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
  return result.message;
}

export async function withdrawLecture(
  lectureId: number
): Promise<ActionResType<LectureType, string>> {
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
