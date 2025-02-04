'use server';

import {
  openMentoringFormType,
  MentoringResponseType,
  ProfileRequestType,
  ProfileResponseType,
  MenteeMentoringsResType,
} from '@/app/(main)/mypage/type';
import { AccountType, ActionResType, BaseResType } from '@/types/hanaHakdang';
import { checkAuthAndGetCookie } from '@/utils/CheckCookies';
import { fetcher } from '@/utils/fetcher';
import { redirect } from 'next/navigation';

// 멘토의 멘토링 리스트 조회
export async function getMentorings(): Promise<MentoringResponseType> {
  const accessJwtCookie = await checkAuthAndGetCookie();

  const res = await fetcher('GET', '/lectures/queue/mentor', {
    jwt: accessJwtCookie.value,
  });

  const data = await res.json();
  return data.result;
}

export async function getAccountData(): Promise<AccountType> {
  return {
    name: '중일',
    birth: '2024년 10월 10일',
    profileImage: 'https://placehold.co/25x25',
  };
}

// 멘토의 명함 조회, 수정
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

// 멘토링 등록
export async function openMentoring(
  formData: FormData
): Promise<ActionResType<openMentoringFormType, string>> {
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

  console.log('🚀 Sending FormData:', formDataForSubmission);

  const res = await fetch(`${BASE_URL}/lectures/register`, {
    method: 'POST',
    headers: {
      Cookie: `${jsessionIdCookie?.name}=${jsessionIdCookie?.value}`,
    },
    body: formDataForSubmission,
  });

  const responseData = await res.json();

  if (res.ok && res.status === 200) {
    console.log(responseData);
    redirect('/mypage/mentorings');
  } else {
    console.log('Error:', responseData.message || '등록 실패');
  }

  redirect('/mypage/mentorings');

  console.log(value);
  const res = await fetcher('POST', '/lectures/register', {
    body: JSON.stringify(value),
    jwt: accessJwtCookie.value,
  });

  const data = await res.json();
  if (!res.ok) {
    console.log(data.message);
  }

  console.log(data);
  redirect('/mypage/mentorings');
}

//멘티의 멘토링 수강 신청 조회 : 시작 전
export async function getMentoringsForMentee(): Promise<MenteeMentoringsResType> {
  const jsessionIdCookie = await checkAuthAndGetCookie();

  const page = 0; // 원하는 페이지 값

  const res = await fetch(`${BASE_URL}/lectures/queue/mentee?page=${page}`, {
    method: 'GET',
    headers: {
      Cookie: `${jsessionIdCookie?.name}=${jsessionIdCookie?.value}`,
    },
  });

  const data = (await res.json()) as BaseResType<MenteeMentoringsResType>;
  return data.result;
}

//멘티의 멘토링 수강 신청 조회 : 완료 기록
export async function getMentoringsHistory(): Promise<MenteeMentoringsResType> {
  const jsessionIdCookie = await checkAuthAndGetCookie();

  const page = 0; // 원하는 페이지 값 받아오기

  const res = await fetch(`${BASE_URL}/lectures/history/mentee?page=${page}`, {
    method: 'GET',
    headers: {
      Cookie: `${jsessionIdCookie?.name}=${jsessionIdCookie?.value}`,
    },
  });

  const data = (await res.json()) as BaseResType<MenteeMentoringsResType>;
  return data.result;
}
