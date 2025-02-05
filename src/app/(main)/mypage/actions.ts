'use server';

import {
  MentoringResponseType,
  ProfileRequestType,
  ProfileResponseType,
  MenteeMentoringResType,
} from '@/app/(main)/mypage/type';
import { ActionResType, BaseResType } from '@/types/hanaHakdang';
import { checkAuthAndGetCookie } from '@/utils/CheckCookies';
import { fetcher } from '@/utils/fetcher';

/**
 * 멘토의 멘토링 리스트 조회
 */
export async function getMentorings(): Promise<MentoringResponseType> {
  const accessJwtCookie = await checkAuthAndGetCookie();

  const res = await fetcher('GET', '/lectures/queue/mentor', {
    jwt: accessJwtCookie.value,
  });

  const data = (await res.json()) as BaseResType<MentoringResponseType>;
  return data.result;
}

/**
 * 멘토의 명함 조회, 수정
 */
export async function getProfile(): Promise<ProfileResponseType> {
  const accessJwtCookie = await checkAuthAndGetCookie();

  const res = await fetcher('GET', '/profile-card/me', {
    jwt: accessJwtCookie.value,
  });

  const data = (await res.json()) as BaseResType<ProfileResponseType>;
  if (!res.ok) {
    console.log(data.message);
  }
  return data.result;
}

export async function ModifyProfile(
  prevState: ActionResType<ProfileRequestType, string>,
  formData: ProfileRequestType
): Promise<ActionResType<ProfileRequestType, string>> {
  const accessJwtCookie = await checkAuthAndGetCookie();

  const res = await fetcher('PATCH', '/profile-card', {
    body: JSON.stringify(formData),
    jwt: accessJwtCookie.value,
  });

  const data = await res.json();
  if (!res.ok) {
    console.log(data.message);
  }
  return data.message;
}

/**
 * 멘토링 등록
 * @param formData
 */
export async function openMentoring(
  formData: FormData
): Promise<ActionResType<string, string>> {
  const accessJwtCookie = await checkAuthAndGetCookie();

  const data = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    startTime: formData.get('start_time') as string,
    endTime: formData.get('end_time') as string,
    maxParticipants: Number(formData.get('max_participants')),
    category: formData.get('category') as string,
    tags: formData.getAll('tags').map(Number),
  };

  const formDataForSubmission = new FormData();
  formDataForSubmission.append('imageFile', formData.get('imageFile') as File);
  formDataForSubmission.append(
    'data',
    new Blob([JSON.stringify(data)], { type: 'application/json' })
  );
  console.log(data);
  console.log('🚀 Sending FormData:', formDataForSubmission);

  const res = await fetcher('POST', '/lectures/register', {
    jwt: accessJwtCookie.value,
    body: formDataForSubmission,
    header: {},
  });

  const responseData = (await res.json()) as BaseResType<null>;

  if (!res.ok) {
    return {
      value: '',
      message: responseData.message,
      isError: true,
    };
  }
  return {
    value: '',
    message: responseData.message,
    isError: false,
  };
}

/**
 * 멘티의 멘토링 수강 신청 조회 : 시작 전 & 수강 완료
 */
export async function getMentoringForMentee(): Promise<MenteeMentoringResType> {
  const accessJwtCookie = await checkAuthAndGetCookie();

  const res = await fetcher('GET', `/lectures/queue/mentee`, {
    jwt: accessJwtCookie.value,
  });

  const data = (await res.json()) as BaseResType<MenteeMentoringResType>;
  return data.result;
}

export async function getMentoringHistory(): Promise<MenteeMentoringResType> {
  const accessJwtCookie = await checkAuthAndGetCookie();

  const res = await fetcher('GET', `/lectures/history/mentee`, {
    jwt: accessJwtCookie.value,
  });

  const data = (await res.json()) as BaseResType<MenteeMentoringResType>;
  return data.result;
}
