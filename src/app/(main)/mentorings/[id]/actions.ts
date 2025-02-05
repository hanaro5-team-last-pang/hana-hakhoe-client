'use server';

import { ActionResType, BaseResType } from '@/types/hanaHakdang';
import { checkAuthAndGetCookie } from '@/utils/CheckCookies';
import { fetcher } from '@/utils/fetcher';
import { notFound } from 'next/navigation';

/**
 * 멘티의 수강신청을 위한 action
 */

export async function enrollLecture(
  lectureId: number
): Promise<ActionResType<null, string>> {
  const accessJwtCookie = await checkAuthAndGetCookie();

  const res = await fetcher('POST', `/lectures/${lectureId}/enroll`, {
    jwt: accessJwtCookie.value,
  });

  if (!res.ok) {
    return {
      value: null,
      message: '수강 신청에 실패했습니다.',
      isError: true,
    };
  }
  const result = (await res.json()) as BaseResType<null>;
  return {
    value: null,
    message: result.message,
    isError: false,
  };
}

//수강 취소
export async function withdrawLecture(
  enrollmentId: number
): Promise<ActionResType<null, string>> {
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
  return result.message;
}
