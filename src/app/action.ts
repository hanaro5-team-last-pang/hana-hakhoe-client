'use server';

import { BASE_HEADERS, BASE_URL } from '@/constant';
import {
  ActionResType,
  BaseResType,
  SubmitReviewFormType,
  AuthType,
  ChangeProfileFormType,
} from '@/types/hanaHakdang';
import { cookies } from 'next/headers';

//검색 서버액션 예시
export async function handleSearchAction(formData: FormData) {
  const searchTerm = formData.get('search')?.toString() || '';
  console.log('Searching for:', searchTerm);
}

export async function changeProfileForm(
  prevState: ActionResType<ChangeProfileFormType, string>,
  formData: FormData
): Promise<ActionResType<ChangeProfileFormType, string>> {
  const value = Object.fromEntries(formData) as ChangeProfileFormType;
  const message = '프로필 폼 데이터 변경 액션';

  return {
    value: value,
    message: message,
    isError: false,
  };
}

export async function submitReview(
  prevState: ActionResType<SubmitReviewFormType, string>,
  formData: FormData
): Promise<ActionResType<SubmitReviewFormType, string>> {
  const value = Object.fromEntries(formData) as SubmitReviewFormType;
  const message = '후기 제출 액션';

  return {
    value: value,
    message: message,
    isError: false,
  };
}

export async function getMyAuthData(): Promise<AuthType> {
  const cookieStore = await cookies();
  const jsessionIdCookie = cookieStore.get('JSESSIONID');

  const res = await fetch(`${BASE_URL}/user-info`, {
    method: 'GET',
    headers: {
      ...BASE_HEADERS,
      Cookie: `${jsessionIdCookie?.name}=${jsessionIdCookie?.value}`,
    },
  });

  const data = (await res.json()) as BaseResType<AuthType>;
  if (!res.ok) {
    console.log(`Failed to fetch user info: ${data.message}`);
  }

  return data.result;
}
