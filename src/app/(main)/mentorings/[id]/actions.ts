'use server';

import { LectureType } from '@/app/(main)/mentorings/type';
import { ActionResType } from '@/types/hanaHakdang';
import { checkAuthAndGetCookie } from '@/utils/CheckCookies';
import { fetcher } from '@/utils/fetcher';
import { notFound } from 'next/navigation';

/**
 * 멘티의 수강신청을 위한 action
 */

export async function enrollLecture(
  lectureId: number
): Promise<ActionResType<LectureType, string>> {
  const accessJwtCookie = await checkAuthAndGetCookie();

  const res = await fetcher('POST', `/lectures/${lectureId}/enroll`, {
    jwt: accessJwtCookie.value,
  });

  if (!res.ok) {
    notFound();
  }
  const result = await res.json();
  return result.message;
}

export async function withdrawLecture(
  enrollmentId: number
): Promise<ActionResType<LectureType, string>> {
  const accessJwtCookie = await checkAuthAndGetCookie();

  const res = await fetcher(
    'DELETE',
    `/lectures/${enrollmentId}/enroll-withdraw`,
    {
      jwt: accessJwtCookie.value,
    }
  );

  if (!res.ok) {
    notFound();
  }
  const result = await res.json();
  return result.result;
}
