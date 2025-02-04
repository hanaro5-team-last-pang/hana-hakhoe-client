'use server';

import { SESSION_COOKIE_NAME } from '@/constant';
import { BaseResType, Jwt } from '@/types/hanaHakdang';
import { fetcher } from '@/utils/fetcher';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ActionResType,
  LoginType,
  MenteeSignUpType,
  MentorSignUpType,
} from './type';

export async function sendEmail(email: string) {
  const res = await fetcher('POST', '/send-email', {
    body: JSON.stringify(email),
  });

  const data = await res.json();
  if (!res.ok) {
    return {
      value: email,
      message: data || '이메일 전송 실패',
      isError: true,
    };
  }

  return { value: email, message: '이메일 전송 성공', isError: false };
}

export async function verifyEmail(
  email: string,
  authToken: string
): Promise<{ message: string; isError: boolean }> {
  const res = await fetcher(
    'POST',
    `/verify-email?email=${encodeURIComponent(email)}&authToken=${encodeURIComponent(authToken)}`
  );

  const data = await res.json();
  if (!res.ok) {
    console.error('서버 오류 메시지:', data.message);
    throw new Error(data.message || '이메일 인증 실패');
  }
  return { message: '이메일 인증 성공', isError: false };
}

export async function menteeSignUp(
  prevState: ActionResType<MenteeSignUpType, string>,
  formData: FormData
): Promise<ActionResType<MenteeSignUpType, string>> {
  const signUpForm: MenteeSignUpType = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmedPassword: formData.get('confirmedPassword') as string,
    birth: formData.get('birth') as string,
  };

  const res = await fetcher('POST', '/signup/mentee', {
    body: JSON.stringify(signUpForm),
  });

  const data = await res.json();
  if (!res.ok) return { value: signUpForm, message: data, isError: true };

  redirect('/login');
}

export async function mentorSignUp(
  prevState: ActionResType<MentorSignUpType, string>,
  formData: FormData
): Promise<ActionResType<MentorSignUpType, string>> {
  const value = Object.fromEntries(formData) as MentorSignUpType;

  const res = await fetcher('POST', '/signup/mentor', {
    body: JSON.stringify(value),
  });

  const data = await res.json();
  if (!res.ok) return { value: value, message: data, isError: true };

  redirect('/login');
}

export async function login(
  prevState: ActionResType<LoginType, string>,
  formData: FormData
): Promise<ActionResType<LoginType, string>> {
  const value: LoginType = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const res = await fetcher('POST', '/login', { body: JSON.stringify(value) });

  if (!res.ok) {
    return {
      value: value,
      message: '이메일 또는 비밀번호가 일치하지 않습니다.',
      isError: true,
    } as ActionResType<LoginType, string>;
  }

  const data = (await res.json()) as BaseResType<Jwt>;

  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: data.result.accessToken,
    httpOnly: true,
  });

  redirect('/');
}
