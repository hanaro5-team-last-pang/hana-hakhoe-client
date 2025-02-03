'use server';

import {
  openMentoringFormType,
  MentoringResponseType,
  ProfileRequestType,
  ProfileResponseType,
} from '@/app/(main)/mypage/type';
import { BASE_URL, BASE_HEADERS } from '@/constant';
import { AccountType, ActionResType, BaseResType } from '@/types/hanaHakdang';
import { checkAuthAndGetCookie } from '@/utils/CheckCookies';
import { redirect } from 'next/navigation';

// 멘토의 멘토링 리스트 조회
export async function getMentorings(): Promise<MentoringResponseType> {
  const jsessionIdCookie = await checkAuthAndGetCookie();

  const res = await fetch(`${BASE_URL}/lectures/queue/mentor`, {
    method: 'GET',
    headers: {
      Cookie: `${jsessionIdCookie?.name}=${jsessionIdCookie?.value}`,
    },
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
  const jsessionIdCookie = await checkAuthAndGetCookie();

  const res = await fetch(`${BASE_URL}/profile-card/me`, {
    method: 'GET',
    headers: {
      Cookie: `${jsessionIdCookie?.name}=${jsessionIdCookie?.value}`,
    },
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
  const jsessionIdCookie = await checkAuthAndGetCookie();

  const res = await fetch(`${BASE_URL}/profile-card`, {
    method: 'PATCH',
    body: JSON.stringify(formData),
    headers: {
      ...BASE_HEADERS,
      Cookie: `${jsessionIdCookie?.name}=${jsessionIdCookie?.value}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    console.log(data.message);
  }
  return data.message;
}

// 멘토링 등록
export async function openMentoring(
  prevState: ActionResType<openMentoringFormType, string>,
  formData: FormData
): Promise<ActionResType<openMentoringFormType, string>> {
  const jsessionIdCookie = await checkAuthAndGetCookie();

  const value: openMentoringFormType = {
    imageFile: formData.get('imageFile') as string,
    data: {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      start_time: new Date(
        `${formData.get('date')}T${formData.get('start_time')}:00`
      ).toISOString(),
      end_time: new Date(
        `${formData.get('date')}T${formData.get('end_time')}:00`
      ).toISOString(),
      max_participants: Number(formData.get('max_participants')),
      category: formData.get('category') as string,
      tags: Array.from(formData.getAll('tags[]')).map((tag) => tag as string),
    },
  };

  console.log(value);
  const res = await fetch(`${BASE_URL}/lectures/register`, {
    method: 'POST',
    body: JSON.stringify(value),
    headers: {
      ...BASE_HEADERS,
      Cookie: `${jsessionIdCookie?.name}=${jsessionIdCookie?.value}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    console.log(data.message);
  }

  console.log(data);
  redirect('/mypage/mentorings');
}
