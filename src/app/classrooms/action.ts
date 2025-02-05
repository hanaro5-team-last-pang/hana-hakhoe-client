'use server';

import {
  EnterClassroomResType,
  StartClassroomResType,
} from '@/app/(main)/mypage/type';
import { BaseResType } from '@/types/hanaHakdang';
import { checkAuthAndGetCookie } from '@/utils/CheckCookies';
import { fetcher } from '@/utils/fetcher';
import { notFound } from 'next/navigation';

export async function startClassroom(
  classroomId: string
): Promise<StartClassroomResType> {
  const accessJwtCookie = await checkAuthAndGetCookie();

  console.log('start classroom...', classroomId, accessJwtCookie);
  const res = await fetcher('POST', `/classrooms/${classroomId}/start`, {
    jwt: accessJwtCookie.value,
  });

  console.log('get response of staring classroom', res);
  if (!res.ok) {
    notFound();
  }

  const data = (await res.json()) as BaseResType<StartClassroomResType>;
  return data.result;
}

export async function enterClassroom(
  classroomId: string
): Promise<EnterClassroomResType> {
  const accessJwtCookie = await checkAuthAndGetCookie();

  const res = await fetcher('POST', `/classrooms/${classroomId}/enter`, {
    jwt: accessJwtCookie.value,
  });

  console.log(res);

  if (!res.ok) {
    notFound();
  }

  const data = (await res.json()) as BaseResType<EnterClassroomResType>;
  return data.result;
}

export async function terminateClassroom(classroomId: string): Promise<void> {
  const accessJwtCookie = await checkAuthAndGetCookie();
  const res = await fetcher('POST', `/classrooms/${classroomId}/terminate`, {
    jwt: accessJwtCookie.value,
  });

  console.log(res.ok, res);

  if (!res.ok) {
    notFound();
  }
}
