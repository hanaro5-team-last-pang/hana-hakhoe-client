'use server';

import {
  EnterClassroomResType,
  StartClassroomResType,
} from '@/app/(main)/mypage/type';
import { checkAuthAndGetCookie } from '@/utils/CheckCookies';
import { fetcher } from '@/utils/fetcher';

export async function startClassroom(
  classroomId: BigInt
): Promise<StartClassroomResType> {
  const accessJwtCookie = await checkAuthAndGetCookie();

  const res = await fetcher('POST', `/classrooms/${classroomId}/start`, {
    jwt: accessJwtCookie.value,
  });

  console.log(res);

  const data = await res.json();
  return data.result;
}

export async function enterClassroom(
  classroomId: BigInt
): Promise<EnterClassroomResType> {
  const accessJwtCookie = await checkAuthAndGetCookie();

  const res = await fetcher('POST', `/classrooms/${classroomId}/enter`, {
    jwt: accessJwtCookie.value,
  });

  console.log(res);

  const data = await res.json();
  return data.result;
}
