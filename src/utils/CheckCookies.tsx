import { SESSION_COOKIE_NAME } from '@/constant';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const checkAuthAndGetCookie = async () => {
  const accessJwtCookie = await getAuthCookie();

  // 쿠키가 없으면 로그인 페이지로 리디렉션
  if (!accessJwtCookie) {
    redirect('/login');
  }

  return accessJwtCookie;
};

export const getAuthCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME);
};
